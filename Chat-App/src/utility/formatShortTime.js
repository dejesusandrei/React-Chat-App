export function formatShortTime(timestamp) {    
  const timestampMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const diffMs = Math.abs(Date.now() - timestampMs);

  // Math.max(1, ...) -> Kapag 0-59 seconds, lalabas ay 1m.
  // Kapag higit 60 seconds, lalabas ang aktwal na minuto (e.g. 2m, 3m, 59m).
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
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