import { describe, expect, it } from "vitest";

import {
  createMapFollowState,
  markFirstFixApplied,
  shouldRecenterMap,
  toggleFollow,
} from "../../scripts/modules/mapFollow.js";

describe("map follow state", () => {
  it("recenters before first fix regardless of toggle", () => {
    const state = createMapFollowState();

    expect(shouldRecenterMap(state)).toBe(true);
  });

  it("respects follow toggle after first fix", () => {
    const initialState = markFirstFixApplied(createMapFollowState());

    expect(shouldRecenterMap(initialState)).toBe(true);

    const toggledState = toggleFollow(initialState);
    expect(shouldRecenterMap(toggledState)).toBe(false);
  });
});
