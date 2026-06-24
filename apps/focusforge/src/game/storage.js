import { LEGACY_SAVE_KEY, SAVE_KEY, SAVE_VERSION } from './data.js';
import { createInitialState, validateGameState } from './engine.js';

// Timer state uses a separate key so frequent countdown snapshots do not rewrite the full save.
export const TIMER_KEY = `${SAVE_KEY}:timer`;

// Maps the two abbreviated reference building IDs to their production names.
const LEGACY_BUILDING_IDS = {
  forg: 'forge',
  obs: 'observatory',
};

// Converts a legacy object keyed by old building IDs into the current identifiers.
function migrateBuildingMap(buildings = {}) {
  return Object.fromEntries(
    Object.entries(buildings).map(([key, value]) => [LEGACY_BUILDING_IDS[key] || key, value]),
  );
}

// Converts the reference ff_v4 shape into the validated v5 data model.
export function migrateLegacySave(legacy, now = Date.now()) {
  const initial = createInitialState(now);
  const buildings = migrateBuildingMap(legacy.buildings);
  const unlocked = (legacy.unlocked || ['farm']).map((key) => LEGACY_BUILDING_IDS[key] || key);
  const log = Array.isArray(legacy.log)
    ? legacy.log.map((entry) => ({
      type: entry.t || 'system',
      icon: entry.e || 'Landmark',
      title: entry.n || 'Legacy event',
      detail: entry.d || '',
      timestamp: Number(entry.ts) || now,
    }))
    : initial.log;

  return {
    ...initial,
    schemaVersion: SAVE_VERSION,
    gold: Number(legacy.gold) || 0,
    research: Number(legacy.research) || 0,
    territory: Math.max(1, Number(legacy.territory) || initial.territory),
    totalGold: Number(legacy.totalGold) || 0,
    totalMinutes: Number(legacy.totalMins) || 0,
    sessions: Number(legacy.sessions) || 0,
    buildings,
    unlocked: [...new Set(unlocked)],
    researched: Array.isArray(legacy.researched) ? legacy.researched : [],
    log,
  };
}

// Merges a stored v5 save with current defaults before validating it.
function normalizeCurrentSave(value, now) {
  const initial = createInitialState(now);
  return {
    ...initial,
    ...value,
    buildings: { ...value.buildings },
    unlocked: [...value.unlocked],
    researched: [...value.researched],
    log: [...value.log],
    sessionHistory: [...value.sessionHistory],
    preferences: { ...initial.preferences, ...value.preferences },
  };
}

// Loads the current save, migrates ff_v4 when present, and safely recovers from corruption.
export function loadGame(storage = window.localStorage, now = Date.now()) {
  try {
    const currentRaw = storage.getItem(SAVE_KEY);
    if (currentRaw) {
      const current = normalizeCurrentSave(JSON.parse(currentRaw), now);
      if (validateGameState(current)) return current;
    }

    const legacyRaw = storage.getItem(LEGACY_SAVE_KEY);
    if (legacyRaw) {
      const migrated = migrateLegacySave(JSON.parse(legacyRaw), now);
      if (validateGameState(migrated)) {
        saveGame(migrated, storage);
        storage.removeItem(LEGACY_SAVE_KEY);
        return migrated;
      }
    }
  } catch {
    // Invalid or unavailable storage falls through to a fresh local state.
  }

  return createInitialState(now);
}

// Writes a validated game state and reports whether persistence succeeded.
export function saveGame(state, storage = window.localStorage) {
  if (!validateGameState(state)) return false;
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// Serializes a validated state into a human-readable portable backup.
export function exportGame(state) {
  if (!validateGameState(state)) throw new Error('Cannot export an invalid FocusForge save.');
  return JSON.stringify(state, null, 2);
}

// Parses and validates an imported backup before the caller applies it.
export function importGame(serialized) {
  try {
    const value = JSON.parse(serialized);
    const normalized = normalizeCurrentSave(value, Date.now());
    if (!validateGameState(normalized)) throw new Error('invalid');
    return normalized;
  } catch {
    throw new Error('This is not a valid FocusForge save.');
  }
}

// Removes game and timer data, including the original reference key.
export function clearSavedGame(storage = window.localStorage) {
  try {
    storage.removeItem(SAVE_KEY);
    storage.removeItem(TIMER_KEY);
    storage.removeItem(LEGACY_SAVE_KEY);
  } catch {
    // Reset still succeeds in memory when browser storage is unavailable.
  }
}

// Saves a timer recovery snapshot separately from the main game state.
export function saveTimerSnapshot(snapshot, storage = window.localStorage) {
  try {
    storage.setItem(TIMER_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

// Loads a timer snapshot or returns null when it is absent or malformed.
export function loadTimerSnapshot(storage = window.localStorage) {
  try {
    const raw = storage.getItem(TIMER_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || !['active', 'paused'].includes(value.status)) return null;
    if (!Number.isFinite(value.remainingSeconds) || value.remainingSeconds < 0) return null;
    return value;
  } catch {
    return null;
  }
}

// Clears only the recoverable timer snapshot after settlement or abandonment.
export function clearTimerSnapshot(storage = window.localStorage) {
  try {
    storage.removeItem(TIMER_KEY);
  } catch {
    // The in-memory timer can still be cleared if storage is unavailable.
  }
}

// Reconciles an active snapshot against elapsed wall-clock time after refresh or sleep.
export function normalizeTimerSnapshot(snapshot, now = Date.now()) {
  const status = snapshot?.status === 'paused' ? 'paused' : 'active';
  const parsedUpdatedAt = Number(snapshot?.lastUpdatedAt);
  const lastUpdatedAt = Number.isFinite(parsedUpdatedAt) ? parsedUpdatedAt : now;
  const elapsedSeconds = status === 'active'
    ? Math.max(0, Math.floor((now - lastUpdatedAt) / 1_000))
    : 0;
  const remainingSeconds = Math.max(0, Math.floor(Number(snapshot?.remainingSeconds) || 0) - elapsedSeconds);

  return {
    status: remainingSeconds === 0 && status === 'active' ? 'complete' : status,
    durationMinutes: Math.max(1, Number(snapshot?.durationMinutes) || 25),
    remainingSeconds,
    elapsedSeconds,
    lastUpdatedAt: now,
    earnedGold: Math.max(0, Number(snapshot?.earnedGold) || 0),
    earnedResearch: Math.max(0, Number(snapshot?.earnedResearch) || 0),
    intention: String(snapshot?.intention || ''),
  };
}
