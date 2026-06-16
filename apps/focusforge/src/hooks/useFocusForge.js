import { useCallback, useEffect, useRef, useState } from 'react';
import { DISASTERS } from '../game/data.js';
import {
  applyDisaster,
  applyResearch,
  buyBuilding,
  calculateRates,
  completeSession,
  createInitialState,
  creditSessionEarnings,
  getCivilizationLevel,
} from '../game/engine.js';
import {
  clearSavedGame,
  clearTimerSnapshot,
  exportGame,
  importGame,
  loadGame,
  loadTimerSnapshot,
  normalizeTimerSnapshot,
  saveGame,
  saveTimerSnapshot,
} from '../game/storage.js';

// Creates the idle timer shape used on first launch and after settled sessions.
function createIdleTimer(durationMinutes = 25) {
  return {
    status: 'idle',
    durationMinutes,
    remainingSeconds: durationMinutes * 60,
    earnedGold: 0,
    earnedResearch: 0,
    intention: '',
    result: null,
    disaster: null,
    lastUpdatedAt: Date.now(),
  };
}

// Coordinates game persistence, focus timing, visibility disasters, and player actions.
export function useFocusForge() {
  const [game, setGame] = useState(() => loadGame());
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [intention, setIntention] = useState('');
  const [tab, setTab] = useState('forge');
  const [toast, setToast] = useState(null);
  const gameRef = useRef(game);
  const timerRef = useRef(null);

  const [timer, setTimer] = useState(() => {
    const raw = loadTimerSnapshot();
    if (!raw) return createIdleTimer();
    const restored = normalizeTimerSnapshot(raw);
    const rates = calculateRates(game.buildings, game.researched);
    const eligibleElapsed = Math.min(2, restored.elapsedSeconds);
    return {
      ...createIdleTimer(restored.durationMinutes),
      ...restored,
      status: restored.status === 'complete' ? 'active' : restored.status,
      remainingSeconds: restored.status === 'complete' ? 1 : restored.remainingSeconds,
      earnedGold: restored.earnedGold + rates.goldPerSecond * eligibleElapsed,
      earnedResearch: restored.earnedResearch + rates.researchPerSecond * eligibleElapsed,
      result: null,
      disaster: null,
    };
  });

  // Refs expose the latest state to long-lived intervals and document listeners.
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // Saves the slower-moving game state after every successful player transaction.
  useEffect(() => {
    saveGame(game);
  }, [game]);

  // Saves active timer recovery data without storing presentation-only result objects.
  useEffect(() => {
    if (!['active', 'paused'].includes(timer.status)) return;
    saveTimerSnapshot({
      status: timer.status,
      durationMinutes: timer.durationMinutes,
      remainingSeconds: timer.remainingSeconds,
      earnedGold: timer.earnedGold,
      earnedResearch: timer.earnedResearch,
      intention: timer.intention,
      lastUpdatedAt: Date.now(),
    });
  }, [timer]);

  // Displays a short non-blocking status message for player actions.
  const notify = useCallback((message, tone = 'gold') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  // Completes the current session exactly once and settles all earned resources.
  const finishSession = useCallback(() => {
    const currentTimer = timerRef.current;
    if (currentTimer.status !== 'active') return;
    const previousLevel = getCivilizationLevel(gameRef.current.totalGold);
    const completion = completeSession(gameRef.current, {
      durationMinutes: currentTimer.durationMinutes,
      earnedGold: currentTimer.earnedGold,
      earnedResearch: currentTimer.earnedResearch,
      intention: currentTimer.intention,
      completedAt: Date.now(),
    });
    const nextLevel = getCivilizationLevel(completion.state.totalGold);
    setGame(completion.state);
    setTimer((current) => ({
      ...current,
      status: 'complete',
      remainingSeconds: 0,
      result: {
        earnedGold: current.earnedGold,
        earnedResearch: current.earnedResearch,
        bonusGold: completion.bonusGold,
      },
      lastUpdatedAt: Date.now(),
    }));
    clearTimerSnapshot();
    notify(nextLevel > previousLevel ? 'Your civilization has ascended.' : 'Focus session complete.', 'success');
  }, [notify]);

  // Advances the countdown and session earnings once per visible active second.
  useEffect(() => {
    if (timer.status !== 'active') return undefined;
    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current.status !== 'active') return current;
        const rates = calculateRates(gameRef.current.buildings, gameRef.current.researched);
        if (current.remainingSeconds <= 1) {
          window.setTimeout(finishSession, 0);
          return {
            ...current,
            remainingSeconds: 0,
            earnedGold: current.earnedGold + rates.goldPerSecond,
            earnedResearch: current.earnedResearch + rates.researchPerSecond,
            lastUpdatedAt: Date.now(),
          };
        }
        return {
          ...current,
          remainingSeconds: current.remainingSeconds - 1,
          earnedGold: current.earnedGold + rates.goldPerSecond,
          earnedResearch: current.earnedResearch + rates.researchPerSecond,
          lastUpdatedAt: Date.now(),
        };
      });
    }, 1_000);
    return () => window.clearInterval(interval);
  }, [finishSession, timer.status]);

  // Ends an active session with a random reference disaster when the page is hidden.
  const triggerDisaster = useCallback(() => {
    const currentTimer = timerRef.current;
    if (currentTimer.status !== 'active') return;
    const credited = creditSessionEarnings(
      gameRef.current,
      currentTimer.earnedGold,
      currentTimer.earnedResearch,
    );
    const selected = DISASTERS[Math.floor(Math.random() * DISASTERS.length)];
    const outcome = applyDisaster(credited, selected.id);
    setGame(outcome.state);
    setTimer((current) => ({
      ...current,
      status: 'interrupted',
      disaster: outcome,
      lastUpdatedAt: Date.now(),
    }));
    clearTimerSnapshot();
  }, []);

  // Registers one Page Visibility listener and reads current timer state through refs.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') triggerDisaster();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [triggerDisaster]);

  // Starts a selected focus duration and navigates directly to the live timer.
  const startFocus = useCallback(() => {
    setTimer({
      ...createIdleTimer(selectedDuration),
      status: 'active',
      intention: intention.trim(),
      lastUpdatedAt: Date.now(),
    });
    setTab('focus');
    notify('The forge is active. Protect this session.', 'gold');
  }, [intention, notify, selectedDuration]);

  // Pauses or resumes without consuming countdown time or producing resources while paused.
  const togglePause = useCallback(() => {
    setTimer((current) => ({
      ...current,
      status: current.status === 'paused' ? 'active' : 'paused',
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  // Abandons a session without awarding its uncommitted resources.
  const abandonSession = useCallback(() => {
    clearTimerSnapshot();
    setTimer(createIdleTimer(selectedDuration));
    setTab('forge');
    notify('Session abandoned. No resources were awarded.', 'danger');
  }, [notify, selectedDuration]);

  // Returns the focus screen to standby after completion or disaster review.
  const resetTimer = useCallback(() => {
    clearTimerSnapshot();
    setTimer(createIdleTimer(selectedDuration));
    setTab('forge');
  }, [selectedDuration]);

  // Attempts a building purchase and reports the exact blocked requirement.
  const purchaseBuilding = useCallback((buildingId) => {
    const outcome = buyBuilding(gameRef.current, buildingId);
    if (outcome.ok) {
      setGame(outcome.state);
      notify('Construction complete.', 'success');
      return;
    }
    const messages = {
      locked: 'Research is required before construction.',
      maximum: 'This building has reached its maximum count.',
      territory: 'Complete another focus session to gain territory.',
      gold: 'Not enough gold for this construction.',
    };
    notify(messages[outcome.reason] || 'Construction is unavailable.', 'danger');
  }, [notify]);

  // Attempts one technology purchase and applies any linked building unlock.
  const researchTechnology = useCallback((technologyId) => {
    const outcome = applyResearch(gameRef.current, technologyId);
    if (outcome.ok) {
      setGame(outcome.state);
      notify('Research completed.', 'success');
      return;
    }
    notify(outcome.reason === 'research' ? 'More research points are required.' : 'Technology already completed.', 'danger');
  }, [notify]);

  // Replaces local progress with a validated imported save.
  const restoreGame = useCallback((serialized) => {
    const restored = importGame(serialized);
    setGame(restored);
    setTimer(createIdleTimer());
    clearTimerSnapshot();
    setTab('forge');
    notify('Save restored successfully.', 'success');
  }, [notify]);

  // Clears all local progress only after the UI has confirmed the destructive action.
  const resetGame = useCallback(() => {
    clearSavedGame();
    const fresh = createInitialState();
    setGame(fresh);
    setSelectedDuration(25);
    setIntention('');
    setTimer(createIdleTimer());
    setTab('forge');
    notify('A new Hamlet has been founded.', 'gold');
  }, [notify]);

  return {
    game,
    timer,
    tab,
    toast,
    intention,
    selectedDuration,
    setTab,
    setIntention,
    setSelectedDuration,
    setToast,
    startFocus,
    togglePause,
    abandonSession,
    resetTimer,
    purchaseBuilding,
    researchTechnology,
    restoreGame,
    resetGame,
    exportGame: () => exportGame(gameRef.current),
  };
}
