# Phase 0 Research: Impersonation Detection & Per-Module Block

## R1. How the MGG UI can inspect the SchoolBox host page

**Decision**: Read a `window`-level global directly. The MGG React app runs in the **same
document** as the SchoolBox page.

**Rationale**: `AppLoader/src/MggAppLoader.ts` (`SchoolBoxAppLoader`) finds SchoolBox's
`iframe#remote`, sets it `display:none`, inserts a sibling `<div id="mgg-root"
data-url="…">`, and mounts the SPA there via `src/index.tsx`
(`ReactDOM.render(<App/>, document.getElementById('mgg-root'))`). So the app shares
SchoolBox's `window` and DOM — no cross-origin iframe boundary — and can read any global
SchoolBox defines on its page.

**Alternatives considered**:
- Cross-origin `postMessage` to a parent frame — not applicable; there is no parent frame,
  the app is injected into the SchoolBox document.
- Reading `window.parent` — same document, `window === window.parent` in the embedded case.

## R2. What global identifies an impersonated SchoolBox session

**Decision**: Resolve impersonation from a single configurable global path, stored as a
constant `SCHOOLBOX_IMPERSONATION_GLOBAL` in `src/helper/ImpersonationHelper.ts`. The
concrete global name/field is **confirmed by a short spike** against a live impersonated
SchoolBox session before or during implementation. Until confirmed, the helper resolves
`false` (fail open, per FR-011) so delivery is not blocked.

**Rationale**: The spec (clarification 2026-09-03) fixed the mechanism as "a JavaScript
global exposed on the SchoolBox host page (a user/context object with an impersonation /
real-user field)", but the exact identifier is SchoolBox-version specific and not visible
from this codebase. Isolating it in one constant makes both the spike outcome and any
future SchoolBox upgrade a one-line change (Edge Cases in spec).

**Spike checklist** (run while logged in as staff, then "log in as" a student/parent):
1. In dev tools console on a SchoolBox page, inspect candidate globals:
   `window.Schoolbox`, `window.SB`, `window.user`, `window.currentUser`,
   `window.__INITIAL_STATE__`, any `window.*` object with a `user` / `impersonat*` /
   `realUser` / `loginAs` / `su` field.
2. Compare the object shape **with** vs **without** impersonation active to find the field
   that flips (e.g. `impersonating: true`, or `realUserId !== userId`).
3. Record the exact path (e.g. `Schoolbox.user.impersonating`) and truthiness rule.
4. If **no** global carries it, fall back to a DOM check for SchoolBox's
   "return to your account" control (e.g. `a[href*="unimpersonate"]`,
   `a[href*="/impersonate/stop"]`, an element with a known class) and record that selector
   in the same constant instead. Update the spec's Assumption if the mechanism changes
   from "global" to "DOM element".

**Helper contract** (regardless of spike result):
- `isImpersonating(): boolean` — pure, reads `window`, never throws.
- `isEmbeddedInSchoolBox(): boolean` — true when
  `document.getElementById('mgg-root')?.getAttribute('data-url')` is non-empty **or**
  `window.location.pathname.startsWith('/modules/remote/')`.
- `resolveImpersonation(): boolean` — if `isImpersonating()` → `true`; else if
  `isEmbeddedInSchoolBox()` **and** the global object exists but lacks the expected field
  (or the whole global is missing) → `Sentry.captureMessage('impersonation global not
  found', 'warning')` once, then `false`; else `false` silently.

**Alternatives considered**:
- Add an `impersonatedBy` field to the `/auth/schoolbox` handshake — rejected by spec
  (FR-002: no auth-handshake change; detection is UI-side).
- Server-side session-table inspection in `mggs-api` — rejected by spec (UI-only detection
  this iteration).

## R3. Where to run detection and how to store the result

**Decision**: Add `isImpersonating?: boolean` to `AppState` in
`src/redux/reduxers/app.slice.ts` with a `setImpersonation` action. Resolve it once in the
existing boot `useEffect` in `src/App.tsx` (the same effect that calls
`PingService.ping()` and dispatches `setIsProd`), dispatching `setImpersonation({
isImpersonating: ImpersonationHelper.resolveImpersonation() })` synchronously (no await).

**Rationale**: `App.tsx`'s `Router` component already owns app-boot side effects and has
`dispatch` in scope; `app.slice` is the constitution-sanctioned home for cross-route app
state. Doing it in `index.tsx` would run before `<Provider>` mounts, so no store to
dispatch into. Consumers read `useSelector(s => s.app.isImpersonating)`.

**Alternatives considered**:
- Compute in each consumer — rejected by spec FR-002a (single boot-time resolution, read
  from Redux).
- A React context — redundant with the existing Redux `app` slice.

## R4. How `ModuleAccessWrapper` learns a module's `blockImpersonatedUser`

**Decision**: In `ModuleAccessWrapper`'s existing `useEffect`, add
`MggsModuleService.getModule(moduleId)` alongside `AuthService.canAccessModule(moduleId)`
(via `Promise.all`). Deny (render `Page401` with the impersonation message) when
`module.blockImpersonatedUser === true && isImpersonating === true`; otherwise fall through
to the current role logic.

**Rationale**: `MggsModuleService.getModule` and `iModule` already exist and are the
typed-service path (constitution II). `GET /syn/mggsModule/:ModuleID` returns the full
model via `CRUDHelper.getModel`, so once the API model gains the field it is served with
no controller change. One extra single-row GET per guarded module mount is negligible for
these heavy pages, and SC-005 (no round-trip for the *determination*) still holds — the
determination is the Redux read; the module fetch is part of "the block".

**Alternatives considered**:
- Add `blockImpersonatedUser` to the `/auth/canAccess` response — rejected: that response
  is a `{[roleId]: {...}}` map consumed by `Object.keys(resp).filter(...)` in
  `ModuleAccessWrapper` and by `AuthService.isModuleRole`; adding a non-roleId key or
  reshaping to `{roles, blockImpersonatedUser}` is a breaking contract change with wider
  blast radius than one extra GET. Also `ModuleHelper.canAccessModule` does not currently
  load the module row, so it would need an extra query there anyway.
- Preload all modules into Redux at boot — over-engineered for ~25 rows and adds a boot
  dependency; revisit only if the per-mount GET ever shows up as a problem.

## R5. Adding `blockImpersonatedUser` to `uMGGSModules`

**Decision**: Two artefacts:
1. **Test-schema mirror**: a new migration in
   `mggs-api/tests/migrations/SynergeticDB/2026NNNN-add-blockImpersonatedUser-to-SynMggsModule.js`
   using `queryInterface.addColumn('uMGGSModules', 'blockImpersonatedUser', { type:
   BOOLEAN, allowNull: false, defaultValue: false })` with a `removeColumn` `down`. This is
   what Umzug replays to build the sqlite test DB, so Jest coverage of the new field works.
2. **Production change**: a reviewed `ALTER TABLE uMGGSModules ADD blockImpersonatedUser
   BIT NOT NULL CONSTRAINT DF_uMGGSModules_blockImpersonatedUser DEFAULT 0;` (MSSQL),
   tracked at `specs/023-impersonation-module-block/contracts/synergetic-alter.sql`, handed
   to IT/DBA to apply to the real Synergetic (SynergyOne) database. Rollback:
   `ALTER TABLE uMGGSModules DROP CONSTRAINT DF_uMGGSModules_blockImpersonatedUser; ALTER
   TABLE uMGGSModules DROP COLUMN blockImpersonatedUser;`.

**Rationale**: `SynMggsModule` binds to `SynergeticDB` (`SYNERGYONE_DB_*` env). The
repo's `sequelize-cli` runner (`npm run db:migrate`) and every file in the root
`migrations/` folder target the **app** DB (`DB_*` env); there is no wired path to run a
migration against the `synergetic` connection, and `uMGGSModules` itself was never created
by an in-repo migration (only mirrored under `tests/migrations/SynergeticDB/`). So the
real table is externally owned and its change belongs with a DBA, exactly as the spec
Assumption anticipated. FR-003a's "reversible migration + down step" is satisfied by the
mirror migration (for tests) plus the paired forward/rollback SQL (for production).

**Alternatives considered**:
- Add the column via a root `migrations/*.js` file — wrong database; `db:migrate` would try
  to `ALTER` a non-existent `uMGGSModules` in the app DB.
- Wire a second `--env synergetic` migration runner — larger infra change (fix `config.js`
  `synergetic` block, add npm script, CI wiring) than this one-column feature warrants;
  the repo has deliberately kept Synergetic tables read-through only.

## R6. Sentry usage for the missing-global warning

**Decision**: `SentryLib.captureMessage('[impersonation] SchoolBox host-page global not
found while embedded', 'warning')` from the helper, guarded so it fires at most once per
page load. No-op automatically when `REACT_APP_SENTRY_DSN` is unset (`Sentry.init()`
early-returns, `@sentry/react` calls become inert).

**Rationale**: `src/components/error/Sentry.tsx` already initialises `@sentry/react` in
`index.tsx`; reusing it satisfies the constitution's "preserve Sentry wiring" and
"no silent failures" rules without new dependencies. Warning text carries no PII.

**Alternatives considered**: `console.warn` only — loses visibility in production
(clarification 2026-09-03 chose the Sentry path).
