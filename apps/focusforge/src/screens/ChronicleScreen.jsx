import { useMemo, useRef, useState } from 'react';
import { analyzeFocusWindows, getStreakSummary } from '../game/engine.js';
import { GameIcon } from '../components/GameIcon.jsx';
import { formatNumber, formatRelativeTime } from '../utils/format.js';

// Creates seven recent date buckets for the compact focus heatmap.
function recentDays(sessionHistory) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const minutes = sessionHistory
      .filter((session) => session.completedAt >= date.getTime() && session.completedAt < next.getTime())
      .reduce((total, session) => total + session.durationMinutes, 0);
    return { label: date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1), minutes };
  });
}

// Chronicle destination summarizes progress, learned focus windows, history, and local backups.
export function ChronicleScreen({ game, onExport, onImport, onRequestReset, onUseDuration }) {
  const inputRef = useRef(null);
  const [backupStatus, setBackupStatus] = useState('');
  const streak = useMemo(() => getStreakSummary(game.sessionHistory), [game.sessionHistory]);
  const days = useMemo(() => recentDays(game.sessionHistory), [game.sessionHistory]);
  const learnedWindows = useMemo(() => analyzeFocusWindows(game.sessionHistory), [game.sessionHistory]);
  const windows = learnedWindows.some((window) => window.sessionCount > 0)
    ? learnedWindows.slice(0, 3)
    : [
      { label: 'Morning stronghold', averageMinutes: 90, score: 95, sessionCount: 0 },
      { label: 'Afternoon campaign', averageMinutes: 45, score: 80, sessionCount: 0 },
      { label: 'Evening forge', averageMinutes: 25, score: 72, sessionCount: 0 },
    ];

  // Downloads the current validated save as a JSON backup file.
  const handleExport = () => {
    const blob = new Blob([onExport()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `focusforge-save-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Save exported.');
  };

  // Reads a selected backup and delegates schema validation to the storage adapter.
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      onImport(await file.text());
      setBackupStatus('Save restored.');
    } catch (error) {
      setBackupStatus(error.message);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="screen chronicle-screen">
      <section className="chronicle-summary panel">
        <div className="section-heading"><div><span className="eyeline">Focus Chronicle</span><h2>Your campaign record</h2></div><GameIcon name="BookOpenText" size={24} /></div>
        <div className="stat-grid">
          <div><GameIcon name="Hourglass" size={20} /><strong>{game.totalMinutes}m</strong><span>Focus time</span></div>
          <div><GameIcon name="CircleCheckBig" size={20} /><strong>{game.sessions}</strong><span>Sessions</span></div>
          <div><GameIcon name="Coins" size={20} /><strong>{formatNumber(game.totalGold)}</strong><span>Gold earned</span></div>
          <div><GameIcon name="Map" size={20} /><strong>{game.territory}</strong><span>Territory</span></div>
        </div>
      </section>

      <section className="insight-panel panel">
        <div className="section-heading compact"><div><span className="eyeline">Optimal focus windows</span><h2>Learned from your sessions</h2></div><GameIcon name="Clock3" size={22} /></div>
        <div className="window-list">
          {windows.map((window, index) => {
            const duration = [90, 45, 25][index] || 25;
            return (
              <article key={window.label}>
                <div className="window-score">{Math.round(window.score)}<span>%</span></div>
                <div className="window-copy"><strong>{window.label}</strong><span>{window.sessionCount ? `${window.sessionCount} sessions, ${window.averageMinutes}m average` : `${duration}m starter recommendation`}</span><div><i style={{ width: `${window.score}%` }} /></div></div>
                <button type="button" onClick={() => onUseDuration(window.averageMinutes || duration)}>Use</button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="streak-panel panel">
        <div className="section-heading compact"><div><span className="eyeline">Focus consistency</span><h2>{streak.current} day current streak</h2></div><div className="streak-flame"><GameIcon name="Flame" size={22} /></div></div>
        <div className="heatmap" aria-label="Focused minutes over the last seven days">
          {days.map((day, index) => (
            <div key={`${day.label}-${index}`}><span>{day.label}</span><i data-level={Math.min(4, Math.ceil(day.minutes / 25))} title={`${day.minutes} focused minutes`} /><small>{day.minutes || '—'}</small></div>
          ))}
        </div>
        <p>Best streak: <strong>{streak.best} days</strong>. Complete one protected session per day to extend it.</p>
      </section>

      <section className="event-panel panel">
        <div className="section-heading compact"><div><span className="eyeline">Event log</span><h2>Settlement history</h2></div><span className="section-meta">Latest {Math.min(12, game.log.length)}</span></div>
        <div className="event-list">
          {game.log.slice(0, 12).map((event, index) => (
            <article className={event.type} key={`${event.timestamp}-${index}`}>
              <span className="event-icon"><GameIcon name={event.icon} size={18} /></span>
              <div><strong>{event.title}</strong><p>{event.detail}</p></div>
              <time>{formatRelativeTime(event.timestamp)}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="save-panel panel">
        <div className="section-heading compact"><div><span className="eyeline">Local archive</span><h2>Protect your progress</h2></div><GameIcon name="ShieldCheck" size={22} /></div>
        <p>FocusForge stores progress only in this browser. Export a backup before clearing browser data or moving devices.</p>
        <div className="save-actions">
          <button className="button secondary" type="button" onClick={handleExport}><GameIcon name="Download" size={17} /> Export save</button>
          <button className="button secondary" type="button" onClick={() => inputRef.current?.click()}><GameIcon name="Upload" size={17} /> Import save</button>
          <input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={handleImport} />
        </div>
        {backupStatus ? <p className="backup-status" role="status">{backupStatus}</p> : null}
        <button className="reset-link" type="button" onClick={onRequestReset}><GameIcon name="Trash2" size={15} /> Reset all progress</button>
      </section>
    </div>
  );
}
