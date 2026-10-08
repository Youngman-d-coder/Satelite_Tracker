# OrbitAtlas Initial Audit

Date: 2026-10-08  
Branch: `copilot/orbitatlas-project-setup`

## Repository Inventory

- `index.html` — static app shell, map container, coordinate and control panel.
- `scripts/script.js` — map initialization, API polling, UI updates.
- `styles/style.css` — visual theme, responsive layout, animation styles.
- `package.json` / `package-lock.json` — Node tooling (eslint, prettier, http-server).
- `.eslintrc.json` / `.prettierrc.json` — formatting and lint configuration.
- `README.md` — setup, architecture summary, limitations.

## Deployment and Build Baseline

- Frontend deployment target is static hosting (documented Vercel usage in project context).
- Runtime dependencies are CDN-loaded (`Leaflet`, `Axios`) via `index.html`.
- Local dev server: `npm run dev` (`http-server` on port 8080).
- Quality checks available: `npm run lint`, `npm run format`.
- No test runner, unit tests, integration tests, or E2E suite currently configured.

## Baseline Behavior Summary

- App fetches ISS data from `https://api.wheretheiss.at/v1/satellites/25544`.
- Polling interval is 5 minutes with manual refresh and debounce.
- Marker and coordinate panel are updated after fetch.
- Notifications appear for online/offline and fetch errors.

## Audit Findings

| ID     | Severity | Finding                                                                       | Affected Files                    | Evidence                                                                               | Recommended Fix                                                                                                     | Verification Method                                                                               |
| ------ | -------- | ----------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| OA-001 | High     | Unvalidated external coordinate/timestamp payload could render invalid state. | `scripts/script.js`               | Data values were previously consumed directly from provider response before UI update. | Parse and validate finite numeric latitude, longitude, timestamp with strict range checks; reject invalid payloads. | Inject invalid payload via mocked response and verify UI is not updated and error state is shown. |
| OA-002 | High     | Overlapping requests could apply stale response ordering.                     | `scripts/script.js`               | Fetch calls were independently awaited without request sequence guards.                | Add monotonic request sequencing and ignore older responses after newer ones are applied.                           | Trigger rapid refresh + interval overlap and assert only newest response mutates state.           |
| OA-003 | Medium   | Every update recentered map and disrupted user camera context.                | `scripts/script.js`               | `map.setView(...)` was executed on every successful fetch.                             | Recenter only on first fix or explicit user refresh action.                                                         | Pan map manually, wait for automatic update, verify map center remains user-selected.             |
| OA-004 | Medium   | Data freshness and connection state were under-communicated.                  | `index.html`, `scripts/script.js` | UI only showed timestamp/coords and transient notifications.                           | Add persistent connection state, fetch status, and data-age indicators.                                             | Toggle offline mode and stale data conditions; verify indicators update and remain visible.       |
| OA-005 | Medium   | Reduced-motion preference incompletely respected.                             | `styles/style.css`                | Always-on animated backgrounds/glow effects lacked a global reduced-motion override.   | Add `prefers-reduced-motion` media query to suppress animations/transitions.                                        | Enable reduced-motion in browser/device settings and verify animation suppression.                |
| OA-006 | Low      | Marker anchoring offset looked visually inaccurate.                           | `scripts/script.js`               | Icon anchor not centered relative to marker dimensions.                                | Use centered anchor and adjusted popup anchor.                                                                      | Confirm marker aligns with expected map coordinate at varied zoom levels.                         |
| OA-007 | Medium   | No automated tests.                                                           | Repository-wide                   | No `test` script or test framework exists in `package.json`.                           | Add phased testing strategy (unit first, then integration/e2e).                                                     | CI should execute test pipeline and fail on regressions once introduced.                          |
| OA-008 | Medium   | Dependency ranges are not fully pinned in `package.json`.                     | `package.json`                    | Dev dependencies currently use caret ranges (`^`).                                     | Move toward controlled pinning and periodic security updates.                                                       | Lockfile diff and reproducible installs across clean environments.                                |

## Baseline Check Results (Before Phase 1 Increment)

- `npm ci` — success, with upstream deprecation and vulnerability advisories from transitive dependencies.
- `npm run lint` — failed initially with quote-rule violation in `scripts/script.js` and addressed during Phase 1 increment.

## Baseline Test Strategy

1. **Static tracker hardening (current app):**
   - Add pure-function unit tests for payload validation and freshness calculations.
   - Add browser-level smoke checks for map load + coordinate panel rendering.
2. **Controlled migration to Next.js frontend:**
   - Co-locate unit/component tests in new React modules.
   - Preserve static tracker as fallback until migration tests pass.
3. **Future backend introduction:**
   - Add pytest suite for orbital data adapters, validation schemas, and propagation endpoints.
4. **End-to-end regression:**
   - Add Playwright scenarios for Explore mode, offline state, and refresh flows.

## Current Limitations

- Architecture remains a static single-page implementation.
- Scientific propagation and catalog modules are not yet introduced.
- CI automation is not yet expanded beyond local lint tooling.
