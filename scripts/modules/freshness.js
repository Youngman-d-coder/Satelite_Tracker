export function getObservationAgeMs(observationTimestampSec, nowMs = Date.now()) {
  if (!Number.isFinite(observationTimestampSec) || observationTimestampSec <= 0) {
    return null;
  }

  const ageMs = nowMs - observationTimestampSec * 1000;
  return Number.isFinite(ageMs) && ageMs >= 0 ? ageMs : null;
}

export function formatAge(ageMs) {
  if (!Number.isFinite(ageMs) || ageMs < 0) {
    return "-";
  }

  const totalSeconds = Math.floor(ageMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function isStale(ageMs, staleDataMs) {
  return Number.isFinite(ageMs) && ageMs > staleDataMs;
}
