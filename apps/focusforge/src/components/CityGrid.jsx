import { BUILDINGS } from '../game/data.js';
import { GameIcon } from './GameIcon.jsx';

// Expands owned building counts into stable settlement tiles.
function placedBuildings(buildings) {
  const placed = [];
  Object.entries(buildings).forEach(([key, count]) => {
    for (let index = 0; index < count; index += 1) placed.push({ key, ...BUILDINGS[key] });
  });
  return placed;
}

// Displays the player's civilization as a practical responsive territory grid.
export function CityGrid({ buildings, territory, active = false }) {
  const placed = placedBuildings(buildings);
  const tiles = Array.from({ length: territory }, (_, index) => placed[index] || null);
  return (
    <div className={`city-grid ${active ? 'active' : ''}`} style={{ '--tile-count': Math.min(5, Math.ceil(Math.sqrt(territory))) }}>
      {tiles.map((building, index) => (
        <div className={`city-tile ${building ? 'occupied' : 'empty'}`} key={`${building?.key || 'empty'}-${index}`}>
          {building ? (
            <>
              <span className="building-glyph"><GameIcon name={building.icon} size={24} /></span>
              <small>{building.name}</small>
            </>
          ) : (
            <span className="empty-marker">+</span>
          )}
        </div>
      ))}
    </div>
  );
}
