export function formatTimestampFromAPI(apiTimestampSec) {
  const date = new Date(apiTimestampSec * 1000);
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
