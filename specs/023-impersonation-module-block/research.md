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

**Decision** (spike done 2026-09-03 against `mconnect.mentonegirls.vic.edu.au`): SchoolBox
exposes **`window.schoolboxUser`** on every page — an object with:

```jsonc
{ "id": 5467, "externalId": "<synId>", "title", "firstname", "preferredName",
  "givenName", "lastname", "fullName", "name", "email", "year",
  "role": { "id", "type", "name", "student", "staff", "parent", "guest" },
  "impersonated": false,      // ← the signal
  "communityLogin": false }   // parent/community portal login — NOT impersonation, ignore
```

The signal is `window.schoolboxUser.impersonated === true`. Held in one constant
`SCHOOLBOX_IMPERSONATION_GLOBAL` in `src/helper/ImpersonationHelper.ts` so a future
SchoolBox rename is a one-line fix.

```ts
export const SCHOOLBOX_IMPERSONATION_GLOBAL = {
  objectPath: 'schoolboxUser',                       // dotted path from window
  isImpersonating: (o: any) => o?.impersonated === true,
};
```

- "Malformed / missing" (FR-011a warn path): `window.schoolboxUser` absent, or present but
  `typeof schoolboxUser.impersonated !== 'boolean'`.
- The DOM/cookie fallback previously sketched here is **not needed** — the global exists
  and is stable. (Baseline capture showed `impersonated: false` while logged in as self; a
  paired impersonated capture to see it flip to `true` is a nice-to-have, not a blocker —
  the field name is unambiguous.)

**Rationale**: Matches the spec clarification (2026-09-03) — "a JavaScript global … with an
impersonation / real-user field". `window.schoolboxUser` is that object; `impersonated` is
that field. Present on plain pages too, so whenever the MGG app is injected into a
SchoolBox document the global is there.

**Helper contract**:
- `isImpersonating(): boolean` — `window.schoolboxUser?.impersonated === true`; pure, reads
  `window`, wrapped in try/catch, never throws.
- `isEmbeddedInSchoolBox(): boolean` — true when
  `document.getElementById('mgg-root')?.getAttribute('data-url')` is non-empty **or**
  `window.location.pathname.startsWith('/modules/remote/')`.
- `resolveImpersonation(): boolean` — if `isImpersonating()` → `true`; else if
  `isEmbeddedInSchoolBox()` **and** (`window.schoolboxUser` missing **or**
  `typeof window.schoolboxUser.impersonated !== 'boolean'`) →
  `Sentry.captureMessage('[impersonation] window.schoolboxUser not usable while embedded',
  'warning')` once (module-level `warned` flag), then `false`; else `false` silently.

**Note** (unrelated console output seen during the spike): `main.js?v=26.1.10` logs
`"Either no session, or does not match parent."` on the plain homepage. This is a
SchoolBox-side embed/session check, not our code, and does not affect reading
`window.schoolboxUser`. Worth a glance if embed behaviour looks off during implementation.

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
