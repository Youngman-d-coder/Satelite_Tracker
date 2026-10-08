# ADR-0001: Phase 1 Static Tracker Hardening Before Framework Migration

- Status: Accepted
- Date: 2026-10-08

## Context

The repository currently runs a static ISS tracker in production. Core reliability issues (unvalidated payloads, stale request ordering, disruptive map recentering, weak data-state signaling) reduce trust and usability. A full-stack rewrite without stabilizing current behavior would raise regression risk.

## Decision

Perform a focused hardening increment on the existing static app before introducing Next.js/FastAPI architecture changes.

The increment includes:

- strict payload validation
- request sequencing protection
- persistent connection/freshness status communication
- recenter behavior changes to preserve user map context
- reduced-motion support improvements

## Consequences

### Positive

- Immediate reliability and UX improvements with low migration risk.
- Better boundary definition (validation/state/presentation) that simplifies upcoming modular migration.
- Preserves existing production deployment compatibility.

### Trade-offs

- Logic remains in vanilla JavaScript for now.
- Test automation is still incomplete and must be addressed in upcoming increments.

## Verification

- Lint passes after changes.
- Manual runtime verification for online/offline transitions, refresh ordering, and map-view persistence.
