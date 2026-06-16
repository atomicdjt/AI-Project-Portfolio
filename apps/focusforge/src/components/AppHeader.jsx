import { CIVILIZATIONS } from '../game/data.js';
import { getCivilizationLevel, getCivilizationProgress } from '../game/engine.js';
import { formatNumber } from '../utils/format.js';
import { GameIcon } from './GameIcon.jsx';

// Persistent header exposes civilization identity, progression, and live resource previews.
export function AppHeader({ game, timer }) {
  const level = getCivilizationLevel(game.totalGold);
  const civilization = CIVILIZATIONS[level];
  const next = CIVILIZATIONS[level + 1];
  const progress = getCivilizationProgress(game.totalGold);
  const previewGold = game.gold + (['active', 'paused'].includes(timer.status) ? timer.earnedGold : 0);
  const previewResearch = game.research + (['active', 'paused'].includes(timer.status) ? timer.earnedResearch : 0);

  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark"><GameIcon name="Flame" size={22} /></div>
        <div>
          <h1>FocusForge</h1>
          <p>{civilization.name} <span>Tier {level + 1}</span></p>
        </div>
      </div>
      <div className="resource-rail" aria-label="Current resources">
        <div className="resource-chip gold"><GameIcon name="Coins" size={17} /><strong>{formatNumber(previewGold)}</strong><span>Gold</span></div>
        <div className="resource-chip research"><GameIcon name="FlaskConical" size={17} /><strong>{formatNumber(previewResearch)}</strong><span>Research</span></div>
      </div>
      <div className="header-progress" aria-label={`${Math.round(progress * 100)} percent to next civilization tier`}>
        <div style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="header-progress-copy">
        <span>Civilization progress</span>
        <span>{next ? `${formatNumber(game.totalGold)} / ${formatNumber(next.threshold)}` : 'Empire mastered'}</span>
      </div>
    </header>
  );
}
