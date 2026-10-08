export class RequestManager {
  constructor() {
    this.requestSequence = 0;
    this.latestAppliedRequestSequence = 0;
  }

  beginRequest() {
    this.requestSequence += 1;
    return this.requestSequence;
  }

  canApply(sequence) {
    return sequence >= this.latestAppliedRequestSequence;
  }

  markApplied(sequence) {
    if (!this.canApply(sequence)) {
      return false;
    }

    this.latestAppliedRequestSequence = sequence;
    return true;
  }
}
