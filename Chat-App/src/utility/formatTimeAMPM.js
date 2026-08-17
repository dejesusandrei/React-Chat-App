export function formatTimeAMPM(timestamp) {
  if (!timestamp) return "";

  const timestampMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const now = new Date();
  const date = new Date(timestampMs);

  const diffMs = now - timestampMs;
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // 2. Same day -> "2:30 PM"
  if (now.toDateString() === date.toDateString()) {
    return timeString;
  }

  // 3. Nasa loob ng 7 araw -> "Mon, 2:30 PM"
  if (diffMs < SEVEN_DAYS_MS) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName}, ${timeString}`;
  }

  // 4. Kapag lumipas na ang 7 araw hanggang bago mag-1 taon -> "August 9, 2:30 PM"
  if (diffMs < ONE_YEAR_MS) {
    const monthDay = date.toLocaleDateString('en-US', {
      month: 'short', // Gamitin ang 'long' kung gusto mo ng buong "August 9"
      day: 'numeric'
    });
    return `${monthDay}, ${timeString}`;
  }

  // 5. Kapag 1 taon o higit pa (>= 365 days) -> "6/20/24, 2:30 PM"
  const dateFormatted = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit'
  });
  return `${dateFormatted}, ${timeString}`;
}