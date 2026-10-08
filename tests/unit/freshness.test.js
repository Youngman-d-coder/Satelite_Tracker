import { describe, expect, it } from "vitest";

import {
  formatAge,
  getObservationAgeMs,
  isStale,
} from "../../scripts/modules/freshness.js";

describe("freshness helpers", () => {
  it("calculates age from timestamps", () => {
    const nowMs = 1_700_000_000_000;
    const observationTimestampSec = 1_699_999_700;

    expect(getObservationAgeMs(observationTimestampSec, nowMs)).toBe(300_000);
  });

  it("handles invalid or future timestamp age", () => {
    expect(getObservationAgeMs(null, 1000)).toBeNull();
    expect(getObservationAgeMs(10_000, 1_000)).toBeNull();
  });

  it("formats age labels", () => {
    expect(formatAge(4_000)).toBe("4s");
    expect(formatAge(65_000)).toBe("1m 5s");
    expect(formatAge(3_661_000)).toBe("1h 1m 1s");
    expect(formatAge(null)).toBe("-");
  });

  it("determines stale data threshold", () => {
    expect(isStale(601_000, 600_000)).toBe(true);
    expect(isStale(599_999, 600_000)).toBe(false);
  });
});
