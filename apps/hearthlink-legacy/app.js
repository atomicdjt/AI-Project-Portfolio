const $ = (id) => document.getElementById(id);

const TEXT_CHANNELS = [
  { id: 'commons', label: 'commons', description: 'General room chat.' },
  { id: 'plans', label: 'plans', description: 'Coordinate schedules, games, links, and hangouts.' },
  { id: 'media', label: 'media-drop', description: 'Share screenshots, memes, and images.' },
  { id: 'quiet', label: 'quiet-table', description: 'Low-noise notes and focus updates.' }
];

const VOICE_CHANNELS = [
  { id: 'hearth', label: 'Hearth' },
  { id: 'lounge', label: 'Lounge' },
  { id: 'focus', label: 'Focus' }
];

const CONFIG = {
  appName: 'HearthLink P2P',
  signalingUrl: '',
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  roomSizeLimit: 10,
  maxImageBytes: 1_500_000,
  demoMode: false,
  ...(globalThis.HEARTHLINK_CONFIG || {})
};
const MAX_PACKET_CHARS = 12_000;
const MAX_LOCAL_MESSAGES = 650;
const TYPING_TTL = 2800;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const EMOJIS = ['👍', '😂', '🔥', '💡', '✅'];

const state = {
  ws: null,
  reconnectTimer: null,
  reconnectAttempts: 0,
  manuallyClosed: false,
  roomId: '',
  roomKeyText: '',
  appKey: null,
  self: null,
  peers: new Map(),
  rtcConfig: { iceServers: CONFIG.iceServers },
  activeChannel: 'commons',
  voiceChannel: '',
  localStream: null,
  muted: false,
  deafened: false,
  messages: [],
  posts: [],
  pins: [],
  typing: new Map(),
  selectedAccent: '#8b5cf6'
};

function resolveSignalingUrl() {
  if (CONFIG.signalingUrl) {
    return CONFIG.signalingUrl.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:');
  }
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${location.host}`;
  }
  return '';
}

function isDemoMode() {
  return Boolean(CONFIG.demoMode || !resolveSignalingUrl());
}

function formatBytes(bytes) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${Math.round(bytes / 1000)} KB`;
  return `${bytes} bytes`;
}

function updateConfigStatus() {
  const node = $('configStatus');
  if (!node) return;
  const signaling = resolveSignalingUrl();
  if (isDemoMode()) {
    node.className = 'status-panel warn';
    node.textContent = 'Demo/offline mode: no signaling server is configured. You can explore the interface locally, but peers cannot join.';
    return;
  }
  node.className = 'status-panel ok';
  node.textContent = `Signaling target: ${signaling}`;
}

function randomId(prefix = '') {
  if (globalThis.crypto?.randomUUID) return `${prefix}${crypto.randomUUID()}`;
  const raw = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}${raw}`;
}

function sanitizeRoom(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 48);
}

function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('') || '?';
}

function nowTime(ts = Date.now()) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(ts));
}

function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  $('toastRegion').append(node);
  setTimeout(() => node.remove(), 4200);
}

function storageKey() {
  return `hearthlink:v1:${state.roomId}`;
}

function saveLocal() {
  if (!state.roomId) return;
  const payload = {
    messages: state.messages.slice(-MAX_LOCAL_MESSAGES),
    posts: state.posts.slice(-100),
    pins: state.pins.slice(-100)
  };
  localStorage.setItem(storageKey(), JSON.stringify(payload));
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return;
    const payload = JSON.parse(raw);
    state.messages = Array.isArray(payload.messages) ? payload.messages : [];
    state.posts = Array.isArray(payload.posts) ? payload.posts : [];
    state.pins = Array.isArray(payload.pins) ? payload.pins : [];
  } catch {
    state.messages = [];
    state.posts = [];
    state.pins = [];
  }
}

async function deriveRoomKey(passphrase, roomId) {
  if (!passphrase) return null;
  if (!crypto.subtle) throw new Error('Passphrase encryption needs a secure browser context. Use localhost or HTTPS.');
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(`hearthlink:${roomId}`), iterations: 250_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sealAppMessage(appMessage) {
  if (!state.appKey) return { kind: 'plain', payload: appMessage };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(appMessage));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, state.appKey, plaintext);
  return {
    kind: 'secure',
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(ciphertext))
  };
}

async function openAppEnvelope(envelope) {
  if (envelope.kind === 'plain') return envelope.payload;
  if (envelope.kind !== 'secure') return null;
  if (!state.appKey) {
    toast('Received encrypted peer data, but this browser has no matching room passphrase.');
    return null;
  }
  try {
    const iv = base64ToBytes(envelope.iv);
    const data = base64ToBytes(envelope.data);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, state.appKey, data);
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    toast('Could not decrypt a peer message. Check that everyone used the same passphrase.');
    return null;
  }
}

function signal(to, payload) {
  if (state.ws?.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ type: 'signal', to, signal: payload }));
  }
}

function updateServerProfile() {
  if (state.ws?.readyState !== WebSocket.OPEN || !state.self) return;
  state.ws.send(JSON.stringify({
    type: 'profile-update',
    profile: {
      name: state.self.name,
      accent: state.self.accent,
      status: state.self.status,
      voiceChannel: state.voiceChannel
    }
  }));
}

function sendPacket(dc, envelope) {
  if (!dc || dc.readyState !== 'open') return;
  const text = JSON.stringify(envelope);
  if (text.length <= MAX_PACKET_CHARS) {
    dc.send(text);
    return;
  }
  const chunkId = randomId('chunk_');
  const total = Math.ceil(text.length / MAX_PACKET_CHARS);
  for (let index = 0; index < total; index += 1) {
    dc.send(JSON.stringify({
      kind: 'chunk',
      chunkId,
      index,
      total,
      part: text.slice(index * MAX_PACKET_CHARS, (index + 1) * MAX_PACKET_CHARS)
    }));
  }
}

async function broadcastApp(type, payload) {
  const appMessage = {
    type,
    from: state.self.id,
    sentAt: Date.now(),
    payload
  };
  const envelope = await sealAppMessage(appMessage);
  for (const peer of state.peers.values()) sendPacket(peer.dc, envelope);
}

function ensurePeer(profile) {
  const peerId = profile.id;
  if (!peerId || peerId === state.self.id) return null;
  const existing = state.peers.get(peerId);
  if (existing) {
    existing.profile = { ...existing.profile, ...profile };
    return existing;
  }

  const pc = new RTCPeerConnection(state.rtcConfig);
  const peer = {
    id: peerId,
    profile: { ...profile },
    pc,
    dc: null,
    chunks: new Map(),
    makingOffer: false,
    ignoreOffer: false,
    isSettingRemoteAnswerPending: false,
    polite: state.self.id > peerId,
    remoteStream: null,
    audioEl: null
  };
  state.peers.set(peerId, peer);

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) signal(peerId, { candidate });
  };

  pc.onconnectionstatechange = () => {
    renderMembers();
    renderStats();
  };

  pc.ontrack = (event) => {
    peer.remoteStream = event.streams[0] || peer.remoteStream || new MediaStream();
    if (!event.streams[0] && event.track) peer.remoteStream.addTrack(event.track);
    if (!peer.audioEl) {
      peer.audioEl = document.createElement('audio');
      peer.audioEl.autoplay = true;
      peer.audioEl.playsInline = true;
      peer.audioEl.dataset.peerId = peer.id;
      $('audioStage').append(peer.audioEl);
    }
    peer.audioEl.srcObject = peer.remoteStream;
    updateAudioElements();
  };

  pc.ondatachannel = (event) => setupDataChannel(peer, event.channel);

  pc.onnegotiationneeded = async () => {
    try {
      peer.makingOffer = true;
      await pc.setLocalDescription();
      signal(peerId, { description: pc.localDescription });
    } catch (error) {
      console.warn('Negotiation failed', error);
    } finally {
      peer.makingOffer = false;
    }
  };

  if (state.self.id < peerId) {
    setupDataChannel(peer, pc.createDataChannel('hearthlink-data', { ordered: true }));
  }

  if (state.localStream) addLocalTracks(peer);
  renderMembers();
  renderStats();
  return peer;
}

function setupDataChannel(peer, dc) {
  peer.dc = dc;
  dc.binaryType = 'arraybuffer';
  dc.onopen = async () => {
    await broadcastProfileSnapshot(peer);
    renderMembers();
    renderStats();
  };
  dc.onclose = () => {
    renderMembers();
    renderStats();
  };
  dc.onerror = () => toast(`Peer data channel issue with ${peer.profile.name || 'a peer'}.`);
  dc.onmessage = (event) => handlePeerData(peer, event.data);
}

async function broadcastProfileSnapshot(peer) {
  const payload = {
    id: state.self.id,
    name: state.self.name,
    accent: state.self.accent,
    status: state.self.status,
    voiceChannel: state.voiceChannel
  };
  const envelope = await sealAppMessage({ type: 'profile', from: state.self.id, sentAt: Date.now(), payload });
  sendPacket(peer.dc, envelope);
}

async function handlePeerData(peer, raw) {
  let packet;
  try { packet = JSON.parse(String(raw)); } catch { return; }

  if (packet.kind === 'chunk') {
    const record = peer.chunks.get(packet.chunkId) || { parts: [], total: packet.total, received: 0, createdAt: Date.now() };
    if (!record.parts[packet.index]) record.received += 1;
    record.parts[packet.index] = packet.part;
    peer.chunks.set(packet.chunkId, record);
    if (record.received !== record.total) return;
    peer.chunks.delete(packet.chunkId);
    try { packet = JSON.parse(record.parts.join('')); } catch { return; }
  }

  const appMessage = await openAppEnvelope(packet);
  if (!appMessage?.type) return;
  applyAppMessage(appMessage, peer.id);
}

function applyAppMessage(appMessage, peerId) {
  const { type, payload, sentAt } = appMessage;
  if (type === 'profile') {
    const peer = state.peers.get(peerId);
    if (peer) peer.profile = { ...peer.profile, ...payload, id: peerId };
    renderAll();
    return;
  }

  if (type === 'chat') {
    addMessage({ ...payload, timestamp: payload.timestamp || sentAt }, false);
    return;
  }

  if (type === 'reaction') {
    applyReaction(payload.messageId, payload.emoji, payload.authorId || peerId);
    return;
  }

  if (type === 'pin') {
    addPin(payload, false);
    return;
  }

  if (type === 'post') {
    addPost({ ...payload, timestamp: payload.timestamp || sentAt }, false);
    return;
  }

  if (type === 'typing') {
    if (payload.channel !== state.activeChannel) return;
    state.typing.set(peerId, { name: payload.name || 'Someone', expires: Date.now() + TYPING_TTL });
    renderTyping();
  }
}

async function handleSignal(from, payload) {
  const peer = ensurePeer({ id: from, name: 'Peer', accent: '#64748b', status: 'online' });
  if (!peer) return;
  const pc = peer.pc;

  try {
    if (payload.description) {
      const description = payload.description;
      const readyForOffer = !peer.makingOffer && (pc.signalingState === 'stable' || peer.isSettingRemoteAnswerPending);
      const offerCollision = description.type === 'offer' && !readyForOffer;
      peer.ignoreOffer = !peer.polite && offerCollision;
      if (peer.ignoreOffer) return;

      peer.isSettingRemoteAnswerPending = description.type === 'answer';
      await pc.setRemoteDescription(description);
      peer.isSettingRemoteAnswerPending = false;

      if (description.type === 'offer') {
        if (state.localStream) addLocalTracks(peer);
        await pc.setLocalDescription();
        signal(from, { description: pc.localDescription });
      }
    } else if (payload.candidate) {
      try {
        await pc.addIceCandidate(payload.candidate);
      } catch (error) {
        if (!peer.ignoreOffer) throw error;
      }
    }
  } catch (error) {
    console.warn('Signal handling failed', error);
    toast('WebRTC negotiation had a problem. Try refreshing if a peer does not connect.');
  }
}

function addLocalTracks(peer) {
  if (!state.localStream) return;
  const senders = peer.pc.getSenders();
  for (const track of state.localStream.getTracks()) {
    const alreadyAdded = senders.some((sender) => sender.track === track);
    if (!alreadyAdded) peer.pc.addTrack(track, state.localStream);
  }
}

function removeLocalTracks(peer) {
  for (const sender of peer.pc.getSenders()) {
    if (sender.track?.kind === 'audio') peer.pc.removeTrack(sender);
  }
}

async function joinVoice(channelId) {
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('This browser does not expose microphone capture here. Use HTTPS or localhost.');
    return;
  }
  try {
    if (!state.localStream) {
      state.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
    }
    state.voiceChannel = channelId;
    state.self.voiceChannel = channelId;
    state.localStream.getAudioTracks().forEach((track) => { track.enabled = !state.muted; });
    for (const peer of state.peers.values()) addLocalTracks(peer);
    updateServerProfile();
    await broadcastApp('profile', { ...state.self, voiceChannel: state.voiceChannel });
    updateAudioElements();
    renderAll();
  } catch (error) {
    console.warn(error);
    toast('Microphone permission failed or was blocked by the browser.');
  }
}

async function leaveVoice() {
  state.voiceChannel = '';
  state.self.voiceChannel = '';
  if (state.localStream) {
    for (const peer of state.peers.values()) removeLocalTracks(peer);
    state.localStream.getTracks().forEach((track) => track.stop());
    state.localStream = null;
  }
  updateServerProfile();
  await broadcastApp('profile', { ...state.self, voiceChannel: '' });
  updateAudioElements();
  renderAll();
}

function updateAudioElements() {
  for (const peer of state.peers.values()) {
    if (!peer.audioEl) continue;
    const sameVoice = Boolean(state.voiceChannel) && peer.profile.voiceChannel === state.voiceChannel;
    peer.audioEl.muted = state.deafened || !sameVoice;
    peer.audioEl.volume = sameVoice ? 1 : 0;
  }
}

function renderTextChannels() {
  const nav = $('textChannels');
  nav.replaceChildren();
  for (const channel of TEXT_CHANNELS) {
    const btn = document.createElement('button');
    btn.className = `channel-button ${state.activeChannel === channel.id ? 'active' : ''}`;
    btn.type = 'button';
    const label = document.createElement('span');
    label.textContent = `# ${channel.label}`;
    const count = document.createElement('span');
    count.className = 'channel-tag';
    count.textContent = state.messages.filter((m) => m.channel === channel.id).length;
    btn.append(label, count);
    btn.onclick = () => {
      state.activeChannel = channel.id;
      renderAll();
    };
    nav.append(btn);
  }
}

function renderVoiceChannels() {
  const nav = $('voiceChannels');
  nav.replaceChildren();
  for (const channel of VOICE_CHANNELS) {
    const members = [state.self, ...[...state.peers.values()].map((p) => p.profile)]
      .filter((profile) => profile?.voiceChannel === channel.id);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `channel-button ${state.voiceChannel === channel.id ? 'active' : ''}`;
    const label = document.createElement('span');
    label.textContent = `◉ ${channel.label}`;
    const count = document.createElement('span');
    count.className = 'channel-tag';
    count.textContent = members.length ? `${members.length}` : '';
    btn.append(label, count);
    btn.onclick = () => {
      if (isDemoMode()) {
        toast('Voice needs a live signaling server and another connected browser.');
        return;
      }
      joinVoice(channel.id);
    };
    nav.append(btn);
  }

  $('muteBtn').textContent = state.muted ? 'Mic off' : 'Mic on';
  $('deafenBtn').textContent = state.deafened ? 'Sound off' : 'Sound on';
  $('leaveVoiceBtn').disabled = !state.voiceChannel;
}

function renderMembers() {
  const list = $('memberList');
  if (!list) return;
  list.replaceChildren();
  const profiles = [state.self, ...[...state.peers.values()].map((p) => p.profile)].filter(Boolean);
  for (const profile of profiles) {
    const item = document.createElement('div');
    item.className = `member ${profile.voiceChannel ? 'in-voice' : ''}`;
    const av = document.createElement('div');
    av.className = 'avatar';
    av.style.background = profile.accent || '#64748b';
    av.textContent = initials(profile.name);

    const meta = document.createElement('div');
    meta.className = 'member-meta';
    const name = document.createElement('div');
    name.className = 'member-name';
    name.textContent = profile.id === state.self.id ? `${profile.name} (you)` : profile.name;
    const status = document.createElement('div');
    status.className = 'member-status';
    const voice = VOICE_CHANNELS.find((v) => v.id === profile.voiceChannel)?.label;
    status.textContent = voice ? `In ${voice}` : 'online';
    meta.append(name, status);
    item.append(av, meta);
    list.append(item);
  }
}

function renderMessages() {
  const wrap = $('messages');
  wrap.replaceChildren();
  const filtered = state.messages.filter((message) => message.channel === state.activeChannel);
  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-note';
    empty.textContent = 'No messages here yet. Send the first one.';
    wrap.append(empty);
    return;
  }

  for (const message of filtered) {
    if (message.system) {
      const sys = document.createElement('div');
      sys.className = 'system-message';
      sys.textContent = message.body;
      wrap.append(sys);
      continue;
    }

    const row = document.createElement('article');
    row.className = 'message';
    row.dataset.messageId = message.id;

    const av = document.createElement('div');
    av.className = 'avatar';
    av.style.background = message.accent || '#64748b';
    av.textContent = initials(message.authorName);

    const content = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'message-head';
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = message.authorName || 'Unknown';
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = nowTime(message.timestamp);
    head.append(author, time);

    const body = document.createElement('div');
    body.className = 'message-body';
    body.textContent = message.body || '';
    content.append(head, body);

    if (message.imageData) {
      const img = document.createElement('img');
      img.className = 'message-image';
      img.alt = message.imageName || 'Shared image';
      img.src = message.imageData;
      content.append(img);
    }

    const reactions = document.createElement('div');
    reactions.className = 'reaction-row';
    const reactionEntries = Object.entries(message.reactions || {}).filter(([, users]) => users?.length);
    for (const [emoji, users] of reactionEntries) {
      const pill = document.createElement('span');
      pill.className = 'reaction-pill';
      pill.textContent = `${emoji} ${users.length}`;
      reactions.append(pill);
    }
    if (reactionEntries.length) content.append(reactions);

    const actions = document.createElement('div');
    actions.className = 'message-actions';
    for (const emoji of EMOJIS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = emoji;
      btn.title = `React ${emoji}`;
      btn.onclick = () => reactToMessage(message.id, emoji);
      actions.append(btn);
    }
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.textContent = 'Pin';
    pin.onclick = () => pinMessage(message.id);
    actions.append(pin);
    content.append(actions);

    row.append(av, content);
    wrap.append(row);
  }

  wrap.scrollTop = wrap.scrollHeight;
}

function renderPosts() {
  const list = $('postsList');
  list.replaceChildren();
  if (!state.posts.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-note';
    empty.textContent = 'No bulletin posts yet.';
    list.append(empty);
    return;
  }
  for (const post of [...state.posts].sort((a, b) => b.timestamp - a.timestamp)) {
    const card = document.createElement('article');
    card.className = 'post-card';
    const title = document.createElement('h4');
    title.textContent = post.title || 'Untitled post';
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = `${post.authorName || 'Unknown'} · ${new Date(post.timestamp).toLocaleString()}`;
    const body = document.createElement('p');
    body.textContent = post.body || '';
    card.append(title, meta, body);
    list.append(card);
  }
}

function renderPins() {
  const list = $('pinsList');
  list.replaceChildren();
  if (!state.pins.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-note';
    empty.textContent = 'Pinned messages will appear here.';
    list.append(empty);
    return;
  }
  for (const pin of [...state.pins].sort((a, b) => b.timestamp - a.timestamp)) {
    const card = document.createElement('article');
    card.className = 'pin-card';
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = `# ${pin.channelLabel || pin.channel} · ${pin.authorName || 'Unknown'} · ${new Date(pin.timestamp).toLocaleString()}`;
    const body = document.createElement('p');
    body.textContent = pin.body || '[image]';
    card.append(meta, body);
    list.append(card);
  }
}

function renderTyping() {
  const now = Date.now();
  for (const [peerId, record] of state.typing) {
    if (record.expires <= now) state.typing.delete(peerId);
  }
  const names = [...state.typing.values()].map((r) => r.name).slice(0, 3);
  $('typingLine').textContent = names.length ? `${names.join(', ')} ${names.length === 1 ? 'is' : 'are'} typing...` : '';
}

function renderStats() {
  $('peerCount').textContent = String(state.peers.size + 1);
  $('securityMode').textContent = isDemoMode() ? 'offline demo' : (state.appKey ? 'WebRTC + passphrase' : 'WebRTC');
  const openPeers = [...state.peers.values()].filter((p) => p.dc?.readyState === 'open').length;
  if (isDemoMode()) {
    $('connectionState').textContent = 'demo/offline';
    return;
  }
  $('connectionState').textContent = state.ws?.readyState === WebSocket.OPEN ? `online - ${openPeers}/${state.peers.size} linked` : 'offline';
}

function renderRoomInfo() {
  $('roomBadge').textContent = state.roomId;
  const channel = TEXT_CHANNELS.find((c) => c.id === state.activeChannel) || TEXT_CHANNELS[0];
  $('activeChannelName').textContent = `# ${channel.label}`;
  $('activeChannelDescription').textContent = channel.description;
}

function renderAll() {
  renderRoomInfo();
  renderTextChannels();
  renderVoiceChannels();
  renderMembers();
  renderMessages();
  renderPosts();
  renderPins();
  renderTyping();
  renderStats();
  updateAudioElements();
}

function addMessage(message, rebroadcast = true) {
  if (state.messages.some((m) => m.id === message.id)) return;
  state.messages.push({ reactions: {}, ...message });
  state.messages = state.messages.slice(-MAX_LOCAL_MESSAGES);
  saveLocal();
  renderAll();
  if (rebroadcast) broadcastApp('chat', message);
}

function addSystem(body) {
  addMessage({
    id: randomId('sys_'),
    channel: state.activeChannel,
    system: true,
    body,
    timestamp: Date.now()
  }, false);
}

function applyReaction(messageId, emoji, authorId) {
  const message = state.messages.find((m) => m.id === messageId);
  if (!message) return;
  message.reactions ||= {};
  message.reactions[emoji] ||= [];
  if (!message.reactions[emoji].includes(authorId)) message.reactions[emoji].push(authorId);
  saveLocal();
  renderMessages();
}

function reactToMessage(messageId, emoji) {
  applyReaction(messageId, emoji, state.self.id);
  broadcastApp('reaction', { messageId, emoji, authorId: state.self.id });
}

function addPin(pin, rebroadcast = true) {
  if (state.pins.some((p) => p.messageId === pin.messageId)) return;
  state.pins.push(pin);
  saveLocal();
  renderPins();
  if (rebroadcast) broadcastApp('pin', pin);
}

function pinMessage(messageId) {
  const message = state.messages.find((m) => m.id === messageId);
  if (!message) return;
  const channel = TEXT_CHANNELS.find((c) => c.id === message.channel);
  const pin = {
    messageId,
    channel: message.channel,
    channelLabel: channel?.label || message.channel,
    authorName: message.authorName,
    body: message.body || (message.imageData ? '[image]' : ''),
    timestamp: Date.now()
  };
  addPin(pin, true);
  toast('Pinned for everyone currently connected.');
}

function addPost(post, rebroadcast = true) {
  if (state.posts.some((p) => p.id === post.id)) return;
  state.posts.push(post);
  saveLocal();
  renderPosts();
  if (rebroadcast) broadcastApp('post', post);
}

async function compressImage(file) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Unsupported image type');
  }
  if (file.size <= 420_000) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  const maxSide = 1280;
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const output = canvas.toDataURL('image/jpeg', 0.76);
  if (output.length > CONFIG.maxImageBytes * 1.45) throw new Error('Prepared image is too large');
  return output;
}

function wireUi() {
  for (const dot of document.querySelectorAll('.accent-dot')) {
    dot.addEventListener('click', () => {
      state.selectedAccent = dot.dataset.accent;
      document.documentElement.style.setProperty('--accent', state.selectedAccent);
      document.querySelectorAll('.accent-dot').forEach((node) => node.classList.remove('selected'));
      dot.classList.add('selected');
    });
  }

  $('randomRoomBtn').onclick = () => {
    $('roomId').value = `room-${Math.random().toString(36).slice(2, 9)}`;
    if (!$('roomKey').value) $('roomKey').value = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  };

  $('joinBtn').onclick = () => startJoin();

  $('composer').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('messageInput');
    const body = input.value.trim();
    if (!body) return;
    input.value = '';
    input.style.height = '';
    addMessage({
      id: randomId('msg_'),
      channel: state.activeChannel,
      authorId: state.self.id,
      authorName: state.self.name,
      accent: state.self.accent,
      body,
      timestamp: Date.now()
    }, true);
  });

  $('messageInput').addEventListener('input', () => {
    const input = $('messageInput');
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
    throttleTyping();
  });

  $('attachBtn').onclick = () => $('imageInput').click();
  $('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast('Use a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    if (file.size > CONFIG.maxImageBytes) {
      toast(`Image is too large. Limit is ${formatBytes(CONFIG.maxImageBytes)}.`);
      return;
    }
    try {
      toast('Preparing image for peer transfer...');
      const imageData = await compressImage(file);
      addMessage({
        id: randomId('img_'),
        channel: state.activeChannel,
        authorId: state.self.id,
        authorName: state.self.name,
        accent: state.self.accent,
        body: $('messageInput').value.trim(),
        imageData,
        imageName: file.name,
        timestamp: Date.now()
      }, true);
      $('messageInput').value = '';
    } catch {
      toast('Could not prepare that image. Try a smaller file.');
    }
  });

  $('copyInviteBtn').onclick = async () => {
    const params = new URLSearchParams({ room: state.roomId });
    if (state.roomKeyText) params.set('key', state.roomKeyText);
    const invite = `${location.origin}${location.pathname}#${params.toString()}`;
    await navigator.clipboard.writeText(invite);
    toast('Invite copied. The passphrase is in the URL hash, not sent to the server.');
  };

  $('muteBtn').onclick = () => {
    state.muted = !state.muted;
    state.localStream?.getAudioTracks().forEach((track) => { track.enabled = !state.muted; });
    renderVoiceChannels();
  };

  $('deafenBtn').onclick = () => {
    state.deafened = !state.deafened;
    updateAudioElements();
    renderVoiceChannels();
  };

  $('leaveVoiceBtn').onclick = () => leaveVoice();

  $('togglePostsBtn').onclick = () => $('postsPanel').classList.toggle('hidden');
  $('closePostsBtn').onclick = () => $('postsPanel').classList.add('hidden');
  $('togglePinsBtn').onclick = () => $('pinsPanel').classList.toggle('hidden');
  $('closePinsBtn').onclick = () => $('pinsPanel').classList.add('hidden');

  $('postForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = $('postTitle').value.trim();
    const body = $('postBody').value.trim();
    if (!title && !body) return;
    $('postTitle').value = '';
    $('postBody').value = '';
    addPost({
      id: randomId('post_'),
      title: title || 'Untitled post',
      body,
      authorId: state.self.id,
      authorName: state.self.name,
      accent: state.self.accent,
      timestamp: Date.now()
    }, true);
  });

  $('exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify({ roomId: state.roomId, exportedAt: new Date().toISOString(), messages: state.messages, posts: state.posts, pins: state.pins }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hearthlink-${state.roomId}-history.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  $('clearBtn').onclick = () => {
    if (!confirm('Clear local history for this room on this browser? Connected peers keep their own local copies.')) return;
    state.messages = [];
    state.posts = [];
    state.pins = [];
    saveLocal();
    renderAll();
  };
}

let lastTypingSent = 0;
function throttleTyping() {
  const now = Date.now();
  if (now - lastTypingSent < 900 || !state.self) return;
  lastTypingSent = now;
  broadcastApp('typing', { channel: state.activeChannel, name: state.self.name });
}
setInterval(renderTyping, 1000);

async function startJoin() {
  const name = ($('displayName').value.trim() || localStorage.getItem('hearthlink:name') || 'Guest').slice(0, 40);
  const roomId = sanitizeRoom($('roomId').value || 'my-friends');
  const passphrase = $('roomKey').value;
  if (!roomId) {
    toast('Enter a room code.');
    return;
  }
  localStorage.setItem('hearthlink:name', name);
  localStorage.setItem('hearthlink:accent', state.selectedAccent);

  state.roomId = roomId;
  state.roomKeyText = passphrase;
  state.appKey = await deriveRoomKey(passphrase, roomId);
  state.self = {
    id: randomId('peer_').replace(/[^a-zA-Z0-9_-]/g, ''),
    name,
    accent: state.selectedAccent,
    status: 'online',
    voiceChannel: ''
  };

  document.documentElement.style.setProperty('--accent', state.selectedAccent);
  loadLocal();
  if (isDemoMode()) {
    enterDemoMode();
    return;
  }
  connectSocket();
}

function connectSocket() {
  const url = resolveSignalingUrl();
  if (!url) {
    enterDemoMode();
    return;
  }
  if (state.ws && state.ws.readyState !== WebSocket.CLOSED) state.ws.close();
  const ws = new WebSocket(url);
  state.ws = ws;
  state.manuallyClosed = false;
  $('joinBtn').disabled = true;
  $('joinBtn').textContent = 'Connecting...';

  ws.onopen = () => {
    state.reconnectAttempts = 0;
    ws.send(JSON.stringify({ type: 'join', roomId: state.roomId, profile: state.self }));
  };

  ws.onmessage = async (event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }

    if (msg.type === 'joined') {
      state.self.id = msg.selfId || state.self.id;
      state.rtcConfig = msg.config || state.rtcConfig;
      if (Array.isArray(CONFIG.iceServers) && CONFIG.iceServers.length) {
        state.rtcConfig = { ...state.rtcConfig, iceServers: CONFIG.iceServers };
      }
      $('landing').classList.add('hidden');
      $('app').classList.remove('hidden');
      history.replaceState(null, '', `${location.pathname}#${new URLSearchParams({ room: state.roomId }).toString()}`);
      for (const profile of msg.peers || []) ensurePeer(profile);
      addSystem(`Joined ${state.roomId}.`);
      renderAll();
      return;
    }

    if (msg.type === 'peer-joined') {
      ensurePeer(msg.peer);
      addSystem(`${msg.peer.name || 'A peer'} joined.`);
      renderAll();
      return;
    }

    if (msg.type === 'peer-left') {
      const peer = state.peers.get(msg.peerId);
      if (peer) {
        peer.dc?.close();
        peer.pc?.close();
        peer.audioEl?.remove();
        state.peers.delete(msg.peerId);
        addSystem(`${peer.profile.name || 'A peer'} left.`);
      }
      renderAll();
      return;
    }

    if (msg.type === 'profile-update') {
      const peer = state.peers.get(msg.peerId);
      if (peer) peer.profile = { ...peer.profile, ...msg.profile };
      renderAll();
      return;
    }

    if (msg.type === 'signal') {
      await handleSignal(msg.from, msg.signal);
      return;
    }

    if (msg.type === 'error') toast(msg.message || 'Server error.');
  };

  ws.onclose = () => {
    $('connectionState').textContent = 'offline';
    $('joinBtn').disabled = false;
    $('joinBtn').textContent = 'Create / Join Room';
    scheduleReconnect();
  };

  ws.onerror = () => toast('Could not reach the HearthLink signaling server.');
}

function scheduleReconnect() {
  if (state.manuallyClosed || isDemoMode() || !state.roomId || !state.self) return;
  if (state.reconnectTimer) return;
  if (state.reconnectAttempts >= 5) {
    toast('Disconnected from signaling. Rejoin when the server is available.');
    return;
  }
  const delay = Math.min(1000 * 2 ** state.reconnectAttempts, 10_000);
  state.reconnectAttempts += 1;
  $('connectionState').textContent = `reconnecting in ${Math.ceil(delay / 1000)}s`;
  state.reconnectTimer = setTimeout(() => {
    state.reconnectTimer = null;
    connectSocket();
  }, delay);
}

function enterDemoMode() {
  state.ws = null;
  $('landing').classList.add('hidden');
  $('app').classList.remove('hidden');
  addSystem(`Opened ${state.roomId} in demo/offline mode.`);
  toast('Demo/offline mode is active. Configure PUBLIC_SIGNALING_URL for live peer rooms.');
  renderAll();
}

function hydrateFromHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const room = params.get('room');
  const key = params.get('key');
  if (room) $('roomId').value = sanitizeRoom(room);
  if (key) $('roomKey').value = key;
  const storedName = localStorage.getItem('hearthlink:name');
  if (storedName) $('displayName').value = storedName;
  const storedAccent = localStorage.getItem('hearthlink:accent');
  if (storedAccent) {
    state.selectedAccent = storedAccent;
    document.documentElement.style.setProperty('--accent', storedAccent);
    document.querySelectorAll('.accent-dot').forEach((node) => {
      node.classList.toggle('selected', node.dataset.accent === storedAccent);
    });
  }
}

wireUi();
hydrateFromHash();
updateConfigStatus();
renderTextChannels();
