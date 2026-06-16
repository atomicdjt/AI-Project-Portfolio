import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialState } from './engine.js';
import {
  clearSavedGame,
  exportGame,
  importGame,
  loadGame,
  normalizeTimerSnapshot,
  saveGame,
} from './storage.js';
import { LEGACY_SAVE_KEY, SAVE_KEY, SAVE_VERSION } from './data.js';

describe('game persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns a new default state when no save exists', () => {
    const state = loadGame(localStorage, 123);
    expect(state.gold).toBe(150);
    expect(state.log[0].timestamp).toBe(123);
  });

  it('saves and restores a valid versioned state', () => {
    const state = { ...createInitialState(0), gold: 875 };
    expect(saveGame(state, localStorage)).toBe(true);
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)).gold).toBe(875);
    expect(loadGame(localStorage, 1).gold).toBe(875);
  });

  it('falls back safely when the stored JSON is corrupt', () => {
    localStorage.setItem(SAVE_KEY, '{broken');
    const state = loadGame(localStorage, 456);
    expect(state.gold).toBe(150);
    expect(state.schemaVersion).toBe(SAVE_VERSION);
  });

  it('migrates the supplied ff_v4 save shape without losing progress', () => {
    localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify({
      gold: 900,
      research: 80,
      territory: 9,
      totalGold: 2_100,
      totalMins: 75,
      sessions: 3,
      buildings: { farm: 2, forg: 1, obs: 1 },
      unlocked: ['farm', 'forg', 'obs'],
      researched: ['metalwork', 'astronomy'],
      log: [{ t: 'complete', e: 'check', n: 'Done', d: 'Legacy entry', ts: 88 }],
    }));

    const state = loadGame(localStorage, 999);
    expect(state.totalMinutes).toBe(75);
    expect(state.buildings.forge).toBe(1);
    expect(state.buildings.observatory).toBe(1);
    expect(state.unlocked).toContain('forge');
    expect(state.log[0].title).toBe('Done');
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBeNull();
  });

  it('exports and imports only validated save data', () => {
    const state = { ...createInitialState(0), gold: 321 };
    const serialized = exportGame(state);
    expect(importGame(serialized).gold).toBe(321);
    expect(() => importGame('{"gold":"nope"}')).toThrow(/valid FocusForge save/i);
  });

  it('clears both current and legacy save keys', () => {
    localStorage.setItem(SAVE_KEY, '{}');
    localStorage.setItem(LEGACY_SAVE_KEY, '{}');
    clearSavedGame(localStorage);
    expect(localStorage.length).toBe(0);
  });
});

describe('timer snapshot recovery', () => {
  it('subtracts elapsed wall-clock time from active snapshots', () => {
    const snapshot = normalizeTimerSnapshot({
      status: 'active',
      durationMinutes: 25,
      remainingSeconds: 1_200,
      lastUpdatedAt: 10_000,
      earnedGold: 3,
      earnedResearch: 1,
      intention: 'Deep work',
    }, 15_500);

    expect(snapshot.elapsedSeconds).toBe(5);
    expect(snapshot.remainingSeconds).toBe(1_195);
    expect(snapshot.status).toBe('active');
  });

  it('does not consume time from paused snapshots and marks expired active snapshots complete', () => {
    const paused = normalizeTimerSnapshot({
      status: 'paused',
      durationMinutes: 15,
      remainingSeconds: 500,
      lastUpdatedAt: 0,
    }, 50_000);
    expect(paused.remainingSeconds).toBe(500);
    expect(paused.elapsedSeconds).toBe(0);

    const complete = normalizeTimerSnapshot({
      status: 'active',
      durationMinutes: 15,
      remainingSeconds: 2,
      lastUpdatedAt: 0,
    }, 10_000);
    expect(complete.remainingSeconds).toBe(0);
    expect(complete.status).toBe('complete');
  });
});
