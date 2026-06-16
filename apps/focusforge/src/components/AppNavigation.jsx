import { GameIcon } from './GameIcon.jsx';

// Primary destinations remain available as bottom navigation on phones and a side rail on desktop.
const NAV_ITEMS = [
  { id: 'forge', label: 'Forge', icon: 'Landmark' },
  { id: 'focus', label: 'Focus', icon: 'Hourglass' },
  { id: 'research', label: 'Research', icon: 'FlaskConical' },
  { id: 'chronicle', label: 'Chronicle', icon: 'BookOpenText' },
];

// Renders the responsive application navigation and active-session indicator.
export function AppNavigation({ activeTab, onChange, timerStatus }) {
  return (
    <nav className="app-navigation" aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <button
          className={activeTab === item.id ? 'active' : ''}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
          aria-current={activeTab === item.id ? 'page' : undefined}
        >
          <span className="nav-icon"><GameIcon name={item.icon} size={21} /></span>
          <span>{item.label}</span>
          {item.id === 'focus' && timerStatus === 'active' ? <i className="live-dot" aria-label="Session active" /> : null}
        </button>
      ))}
    </nav>
  );
}
