export function formatShortTime(timestamp){    
  const timestampMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const diffMs = Math.abs(Date.now() - timestampMs);

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}hr`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d`;
}