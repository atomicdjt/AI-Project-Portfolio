import { describe, expect, it, vi } from 'vitest';
import {
  analyzeFocusWindows,
  applyDisaster,
  applyResearch,
  buyBuilding,
  calculateRates,
  completeSession,
  createInitialState,
  getCivilizationLevel,
  getCivilizationProgress,
  getStreakSummary,
  validateGameState,
} from './engine.js';

describe('civilization progression', () => {
  it('maps cumulative gold to the six preserved civilization tiers', () => {
    expect(getCivilizationLevel(0)).toBe(0);
    expect(getCivilizationLevel(499)).toBe(0);
    expect(getCivilizationLevel(500)).toBe(1);
    expect(getCivilizationLevel(40_000)).toBe(5);
  });

  it('returns normalized progress within the current tier', () => {
    expect(getCivilizationProgress(250)).toBeCloseTo(0.5);
    expect(getCivilizationProgress(1_250)).toBeCloseTo(0.5);
    expect(getCivilizationProgress(50_000)).toBe(1);
  });
});

describe('economy', () => {
  it('preserves base and building production with technology multipliers', () => {
    const normal = calculateRates({ farm: 1, library: 1 }, []);
    expect(normal.goldPerSecond).toBeCloseTo(4 / 60);
    expect(normal.researchPerSecond).toBeCloseTo(3.5 / 60);

    const boosted = calculateRates({ farm: 1, library: 1 }, ['economics', 'efficiency']);
    expect(boosted.goldPerSecond).toBeCloseTo(8 / 60);
    expect(boosted.researchPerSecond).toBeCloseTo(7 / 60);
  });

  it('requires gold, an unlocked building, capacity, and free territory to build', () => {
    const state = createInitialState(1_700_000_000_000);
    expect(buyBuilding(state, 'mine')).toEqual({ ok: false, reason: 'locked', state });

    const unlocked = { ...state, gold: 500, territory: 3, unlocked: [...state.unlocked, 'mine'] };
    const result = buyBuilding(unlocked, 'mine');
    expect(result.ok).toBe(true);
    expect(result.state.gold).toBe(350);
    expect(result.state.buildings.mine).toBe(1);

    const full = { ...unlocked, territory: 1 };
    expect(buyBuilding(full, 'mine').reason).toBe('territory');
  });
});

describe('research and disasters', () => {
  it('spends research once and unlocks the linked building', () => {
    const state = { ...createInitialState(0), research: 100 };
    const result = applyResearch(state, 'mining');
    expect(result.ok).toBe(true);
    expect(result.state.research).toBe(50);
    expect(result.state.researched).toContain('mining');
    expect(result.state.unlocked).toContain('mine');
    expect(applyResearch(result.state, 'mining').reason).toBe('researched');
  });

  it('applies resilience and barracks mitigation and destroys a building for fire', () => {
    const state = {
      ...createInitialState(0),
      gold: 1_000,
      researched: ['resilience'],
      buildings: { farm: 2, barracks: 2 },
    };
    const result = applyDisaster(state, 'fire', () => 0);
    expect(result.goldLost).toBe(70);
    expect(result.destroyedBuilding).toBe('farm');
    expect(result.state.gold).toBe(930);
    expect(result.state.buildings.farm).toBe(1);
  });
});

describe('session completion and insights', () => {
  it('awards the preserved bonus, territory, lifetime stats, and a session record', () => {
    const state = createInitialState(0);
    const result = completeSession(state, {
      durationMinutes: 25,
      earnedGold: 10.9,
      earnedResearch: 2.8,
      intention: 'Write launch brief',
      completedAt: new Date('2026-06-12T13:30:00Z').getTime(),
    });

    expect(result.bonusGold).toBe(125);
    expect(result.state.gold).toBeCloseTo(285.9);
    expect(result.state.territory).toBe(5);
    expect(result.state.totalMinutes).toBe(25);
    expect(result.state.sessions).toBe(1);
    expect(result.state.sessionHistory[0].intention).toBe('Write launch brief');
  });

  it('learns focus windows and streaks from completed session timestamps', () => {
    const sessions = [
      { completedAt: new Date('2026-06-10T13:15:00Z').getTime(), durationMinutes: 45 },
      { completedAt: new Date('2026-06-11T13:30:00Z').getTime(), durationMinutes: 25 },
      { completedAt: new Date('2026-06-12T14:00:00Z').getTime(), durationMinutes: 60 },
    ];
    const windows = analyzeFocusWindows(sessions, 'UTC');
    expect(windows[0].label).toBe('Morning stronghold');
    expect(windows[0].sessionCount).toBe(3);

    const streak = getStreakSummary(sessions, new Date('2026-06-12T20:00:00Z').getTime(), 'UTC');
    expect(streak.current).toBe(3);
    expect(streak.best).toBe(3);
  });
});

describe('state validation', () => {
  it('accepts a valid state and rejects malformed saves', () => {
    expect(validateGameState(createInitialState(0))).toBe(true);
    expect(validateGameState({ gold: 'infinite' })).toBe(false);
    expect(validateGameState(null)).toBe(false);
  });

  it('creates independent initial states', () => {
    const first = createInitialState(10);
    const second = createInitialState(20);
    first.buildings.farm = 99;
    expect(second.buildings.farm).toBe(1);
    expect(second.log[0].timestamp).toBe(20);
    expect(vi.isMockFunction(Math.random)).toBe(false);
  });
});
