export function createMapFollowState() {
  return {
    followEnabled: true,
    hasFirstFix: false,
  };
}

export function toggleFollow(mapFollowState) {
  return {
    ...mapFollowState,
    followEnabled: !mapFollowState.followEnabled,
  };
}

export function markFirstFixApplied(mapFollowState) {
  return {
    ...mapFollowState,
    hasFirstFix: true,
  };
}

export function shouldRecenterMap(mapFollowState) {
  return !mapFollowState.hasFirstFix || mapFollowState.followEnabled;
}
