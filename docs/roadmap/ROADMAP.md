# OrbitAtlas Roadmap (Phase-Oriented)

## Phase 1 — Stabilize Current Tracker (In Progress)

### Objectives

- Complete repository audit and architecture baseline documents.
- Fix correctness/reliability issues in current static ISS tracker.
- Prepare incremental migration path without breaking existing deployment.

### Completed in this increment

- Added initial audit documentation with severity/evidence/recommendations.
- Added architecture and roadmap documentation.
- Hardened current tracker with:
  - payload validation for latitude/longitude/timestamp
  - stale-response ordering protection
  - persistent connection/data-status/data-age UI states
  - recenter behavior that preserves user map view on auto refresh
  - reduced-motion CSS safeguard
  - improved marker anchoring

### Remaining for Phase 1

- Add automated JS tests for validation and freshness logic.
- Establish initial CI workflow for lint and tests.
- Add contributor and operational docs for rollback/runbook flow.

## Phase 2 — Frontend Foundation (Controlled Migration)

- Introduce Next.js + TypeScript app shell in parallel path.
- Build Explore mode baseline for 2D tracking with shared domain model.
- Preserve static tracker fallback until parity checks pass.

## Phase 3 — Scientific Data Layer

- Add backend service boundary (FastAPI) for validated orbital data endpoints.
- Introduce provenance-first data model for element sets and predictions.
- Start satellite catalog ingestion workflow with update timestamps.

## Phase 4 — Explorer and Planner Expansion

- Extend 2D explorer with tracks/trajectory controls.
- Add 3D explorer prototype with performance-adaptive fallback.
- Add observation planner with timezone-aware pass predictions.

## Phase 5 — Research and Developer Platform

- Reproducible research workspace artifacts and exports.
- Versioned public API, docs, and initial SDK strategy.
- Advanced analytics modules with explicit confidence and limitations.
