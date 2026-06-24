import { formatTime } from '../utils/format.js';

// Circular SVG countdown uses state-aware color and a CSS transition between seconds.
export function CountdownRing({ remainingSeconds, durationMinutes, status }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = durationMinutes * 60;
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  return (
    <div className={`countdown-ring ${status}`}>
      <svg viewBox="0 0 208 208" role="img" aria-label={`${formatTime(remainingSeconds)} remaining`}>
        <circle className="ring-track" cx="104" cy="104" r={radius} />
        <circle
          className="ring-progress"
          cx="104"
          cy="104"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <div className="ring-content">
        <strong>{formatTime(remainingSeconds)}</strong>
        <span>{status === 'paused' ? 'Paused' : status === 'active' ? 'Remaining' : status}</span>
      </div>
    </div>
  );
}
