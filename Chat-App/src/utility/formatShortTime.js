export function formatShortTime(timestamp) {    
  const timestampMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const diffMs = Math.abs(Date.now() - timestampMs);

  // Kapag 0-59 seconds, lalabas ay 1m.
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}hr`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 52) {
    return `${weeks}w`;
  }

  const years = Math.floor(weeks / 52);
  return `${years}y`;
}