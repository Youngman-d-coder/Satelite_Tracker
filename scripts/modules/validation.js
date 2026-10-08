export function parseFiniteNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseAndValidateObservation(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const latitude = parseFiniteNumber(payload.latitude);
  const longitude = parseFiniteNumber(payload.longitude);
  const timestamp = parseFiniteNumber(payload.timestamp);

  if (latitude === null || longitude === null || timestamp === null) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  if (timestamp <= 0) {
    return null;
  }

  return { latitude, longitude, timestamp };
}
