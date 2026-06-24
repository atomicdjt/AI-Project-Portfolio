import { useMemo, useState } from 'react';
import { TECHNOLOGIES } from '../game/data.js';
import { GameIcon } from '../components/GameIcon.jsx';
import { formatNumber } from '../utils/format.js';

// Research destination presents all preserved technologies with a focused detail panel.
export function ResearchScreen({ game, onResearch }) {
  const firstAvailable = useMemo(
    () => TECHNOLOGIES.find((technology) => !game.researched.includes(technology.id))?.id || TECHNOLOGIES[0].id,
    [game.researched],
  );
  const [selectedId, setSelectedId] = useState(firstAvailable);
  const selected = TECHNOLOGIES.find((technology) => technology.id === selectedId) || TECHNOLOGIES[0];
  const selectedDone = game.researched.includes(selected.id);
  const selectedAffordable = game.research >= selected.cost;

  return (
    <div className="screen research-screen">
      <section className="research-overview panel">
        <div className="section-heading">
          <div><span className="eyeline">Technology tree</span><h2>Turn focus into mastery</h2></div>
          <div className="research-total"><GameIcon name="FlaskConical" size={20} /><strong>{formatNumber(game.research)}</strong></div>
        </div>
        <p>Unlock specialized buildings, multiply production, and harden the settlement against distraction.</p>
        <div className="research-progress"><div style={{ width: `${(game.researched.length / TECHNOLOGIES.length) * 100}%` }} /></div>
        <span className="progress-caption">{game.researched.length} of {TECHNOLOGIES.length} technologies completed</span>
      </section>

      <section className="tech-tree panel">
        <div className="tech-grid">
          {TECHNOLOGIES.map((technology) => {
            const complete = game.researched.includes(technology.id);
            const affordable = game.research >= technology.cost;
            return (
              <button
                className={`tech-node ${complete ? 'complete' : ''} ${selectedId === technology.id ? 'selected' : ''}`}
                key={technology.id}
                type="button"
                onClick={() => setSelectedId(technology.id)}
                aria-pressed={selectedId === technology.id}
              >
                <span className="tech-icon"><GameIcon name={technology.icon} size={23} /></span>
                <span className="tech-copy"><strong>{technology.name}</strong><small>{technology.branch}</small></span>
                <span className={complete ? 'tech-state done' : affordable ? 'tech-state ready' : 'tech-state'}>
                  {complete ? <GameIcon name="CircleCheckBig" size={17} /> : <><GameIcon name="FlaskConical" size={13} /> {technology.cost}</>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="tech-detail panel">
        <div className="detail-icon"><GameIcon name={selected.icon} size={31} /></div>
        <span className="eyeline">{selected.branch} discipline</span>
        <h2>{selected.name}</h2>
        <p>{selected.description}.</p>
        <div className="detail-effect">
          <span>Strategic effect</span>
          <strong>{selected.unlocks ? `Adds ${selected.unlocks} to the build roster` : selected.description}</strong>
        </div>
        <div className="detail-cost"><span>Research cost</span><strong><GameIcon name="FlaskConical" size={17} /> {selected.cost}</strong></div>
        <button
          className={`button ${selectedDone ? 'secondary' : 'research'}`}
          type="button"
          disabled={selectedDone || !selectedAffordable}
          onClick={() => onResearch(selected.id)}
          aria-label={`Research ${selected.name}`}
        >
          {selectedDone ? 'Technology complete' : selectedAffordable ? 'Research technology' : `Need ${selected.cost - Math.floor(game.research)} more research`}
        </button>
      </aside>
    </div>
  );
}
