# Implementation Plan: Impersonation Detection & Per-Module Block

**Branch**: `023-impersonation-module-block` | **Date**: 2026-09-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-impersonation-module-block/spec.md`

## Summary

Detect, in the browser, whether the current SchoolBox session is impersonating another
user, and let the school mark individual modules so that the MGG UI refuses to open them
during an impersonated session.

Technical approach:

- **UI detection** — a small shared helper (`src/helper/ImpersonationHelper.ts`) reads a
  JavaScript global that SchoolBox exposes on its host page (the MGG app is injected into
  that same document by the app loader). The exact global path is held in one constant.
  The helper runs once at app boot in `src/App.tsx`, next to the existing
  `PingService.ping()` effect, and its boolean is dispatched into the Redux `app` slice
  (`isImpersonating`). If the app is embedded but the global is absent/malformed, the
  helper emits one Sentry warning, then resolves `false` (fail open).
- **UI enforcement** — `src/components/module/ModuleAccessWrapper.tsx` additionally reads
  `state.app.isImpersonating` and fetches the target module via the existing
  `MggsModuleService.getModule(moduleId)`; when `blockImpersonatedUser === true` and
  `isImpersonating === true` it renders a `Page401`-style panel with an
  impersonation-specific message instead of the module.
- **API data** — `../mggs-api` adds a `blockImpersonatedUser` boolean (default `false`) to
  the `SynMggsModule` model (`uMGGSModules` table). The existing
  `GET /syn/mggsModule/:ModuleID` route returns it automatically (`CRUDHelper.getModel`
  serialises the whole instance). The real `uMGGSModules` table lives in the school's
  Synergetic database and is **not** created by an in-repo migration, so the column is
  added via (a) a new migration file in the test-schema mirror
  `tests/migrations/SynergeticDB/` for automated coverage and (b) a reviewed `ALTER TABLE`
  script for IT/DBA to apply to the real Synergetic database.

## Technical Context

**Language/Version**: TypeScript 4.x (UI: `mgg-ui`, Node >=20 via `nvm use 20`); TypeScript
4.6 (API: `mggs-api`, Node >=18 via `nvm use 18`)
**Primary Dependencies**: React 18 + react-scripts, Redux Toolkit, react-bootstrap,
`@sentry/react` (UI); Express, Sequelize 6, sequelize-cli, Umzug, sqlite3 (API tests)
**Storage**: SchoolBox Synergetic DB table `uMGGSModules` (MSSQL, externally managed); no
browser storage (impersonation flag is in-memory Redux only)
**Testing**: Jest + React Testing Library (`yarn test`), Cypress (`yarn cypress:run`) for
UI; Jest + Umzug/sqlite for API (`npm test`)
**Target Platform**: Browser (MGG UI injected into SchoolBox pages by `MggAppLoader.js`);
Node service (mggs-api)
**Project Type**: Web SPA + companion REST API (two repos)
**Performance Goals**: Impersonation determination adds zero network round-trips (Redux
read); one extra `GET /syn/mggsModule/:id` per guarded module mount is acceptable
**Constraints**: UI-only enforcement (defence-in-depth, not a security boundary); fail
open when host-page context is unavailable; no change to the `/auth/schoolbox` handshake
or `/auth/canAccess` contract
**Scale/Scope**: ~25 modules, handful opt in; single new helper, one slice field, one
guard change, one API model field + migration mirror + DBA script

**Resolved unknowns** (see [research.md](./research.md)):

- Exact SchoolBox impersonation global — **resolved by spike T002 (2026-09-03)**:
  `window.schoolboxUser.impersonated === true`, present on every SchoolBox page. Held in
  `SCHOOLBOX_IMPERSONATION_GLOBAL`; DOM/cookie fallback not needed. Still fail-open if the
  global is ever absent (SchoolBox rename).
- How the `uMGGSModules` column is applied — migration-mirror file + reviewed DBA
  `ALTER TABLE`; not a root `migrations/` file (those target the app DB, not Synergetic).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Module-Gated Delivery** — no new route or `moduleId`. This change extends the existing
  shared guard `ModuleAccessWrapper` with one extra deny condition; it does not introduce a
  new access mechanism. Affected surface: every `/modules/remote/:code` page wrapped in
  `ModuleAccessWrapper` whose module has `blockImpersonatedUser = true`. **PASS.**
- **Typed Service Boundaries** — UI reads the module flag through the existing
  `MggsModuleService.getModule` / `iModule` type (adding one field to `iModule`). No direct
  `axios`. API change stays in the model + Sequelize migration layer. **PASS.**
- **Explicit Async UX States** — `ModuleAccessWrapper` already renders a `Spinner` while
  resolving and `Page401` on deny; the new branch reuses both, with an impersonation
  message. The added `getModule` call joins the existing `Promise` in the guard's effect,
  covered by the same loading/error handling (`Toaster.showApiError`). **PASS.**
- **School Data & Configuration Safety** — no new env var, storage, upload, embed, or
  `dangerouslySetInnerHTML`. The impersonation flag is a boolean held in memory only, never
  persisted or logged with PII. Sentry warning contains no student/staff data (just "global
  missing"). **PASS.**
- **Risk-Based Verification** — new shared helper + reducer field get Jest unit tests
  (FR-014); the guard change + module-access flow gets a Cypress spec or documented manual
  SchoolBox verification (FR-015); the API migration + model field get a migration test and
  a controller test asserting the field is returned (FR-016). **PASS.**

**Result: PASS — no violations, Complexity Tracking not required.**

## Project Structure

### Documentation (this feature)

```text
specs/023-impersonation-module-block/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── module-read.md            # GET /syn/mggsModule/:ModuleID (+ blockImpersonatedUser)
│   └── impersonation-helper.md   # UI helper + Redux app-slice contract
├── checklists/
│   └── requirements.md  # Created by /speckit-specify
└── tasks.md             # Created by /speckit-tasks
```

### Source Code (repository root)

**`mgg-ui` (this repo):**

```text
src/
├── helper/
│   ├── ImpersonationHelper.ts            # NEW - reads SchoolBox host-page global, embed-context check, Sentry warn
│   └── __mocks__/ (none needed; helper is pure)
├── redux/reduxers/
│   └── app.slice.ts                      # EDIT - add isImpersonating to AppState + setImpersonation action
├── App.tsx                               # EDIT - resolve helper once at boot, dispatch setImpersonation
├── components/module/
│   └── ModuleAccessWrapper.tsx           # EDIT - deny when module.blockImpersonatedUser && app.isImpersonating
├── types/modules/
│   └── iModule.ts                        # EDIT - add blockImpersonatedUser?: boolean
└── __tests__/
    ├── helper/ImpersonationHelper.test.ts        # NEW
    ├── redux/app.slice.test.ts                   # EDIT - cover setImpersonation
    └── components/module/ModuleAccessWrapper.test.tsx  # NEW or EDIT - cover impersonation deny branch

cypress/e2e/
└── impersonation-module-block.cy.ts     # NEW (or documented manual verification in quickstart.md)
```

**`mggs-api` (../mggs-api, additional working dir):**

```text
src/models/Modules/
└── SynMggsModule.ts                     # EDIT - add blockImpersonatedUser to interface + define()
tests/migrations/SynergeticDB/
└── 2026NNNN-add-blockImpersonatedUser-to-SynMggsModule.js   # NEW - addColumn/removeColumn for sqlite test schema
specs/023-impersonation-module-block/contracts/
└── synergetic-alter.sql                 # NEW - reviewed ALTER TABLE for IT/DBA (lives in mgg-ui specs dir for traceability)
tests/**/SynMggsModule*                  # EDIT/NEW - assert column present & defaults false; controller returns it
```

**Structure Decision**: Two-repo web SPA + REST API. All UI work lands in the established
`src/helper`, `src/redux/reduxers`, `src/components/module`, `src/types/modules` trees and
their sibling `__tests__` mirrors. API work is confined to the module model plus the
Sequelize test-migration mirror; the authoritative production schema change is a
DBA-applied SQL script tracked alongside this spec.

## Complexity Tracking

> No Constitution Check violations — section intentionally empty.
