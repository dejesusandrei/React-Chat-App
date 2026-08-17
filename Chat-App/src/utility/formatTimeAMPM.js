export function formatTimeAMPM(timestamp) {
  const timestampMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const date = new Date(timestampMs);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Sample outputs:
// "2:30 PM"
// "10:05 AM"
// "12:00 PM"