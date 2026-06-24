import { calculateRates } from '../game/engine.js';
import { CityGrid } from '../components/CityGrid.jsx';
import { CountdownRing } from '../components/CountdownRing.jsx';
import { GameIcon } from '../components/GameIcon.jsx';

// Focus destination renders standby, active, paused, completion, and disaster states.
export function FocusScreen({ game, timer, onPause, onReset, onRequestAbandon, onGoForge }) {
  const rates = calculateRates(game.buildings, game.researched);

  if (timer.status === 'idle') {
    return (
      <div className="screen focus-screen centered-state">
        <section className="panel empty-focus">
          <div className="empty-symbol"><GameIcon name="Hourglass" size={34} /></div>
          <span className="eyeline">Focus chamber</span>
          <h2>No active session</h2>
          <p>Choose a campaign length and intention in the Forge, then protect the countdown to grow your civilization.</p>
          <button className="button primary" type="button" onClick={onGoForge}>Prepare a session</button>
        </section>
      </div>
    );
  }

  if (timer.status === 'complete') {
    const result = timer.result || { earnedGold: 0, earnedResearch: 0, bonusGold: timer.durationMinutes * 5 };
    return (
      <div className="screen focus-screen centered-state">
        <section className="panel result-card success-card">
          <div className="result-emblem"><GameIcon name="Trophy" size={36} /></div>
          <span className="eyeline">Campaign complete</span>
          <h2>{timer.durationMinutes} focused minutes forged</h2>
          <p>{timer.intention || 'Your uninterrupted work strengthened the settlement.'}</p>
          <div className="result-grid">
            <div><GameIcon name="Coins" size={22} /><strong>+{Math.floor(result.earnedGold)}</strong><span>Passive gold</span></div>
            <div><GameIcon name="Sparkles" size={22} /><strong>+{result.bonusGold}</strong><span>Completion bonus</span></div>
            <div><GameIcon name="FlaskConical" size={22} /><strong>+{Math.floor(result.earnedResearch)}</strong><span>Research</span></div>
            <div><GameIcon name="Map" size={22} /><strong>+1</strong><span>Territory</span></div>
          </div>
          <button className="button success" type="button" onClick={onReset}>Return to the Forge</button>
        </section>
      </div>
    );
  }

  if (timer.status === 'interrupted') {
    const outcome = timer.disaster;
    return (
      <div className="screen focus-screen centered-state disaster-state">
        <section className="panel result-card danger-card">
          <div className="result-emblem danger"><GameIcon name={outcome?.disaster.icon || 'ShieldAlert'} size={36} /></div>
          <span className="eyeline">Distraction disaster</span>
          <h2>{outcome?.disaster.name || 'The focus line broke'}</h2>
          <p>{outcome?.disaster.description}</p>
          <div className="disaster-report">
            <div><span>Gold lost</span><strong>-{outcome?.goldLost || 0}</strong></div>
            <div><span>Building damage</span><strong>{outcome?.destroyedBuilding ? '1 lost' : 'None'}</strong></div>
            <div><span>Resilience</span><strong>{game.researched.includes('resilience') ? 'Active' : 'Unresearched'}</strong></div>
            <div><span>Barracks</span><strong>{game.buildings.barracks || 0}</strong></div>
          </div>
          <button className="button danger" type="button" onClick={onReset}>Rebuild your forces</button>
        </section>
      </div>
    );
  }

  return (
    <div className="screen focus-screen">
      <section className="focus-stage panel">
        <div className="focus-stage-heading">
          <div><span className="eyeline">{timer.status === 'paused' ? 'The forge is banked' : 'The forge is burning'}</span><h2>Focus session</h2></div>
          <span className={`status-chip ${timer.status}`}>{timer.status === 'paused' ? 'Paused' : 'Live'}</span>
        </div>
        <CountdownRing remainingSeconds={timer.remainingSeconds} durationMinutes={timer.durationMinutes} status={timer.status} />
        <div className="focus-intention">
          <GameIcon name="Target" size={17} />
          <span>{timer.intention || 'Uninterrupted focus'}</span>
        </div>
        <div className="focus-actions">
          <button className="button primary" type="button" onClick={onPause}>
            <GameIcon name={timer.status === 'paused' ? 'Play' : 'Pause'} size={17} />
            {timer.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button className="button secondary danger-text" type="button" onClick={onRequestAbandon}>End session</button>
        </div>
      </section>

      <aside className="focus-telemetry">
        <section className="panel live-gains">
          <div className="section-heading compact"><div><span className="eyeline">Live gains</span><h2>Protected resources</h2></div><GameIcon name="TrendingUp" size={22} /></div>
          <div className="live-gain-grid">
            <div><GameIcon name="Coins" size={21} /><strong>+{timer.earnedGold.toFixed(1)}</strong><span>{(rates.goldPerSecond * 60).toFixed(1)} per min</span></div>
            <div><GameIcon name="FlaskConical" size={21} /><strong>+{timer.earnedResearch.toFixed(1)}</strong><span>{(rates.researchPerSecond * 60).toFixed(1)} per min</span></div>
          </div>
        </section>
        <section className="panel settlement-pulse">
          <div className="section-heading compact"><div><span className="eyeline">Settlement pulse</span><h2>Growth in progress</h2></div></div>
          <CityGrid buildings={game.buildings} territory={Math.min(game.territory, 9)} active={timer.status === 'active'} />
        </section>
        <blockquote>“Discipline today, legacy tomorrow.”</blockquote>
      </aside>
    </div>
  );
}
