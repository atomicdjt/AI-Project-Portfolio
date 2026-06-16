// Formats resource values compactly without hiding useful precision at low totals.
export function formatNumber(value) {
  const safe = Number(value) || 0;
  if (safe >= 1_000_000) return `${(safe / 1_000_000).toFixed(1)}m`;
  if (safe >= 10_000) return `${(safe / 1_000).toFixed(1)}k`;
  return Math.floor(safe).toLocaleString();
}

// Formats countdown seconds as zero-padded minutes and seconds.
export function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

// Formats event timestamps into short relative labels for the Chronicle.
export function formatRelativeTime(timestamp, now = Date.now()) {
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1_440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1_440)}d ago`;
}
