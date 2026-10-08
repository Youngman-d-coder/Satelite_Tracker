import { describe, expect, it } from "vitest";

import {
  parseAndValidateObservation,
  parseFiniteNumber,
} from "../../scripts/modules/validation.js";

describe("parseFiniteNumber", () => {
  it("returns finite numbers", () => {
    expect(parseFiniteNumber("42.12")).toBe(42.12);
  });

  it("returns null for non-numeric values", () => {
    expect(parseFiniteNumber("abc")).toBeNull();
    expect(parseFiniteNumber(Infinity)).toBeNull();
  });
});

describe("parseAndValidateObservation", () => {
  it("accepts valid observations", () => {
    const observation = parseAndValidateObservation({
      latitude: "10.1234",
      longitude: "-80.5678",
      timestamp: "1710000000",
    });

    expect(observation).toEqual({
      latitude: 10.1234,
      longitude: -80.5678,
      timestamp: 1710000000,
    });
  });

  it("rejects malformed payloads", () => {
    expect(parseAndValidateObservation(null)).toBeNull();
    expect(parseAndValidateObservation({})).toBeNull();
    expect(
      parseAndValidateObservation({
        latitude: "NaN",
        longitude: 10,
        timestamp: 123,
      })
    ).toBeNull();
  });

  it("rejects out-of-range coordinates and invalid timestamps", () => {
    expect(
      parseAndValidateObservation({
        latitude: 91,
        longitude: 10,
        timestamp: 123,
      })
    ).toBeNull();

    expect(
      parseAndValidateObservation({
        latitude: 45,
        longitude: -181,
        timestamp: 123,
      })
    ).toBeNull();

    expect(
      parseAndValidateObservation({
        latitude: 45,
        longitude: 120,
        timestamp: 0,
      })
    ).toBeNull();
  });
});
