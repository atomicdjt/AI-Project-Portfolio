import { BUILDINGS, CIVILIZATIONS, DISASTERS, SAVE_VERSION, TECHNOLOGIES } from './data.js';

// Creates a fresh game state without sharing nested objects between resets or tests.
export function createInitialState(timestamp = Date.now()) {
  return {
    schemaVersion: SAVE_VERSION,
    gold: 150,
    research: 30,
    territory: 4,
    totalGold: 0,
    totalMinutes: 0,
    sessions: 0,
    buildings: { farm: 1 },
    unlocked: ['farm'],
    researched: [],
    sessionHistory: [],
    log: [
      {
        type: 'system',
        icon: 'Landmark',
        title: 'Your Hamlet Awaits',
        detail: 'Start a focus session to grow your civilization.',
        timestamp,
      },
    ],
    preferences: {
      sound: false,
      compactNumbers: true,
    },
  };
}

// Returns the highest civilization threshold reached by cumulative earned gold.
export function getCivilizationLevel(totalGold) {
  for (let index = CIVILIZATIONS.length - 1; index >= 0; index -= 1) {
    if (totalGold >= CIVILIZATIONS[index].threshold) return index;
  }
  return 0;
}

// Returns progress from the current civilization threshold to the next one.
export function getCivilizationProgress(totalGold) {
  const level = getCivilizationLevel(totalGold);
  if (level === CIVILIZATIONS.length - 1) return 1;
  const current = CIVILIZATIONS[level].threshold;
  const next = CIVILIZATIONS[level + 1].threshold;
  return Math.min(1, Math.max(0, (totalGold - current) / (next - current)));
}

// Calculates passive per-second rates from owned buildings and global technology effects.
export function calculateRates(buildings, researched) {
  let goldPerSecond = 2 / 60;
  let researchPerSecond = 0.5 / 60;

  Object.entries(buildings).forEach(([key, count]) => {
    const building = BUILDINGS[key];
    if (!building || count <= 0) return;
    goldPerSecond += building.goldPerSecond * count;
    researchPerSecond += building.researchPerSecond * count;
  });

  if (researched.includes('economics')) goldPerSecond *= 2;
  if (researched.includes('efficiency')) researchPerSecond *= 2;

  return { goldPerSecond, researchPerSecond };
}

// Counts occupied territory tiles across all owned building types.
export function countBuildings(buildings) {
  return Object.values(buildings).reduce((total, count) => total + Math.max(0, count), 0);
}

// Purchases one building after checking unlock, cap, territory, and gold requirements.
export function buyBuilding(state, buildingId) {
  const building = BUILDINGS[buildingId];
  if (!building) return { ok: false, reason: 'unknown', state };
  if (!state.unlocked.includes(buildingId)) return { ok: false, reason: 'locked', state };
  if ((state.buildings[buildingId] || 0) >= building.max) return { ok: false, reason: 'maximum', state };
  if (countBuildings(state.buildings) >= state.territory) return { ok: false, reason: 'territory', state };
  if (state.gold < building.cost) return { ok: false, reason: 'gold', state };

  const nextState = {
    ...state,
    gold: state.gold - building.cost,
    buildings: {
      ...state.buildings,
      [buildingId]: (state.buildings[buildingId] || 0) + 1,
    },
    log: [
      {
        type: 'build',
        icon: building.icon,
        title: `${building.name} Constructed`,
        detail: `${building.description} ${building.cost} gold invested.`,
        timestamp: Date.now(),
      },
      ...state.log.slice(0, 49),
    ],
  };

  return { ok: true, reason: null, state: nextState };
}

// Researches one technology and applies its building unlock when present.
export function applyResearch(state, technologyId) {
  const technology = TECHNOLOGIES.find((item) => item.id === technologyId);
  if (!technology) return { ok: false, reason: 'unknown', state };
  if (state.researched.includes(technologyId)) return { ok: false, reason: 'researched', state };
  if (state.research < technology.cost) return { ok: false, reason: 'research', state };

  const unlocked = technology.unlocks && !state.unlocked.includes(technology.unlocks)
    ? [...state.unlocked, technology.unlocks]
    : state.unlocked;

  return {
    ok: true,
    reason: null,
    state: {
      ...state,
      research: state.research - technology.cost,
      researched: [...state.researched, technologyId],
      unlocked,
      log: [
        {
          type: 'research',
          icon: technology.icon,
          title: `Researched: ${technology.name}`,
          detail: technology.description,
          timestamp: Date.now(),
        },
        ...state.log.slice(0, 49),
      ],
    },
  };
}

// Credits passive session earnings before completion or disaster settlement.
export function creditSessionEarnings(state, earnedGold, earnedResearch) {
  return {
    ...state,
    gold: state.gold + earnedGold,
    research: state.research + earnedResearch,
    totalGold: state.totalGold + earnedGold,
  };
}

// Applies one named disaster with reference mitigation and optional building loss.
export function applyDisaster(state, disasterId, random = Math.random) {
  const disaster = DISASTERS.find((item) => item.id === disasterId) || DISASTERS[0];
  const hasResilience = state.researched.includes('resilience');
  const barracksCount = state.buildings.barracks || 0;
  const resilienceMultiplier = hasResilience ? 0.5 : 1;
  const barracksMultiplier = barracksCount > 0 ? Math.max(0.3, 1 - barracksCount * 0.15) : 1;
  const goldLost = Math.floor(state.gold * disaster.loss * resilienceMultiplier * barracksMultiplier);
  const buildings = { ...state.buildings };
  let destroyedBuilding = null;

  if (disaster.destroysBuilding) {
    const candidates = Object.keys(buildings).filter((key) => buildings[key] > 0);
    if (candidates.length > 0) {
      const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));
      destroyedBuilding = candidates[index];
      buildings[destroyedBuilding] -= 1;
      if (buildings[destroyedBuilding] === 0) delete buildings[destroyedBuilding];
    }
  }

  const buildingDetail = destroyedBuilding ? ` A ${BUILDINGS[destroyedBuilding].name} was destroyed.` : '';
  const nextState = {
    ...state,
    gold: Math.max(0, state.gold - goldLost),
    buildings,
    log: [
      {
        type: 'disaster',
        icon: disaster.icon,
        title: disaster.name,
        detail: `${disaster.description} Lost ${goldLost} gold.${buildingDetail}`,
        timestamp: Date.now(),
      },
      ...state.log.slice(0, 49),
    ],
  };

  return { state: nextState, disaster, goldLost, destroyedBuilding };
}

// Settles a completed focus session, including passive earnings, bonus, and territory.
export function completeSession(state, session) {
  const earnedGold = Math.max(0, Number(session.earnedGold) || 0);
  const earnedResearch = Math.max(0, Number(session.earnedResearch) || 0);
  const durationMinutes = Math.max(1, Math.round(session.durationMinutes));
  const bonusGold = durationMinutes * 5;
  const completedAt = session.completedAt || Date.now();
  const settled = creditSessionEarnings(state, earnedGold + bonusGold, earnedResearch);
  const record = {
    id: `${completedAt}-${state.sessions + 1}`,
    completedAt,
    durationMinutes,
    earnedGold,
    earnedResearch,
    bonusGold,
    intention: String(session.intention || '').trim(),
  };

  return {
    bonusGold,
    record,
    state: {
      ...settled,
      territory: state.territory + 1,
      totalMinutes: state.totalMinutes + durationMinutes,
      sessions: state.sessions + 1,
      sessionHistory: [record, ...state.sessionHistory].slice(0, 365),
      log: [
        {
          type: 'complete',
          icon: 'CircleCheckBig',
          title: `${durationMinutes}m Session Complete`,
          detail: `Earned ${Math.floor(earnedGold + bonusGold)} gold, ${Math.floor(earnedResearch)} research, and 1 territory.`,
          timestamp: completedAt,
        },
        ...state.log.slice(0, 49),
      ],
    },
  };
}

// Produces a stable local calendar date key in a requested IANA time zone.
function dateKey(timestamp, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

// Converts a date key to a UTC day number for reliable consecutive-day comparisons.
function dayNumber(key) {
  const [year, month, day] = key.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

// Calculates current and best consecutive-day focus streaks.
export function getStreakSummary(sessionHistory, now = Date.now(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const keys = [...new Set(sessionHistory.map((session) => dateKey(session.completedAt, timeZone)))];
  const days = keys.map(dayNumber).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let previous = null;

  days.forEach((day) => {
    run = previous !== null && day === previous + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  });

  const today = dayNumber(dateKey(now, timeZone));
  const daySet = new Set(days);
  let cursor = daySet.has(today) ? today : today - 1;
  let current = 0;
  while (daySet.has(cursor)) {
    current += 1;
    cursor -= 1;
  }

  return { current, best };
}

// Groups completed sessions into practical time-of-day windows for Chronicle suggestions.
export function analyzeFocusWindows(sessionHistory, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const windows = [
    { id: 'early', label: 'Early watch', start: 0, end: 6 },
    { id: 'morning', label: 'Morning stronghold', start: 6, end: 15 },
    { id: 'afternoon', label: 'Afternoon campaign', start: 15, end: 19 },
    { id: 'evening', label: 'Evening forge', start: 19, end: 24 },
  ];
  const summaries = windows.map((window) => ({ ...window, sessionCount: 0, totalMinutes: 0 }));

  sessionHistory.forEach((session) => {
    const hour = Number(new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(new Date(session.completedAt)));
    const target = summaries.find((window) => hour >= window.start && hour < window.end);
    if (!target) return;
    target.sessionCount += 1;
    target.totalMinutes += session.durationMinutes || 0;
  });

  return summaries
    .map((window) => ({
      ...window,
      averageMinutes: window.sessionCount ? Math.round(window.totalMinutes / window.sessionCount) : 0,
      score: window.sessionCount ? Math.min(99, 55 + window.sessionCount * 8 + Math.min(20, window.averageMinutes / 3)) : 0,
    }))
    .sort((a, b) => b.score - a.score || b.totalMinutes - a.totalMinutes);
}

// Validates the persistent game shape before accepting imported or stored data.
export function validateGameState(value) {
  if (!value || typeof value !== 'object') return false;
  if (value.schemaVersion !== SAVE_VERSION) return false;
  const numericKeys = ['gold', 'research', 'territory', 'totalGold', 'totalMinutes', 'sessions'];
  if (numericKeys.some((key) => !Number.isFinite(value[key]) || value[key] < 0)) return false;
  if (!value.buildings || typeof value.buildings !== 'object') return false;
  if (Object.entries(value.buildings).some(([key, count]) => !BUILDINGS[key] || !Number.isInteger(count) || count < 0)) return false;
  if (!Array.isArray(value.unlocked) || value.unlocked.some((key) => !BUILDINGS[key])) return false;
  if (!Array.isArray(value.researched) || value.researched.some((id) => !TECHNOLOGIES.some((tech) => tech.id === id))) return false;
  if (!Array.isArray(value.log) || !Array.isArray(value.sessionHistory)) return false;
  return true;
}
