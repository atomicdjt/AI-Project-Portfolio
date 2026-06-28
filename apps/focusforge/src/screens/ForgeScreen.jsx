import { BUILDINGS, CIVILIZATIONS, SESSION_DURATIONS, TECHNOLOGIES } from '../game/data.js';
import { calculateRates, countBuildings, getCivilizationLevel } from '../game/engine.js';
import { CityGrid } from '../components/CityGrid.jsx';
import { GameIcon } from '../components/GameIcon.jsx';
import { formatNumber } from '../utils/format.js';

// Finds the technology name that explains a locked building requirement.
function unlockLabel(buildingId) {
  return TECHNOLOGIES.find((technology) => technology.unlocks === buildingId)?.name || 'Research';
}

// Main command screen for civilization growth, focus launch, and construction.
export function ForgeScreen({
  game,
  timer,
  selectedDuration,
  intention,
  onDurationChange,
  onIntentionChange,
  onStart,
  onBuild,
  onOpenFocus,
}) {
  const level = getCivilizationLevel(game.totalGold);
  const rates = calculateRates(game.buildings, game.researched);
  const occupied = countBuildings(game.buildings);
  const sessionActive = ['active', 'paused'].includes(timer.status);

  return (
    <div className="screen forge-screen">
      <section className="forge-hero panel">
        <div className="section-heading compact">
          <div>
            <span className="eyeline">Civilization command</span>
            <h2>{CIVILIZATIONS[level].name} of the Ember Vale</h2>
          </div>
          <div className="tier-seal"><GameIcon name="Castle" size={25} /><span>{level + 1}</span></div>
        </div>
        <p className="hero-copy">Every protected minute expands the settlement. Build carefully, research deeply, and keep the forge lit.</p>
        <CityGrid buildings={game.buildings} territory={game.territory} active={sessionActive} />
        <div className="territory-line">
          <span><GameIcon name="Map" size={16} /> {occupied} occupied</span>
          <span>{game.territory - occupied} open territory</span>
        </div>
      </section>

      <div className="forge-side-stack">
        <section className="production-panel panel">
          <div className="section-heading compact">
            <div><span className="eyeline">Production</span><h2>Per focused minute</h2></div>
            <GameIcon name="TrendingUp" size={23} />
          </div>
          <div className="production-values">
            <div><GameIcon name="Coins" size={19} /><strong>+{(rates.goldPerSecond * 60).toFixed(1)}</strong><span>Gold</span></div>
            <div><GameIcon name="FlaskConical" size={19} /><strong>+{(rates.researchPerSecond * 60).toFixed(1)}</strong><span>Research</span></div>
            <div><GameIcon name="Map" size={19} /><strong>+1</strong><span>On completion</span></div>
          </div>
        </section>

        <section className="session-launch panel">
          <div className="section-heading compact">
            <div><span className="eyeline">Focus ritual</span><h2>Choose your campaign</h2></div>
            <GameIcon name="Hourglass" size={23} />
          </div>
          {sessionActive ? (
            <div className="active-session-card">
              <span className="live-badge">Live session</span>
              <strong>{timer.durationMinutes} minute campaign</strong>
              <p>{timer.intention || 'Uninterrupted focus'}</p>
              <button className="button primary" type="button" onClick={onOpenFocus}>Return to focus</button>
            </div>
          ) : (
            <>
              <div className="duration-grid" aria-label="Session duration">
                {SESSION_DURATIONS.map((duration) => (
                  <button
                    className={selectedDuration === duration ? 'selected' : ''}
                    key={duration}
                    onClick={() => onDurationChange(duration)}
                    type="button"
                    aria-pressed={selectedDuration === duration}
                  >
                    <strong>{duration}</strong><span>min</span>
                  </button>
                ))}
              </div>
              <label className="field-label" htmlFor="session-intention">Session intention</label>
              <div className="intention-field">
                <GameIcon name="Target" size={18} />
                <input
                  id="session-intention"
                  value={intention}
                  maxLength={80}
                  onChange={(event) => onIntentionChange(event.target.value)}
                  placeholder="What will you forge?"
                />
              </div>
              <button className="button primary launch-button" type="button" onClick={onStart}>
                <GameIcon name="Play" size={18} /> Begin {selectedDuration} minute focus
              </button>
              <p className="risk-note"><GameIcon name="ShieldAlert" size={15} /> Leaving this page during an active session triggers a distraction disaster.</p>
            </>
          )}
        </section>
      </div>

      <section className="build-section panel">
        <div className="section-heading">
          <div><span className="eyeline">Build roster</span><h2>Shape the settlement</h2></div>
          <span className="section-meta">{occupied} / {game.territory} tiles</span>
        </div>
        <div className="build-list">
          {Object.entries(BUILDINGS).map(([id, building]) => {
            const owned = game.buildings[id] || 0;
            const unlocked = game.unlocked.includes(id);
            const atMax = owned >= building.max;
            const noTerritory = occupied >= game.territory;
            const affordable = game.gold >= building.cost;
            const disabled = !unlocked || atMax || noTerritory || !affordable;
            return (
              <article className={`build-row ${unlocked ? '' : 'locked'}`} key={id}>
                <div className="build-icon"><GameIcon name={unlocked ? building.icon : 'LockKeyhole'} size={23} /></div>
                <div className="build-copy">
                  <div className="build-title"><h3>{building.name}</h3><span>Owned {owned} / {building.max}</span></div>
                  <p>{unlocked ? building.description : `Unlock with ${unlockLabel(id)}`}</p>
                  <div className="build-yield">
                    {building.goldPerSecond > 0 ? <span><GameIcon name="Coins" size={13} /> +{(building.goldPerSecond * 60).toFixed(0)}/min</span> : null}
                    {building.researchPerSecond > 0 ? <span><GameIcon name="FlaskConical" size={13} /> +{(building.researchPerSecond * 60).toFixed(0)}/min</span> : null}
                    {id === 'barracks' ? <span><GameIcon name="ShieldCheck" size={13} /> -15% damage</span> : null}
                  </div>
                </div>
                <button
                  className="build-action"
                  type="button"
                  disabled={disabled}
                  onClick={() => onBuild(id)}
                  aria-label={`Build ${building.name}`}
                >
                  <span>{atMax ? 'Max' : noTerritory ? 'No land' : unlocked ? formatNumber(building.cost) : 'Locked'}</span>
                  {unlocked && !atMax && !noTerritory ? <GameIcon name="Coins" size={14} /> : null}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
