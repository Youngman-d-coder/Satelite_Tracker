# OrbitAtlas Architecture (Initial)

## Goals

- Preserve existing static ISS tracker while introducing modular OrbitAtlas foundations.
- Separate concerns for data ingestion, domain validation/state, and presentation.
- Enable incremental migration toward TypeScript/React frontend and Python/FastAPI backend.

## Current State

- **UI Shell:** `index.html`
- **Presentation Layer:** `styles/style.css`
- **Runtime/State/Network Logic:** `scripts/script.js`
- **Tooling:** npm scripts (`lint`, `format`, static dev server)

## Immediate Modular Structure (Phase 1 within current app)

Even before framework migration, the static app now follows clearer internal boundaries:

1. **Provider Adapter Boundary**
   - API fetch (`axios.get`) isolated in `updateISSLocation`.
2. **Validation & Normalization Boundary**
   - `parseAndValidateObservation` enforces finite number and range checks.
3. **State Boundary**
   - Request ordering, freshness, and sync metadata maintained in `state`.
4. **Presentation Boundary**
   - DOM references grouped in `dom`; rendering logic in `applyObservationToUI` and status updaters.

## Target Architecture Direction

### Frontend (Incremental)

- Next.js + React + TypeScript app in modular feature slices:
  - `catalog`
  - `explorer-2d`
  - `explorer-3d`
  - `observation-planner`
  - shared `orbital-domain` utilities
- Accessible component primitives and reduced-motion-aware interactions.
- Progressive enhancement path keeping the static tracker operable during migration.

### Backend (Later Phase)

- FastAPI service with:
  - orbital element ingestion adapters
  - validated prediction endpoints
  - provenance + timestamp metadata
  - rate limiting and request validation
- PostgreSQL + SQLAlchemy/Alembic for persistence.

### Data and Scientific Layer

- Explicit separation of:
  - measured observations
  - published element sets (TLE/OMM)
  - propagated predictions
  - educational simulations
- Coordinate frame metadata and prediction limitations attached to each result.

## Non-Functional Controls

- Accessibility-first interaction patterns.
- Mobile performance constraints and adaptive rendering quality.
- Security hardening: no credential exposure in client bundles, strict input validation.

## Validation Strategy

- Keep existing lint/format checks green.
- Add phased tests:
  - JS unit tests in static layer first.
  - React/Vitest tests during frontend migration.
  - Pytest for backend services.
  - Playwright end-to-end regression flows.
