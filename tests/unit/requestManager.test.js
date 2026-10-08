import { describe, expect, it } from "vitest";

import { RequestManager } from "../../scripts/modules/requestManager.js";

describe("RequestManager", () => {
  it("starts incrementing request sequence from 1", () => {
    const manager = new RequestManager();

    expect(manager.beginRequest()).toBe(1);
    expect(manager.beginRequest()).toBe(2);
  });

  it("prevents stale responses from applying over newer ones", () => {
    const manager = new RequestManager();
    const requestOne = manager.beginRequest();
    const requestTwo = manager.beginRequest();

    expect(manager.markApplied(requestTwo)).toBe(true);
    expect(manager.markApplied(requestOne)).toBe(false);
    expect(manager.latestAppliedRequestSequence).toBe(requestTwo);
  });
});
