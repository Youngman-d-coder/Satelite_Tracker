# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Initial OrbitAtlas documentation baseline:
  - `docs/audit/INITIAL_AUDIT.md`
  - `docs/architecture/ARCHITECTURE.md`
  - `docs/roadmap/ROADMAP.md`
  - `docs/decisions/ADR-0001-phase1-static-hardening.md`
- Persistent connection status, data status, and data age indicators in the UI.
- Reduced-motion fallback for animation-heavy styling.
- Modular tracking components under `scripts/modules/` for validation, request ordering, freshness, connectivity, and map-follow state.
- Follow ISS toggle that controls automatic map recentering.
- Automated unit tests (Vitest) and browser smoke tests (Playwright).
- GitHub Actions CI workflow for lint, tests, and dependency checks.

### Changed

- Hardened ISS observation ingestion with strict numeric/range validation.
- Prevented stale response overwrites via request sequencing.
- Updated map recenter policy to preserve user pan/zoom during automatic refreshes.
- Adjusted satellite marker anchoring for improved positional alignment.
- Reorganized runtime entrypoint to `scripts/main.js` with modular imports.
