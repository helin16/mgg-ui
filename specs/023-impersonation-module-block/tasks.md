---
description: "Task list for Impersonation Detection & Per-Module Block"
---

# Tasks: Impersonation Detection & Per-Module Block

**Input**: Design documents from `/specs/023-impersonation-module-block/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Automated tests are required here — a shared helper, a reducer, and a shared
route guard all change (constitution Principle V). Cross-system module-access flow gets a
Cypress spec or documented manual SchoolBox verification.

**Node**: `mgg-ui` commands run on Node >=20 (`nvm use 20`); `mggs-api` commands run on
Node >=18 (`nvm use 18`). Switch with `nvm` before every build/test.

**Organization**: Tasks grouped by user story. US1 is the MVP.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 / US2 / US3 (Setup, Foundational, Polish carry no story label)

## Path Conventions

- `mgg-ui` (this repo): `src/…`, `src/__tests__/…`, `cypress/e2e/…`
- `mggs-api` (`../mggs-api`): `src/…`, `tests/…`

---

## Phase 1: Setup

**Purpose**: Confirm ground truth and resolve the one open unknown.

- [ ] T001 Re-read [plan.md](./plan.md) + [research.md](./research.md); confirm the touched-file list and that `mgg-ui` will run on `nvm use 20` and `mggs-api` on `nvm use 18` before any build/test.
- [ ] T002 [P] Spike (research.md R2): on a live SchoolBox page, log in as staff then "log in as" a student/parent, diff candidate `window.*` objects, and record the exact impersonation global path + truthiness predicate for `src/helper/ImpersonationHelper.ts`. If no global carries it, record the DOM-selector fallback instead and update the "detection signal" Assumption in [spec.md](./spec.md).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The data field and the detection primitive that US1/US2/US3 all sit on.

**⚠️ No user-story phase can start until this phase is complete.**

### mggs-api (`../mggs-api`, `nvm use 18`)

- [ ] T003 [P] Add `blockImpersonatedUser: boolean` to the `SynMggsModuleModel` interface and a `blockImpersonatedUser: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }` attribute in `../mggs-api/src/models/Modules/SynMggsModule.ts`.
- [ ] T004 [P] Create `../mggs-api/tests/migrations/SynergeticDB/2026NNNN-add-blockImpersonatedUser-to-SynMggsModule.js`: `up` = `queryInterface.addColumn('uMGGSModules', 'blockImpersonatedUser', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false })`; `down` = `queryInterface.removeColumn('uMGGSModules', 'blockImpersonatedUser')`. (Mirrors the real schema for the sqlite test DB; the production change is the reviewed SQL in `contracts/synergetic-alter.sql`.)

### mgg-ui (`nvm use 20`)

- [ ] T005 [P] Add `blockImpersonatedUser?: boolean` to `src/types/modules/iModule.ts` (optional — absent is treated as `false`).
- [ ] T006 [P] Create `src/helper/ImpersonationHelper.ts` per [contracts/impersonation-helper.md](./contracts/impersonation-helper.md): `SCHOOLBOX_IMPERSONATION_GLOBAL` constant (value from T002), `isImpersonating()`, `isEmbeddedInSchoolBox()`, `resolveImpersonation()`. Pure, never throws, fail-open; `resolveImpersonation` emits one `@sentry/react` `captureMessage(..., 'warning')` when embedded but the global is missing/malformed, guarded by a module-level `warned` flag.
- [ ] T007 Add `isImpersonating?: boolean` to `AppState` and a `setImpersonation` action/reducer in `src/redux/reduxers/app.slice.ts`; export `setImpersonation` alongside `setIsProd` (depends on nothing but grouped here).
- [ ] T008 In `src/App.tsx` `Router`'s boot `useEffect` (next to `PingService.ping()`), add `dispatch(setImpersonation({ isImpersonating: ImpersonationHelper.resolveImpersonation() }))` — synchronous, once on mount (depends on T006, T007).

**Checkpoint**: `state.app.isImpersonating` is populated at boot; the module type + API field exist.

---

## Phase 3: User Story 1 - Impersonating staff is blocked from a protected module (Priority: P1) 🎯 MVP

**Goal**: An impersonated session that opens a `blockImpersonatedUser` module sees the
access-denied panel; every other case is unchanged.

**Independent Test**: Flag one module in the DB, open it in an impersonated SchoolBox
session → `Page401`, module screen never renders; open it normally → module opens; open a
non-flagged module while impersonating → opens.

### Implementation for User Story 1

- [ ] T009 [US1] In `src/components/module/ModuleAccessWrapper.tsx`: add `const isImpersonating = useSelector((s: RootState) => s.app.isImpersonating) === true;` and add `MggsModuleService.getModule(moduleId)` to the existing effect via `Promise.all([...])` with `AuthService.canAccessModule(moduleId)`; store the resolved `blockImpersonatedUser`.
- [ ] T010 [US1] In the same file, add the deny branch before the role checks: when `blockImpersonatedUser === true && isImpersonating` → render `accessDenyPanel ?? <Page401 description={<h4>This module is unavailable while you are logged in as another user. Return to your own account to continue.</h4>} btns={btns} />`; `silentMode` still returns `null`; keep the `Spinner` until BOTH promises resolve; on `getModule` rejection call `Toaster.showApiError(err)` and treat `blockImpersonatedUser` as `false` (fail open).

### Verification for User Story 1 ⚠️

- [ ] T011 [P] [US1] Add `src/__tests__/components/module/ModuleAccessWrapper.test.tsx` cases: flag + impersonating → renders `Page401`, not children; flag + not impersonating + role ok → renders children; no flag + impersonating → renders children; `Spinner` while `getModule` pending; `getModule` rejects → renders children + `Toaster.showApiError` called. Reuse `src/components/module/__mocks__` / service mocks; provide a Redux store with `app.isImpersonating`.
- [ ] T012 [US1] Add `cypress/e2e/impersonation-module-block.cy.ts` (or record `quickstart.md` §3 steps 1–4 as documented manual verification): stub the SchoolBox `window` global and `GET /syn/mggsModule/:id`; assert normal → module opens, impersonating + flagged → `Page401`, impersonating + non-flagged → opens, impersonation ended → opens.

**Checkpoint**: MVP is demoable end-to-end.

---

## Phase 4: User Story 2 - School turns the protection on per module (Priority: P2)

**Goal**: Every module defaults to unprotected; a school opts one in by setting
`blockImpersonatedUser` on that row, with no deploy.

**Independent Test**: With the flag `0`, an impersonated session opens the module; set it
`1`, the same session is now blocked; no other module is affected.

### Implementation for User Story 2

- [ ] T013 [P] [US2] Hand `specs/023-impersonation-module-block/contracts/synergetic-alter.sql` to IT/DBA to apply to the Synergetic database; after apply, run `SELECT ModuleID, blockImpersonatedUser FROM dbo.uMGGSModules` and confirm every row is `0`. Record the result in the PR verification notes.
- [ ] T014 [US2] Document the opt-in procedure in `quickstart.md` §3 (`UPDATE dbo.uMGGSModules SET blockImpersonatedUser = 1 WHERE ModuleID = <id>;` and the revert), and manually confirm flipping it on then off changes an impersonated session's access to that module with no app deployment.

### Verification for User Story 2 ⚠️

- [ ] T015 [P] [US2] Add a `mggs-api` test (`nvm use 18`) that, after the T004 migration runs, `uMGGSModules` has `blockImpersonatedUser` defaulting to `false` and the migration `down` removes the column.
- [ ] T016 [US2] Add a `mggs-api` controller test asserting `GET /syn/mggsModule/:ModuleID` response body includes `blockImpersonatedUser` (value `false` for an unflagged module).

**Checkpoint**: US1 and US2 both verifiable; existing modules provably unaffected.

---

## Phase 5: User Story 3 - Reusable impersonation check for the rest of the UI (Priority: P3)

**Goal**: One shared helper answers "is this session impersonating?", resolved once at
boot into Redux; consumers read the slice, not the page.

**Independent Test**: Stub the host-page global impersonating → `state.app.isImpersonating`
is `true` after boot; absent/normal → `false`.

### Verification for User Story 3 ⚠️

- [ ] T017 [P] [US3] Add `src/__tests__/helper/ImpersonationHelper.test.ts` covering: global present + impersonating → `true`; present + normal → `false`; embedded (`#mgg-root[data-url]` set, or `location.pathname` starts `/modules/remote/`) + global missing → `false` AND one `@sentry/react` `captureMessage(..., 'warning')`; not embedded + global missing → `false` AND no warning; a second `resolveImpersonation()` call does not warn again. Mock `@sentry/react`.
- [ ] T018 [P] [US3] Add `setImpersonation` cases to `src/__tests__/redux/app.slice.test.ts`: sets `isImpersonating` to `true` / `false`; does not disturb `isProd` or `backendSchoolBoxUrl`.
- [ ] T019 [US3] Add a `ModuleAccessWrapper` test that impersonation is taken from the Redux `app` slice, not by calling `ImpersonationHelper` or reading `window` directly (render with store `{ app: { isImpersonating: true } }`, no `window` global set, assert deny for a flagged module).

### Implementation for User Story 3

- [ ] T020 [US3] Add a short "Reuse" comment block to the top of `src/helper/ImpersonationHelper.ts` and a line in [research.md](./research.md) R2: only `src/App.tsx` calls `resolveImpersonation()`; all other consumers read `useSelector(s => s.app.isImpersonating)`.

**Checkpoint**: Detection primitive is proven reusable and single-sourced.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T021 [P] Run the full `mgg-ui` suite (`nvm use 20 && yarn test`) and the `mggs-api` suite (`nvm use 18 && npm test`); fix any regression in `ModuleAccessWrapper`, `app.slice`, or `SynMggsModule`-related tests.
- [ ] T022 Execute `quickstart.md` §1–§4 end-to-end and record the verification evidence in the PR / spec per constitution Principle V (module-access + shared-logic change).
- [ ] T023 [P] Run `/code-review` on branch `023-impersonation-module-block` (repo convention: code-review after implementation) and resolve or explicitly defer blocking findings.

---

## Dependencies & Execution Order

### Phase order

- **Phase 1 Setup** → **Phase 2 Foundational** (blocks all stories) → **Phase 3 US1** → **Phase 4 US2** → **Phase 5 US3** → **Phase 6 Polish**.
- Once Phase 2 is done, US1 / US2 / US3 verification work can proceed largely in parallel; the phase order above reflects priority, not a hard chain.

### Story dependencies

- **US1 (P1)** depends on the Foundational detection primitive (T006–T008) and the API field / type (T003–T005). It is the first story with user-visible value.
- **US2 (P2)** depends on the API column (T003, T004) and on US1 for its end-to-end check (flipping the flag is only observable through US1's block).
- **US3 (P3)** depends only on T006–T008; its tasks are the dedicated tests + reuse guarantee for code already introduced in Phase 2. No dependency on US1/US2.

### Within a story

- Models/types before services before UI wiring before tests/e2e.
- T009 before T010 (same file, sequential). T007 + T006 before T008.

### Parallel opportunities

- **Phase 1**: T002 runs alone (spike).
- **Phase 2**: T003 ∥ T004 (mggs-api, different files); T005 ∥ T006 (mgg-ui, different files). T007 then T008.
- **Phase 3**: T011 ∥ T012 after T009–T010.
- **Phase 4**: T013 ∥ T015; T016 after T005/T004.
- **Phase 5**: T017 ∥ T018; T019 after them.
- **Phase 6**: T021 ∥ T023.

---

## Parallel Example: Phase 2 Foundational

```bash
# mggs-api (nvm use 18) — two independent files:
Task T003: "Add blockImpersonatedUser to SynMggsModule model"
Task T004: "Add tests/migrations/SynergeticDB addColumn migration"

# mgg-ui (nvm use 20) — two independent files:
Task T005: "Add blockImpersonatedUser? to src/types/modules/iModule.ts"
Task T006: "Create src/helper/ImpersonationHelper.ts"
```

---

## Implementation Strategy

### MVP first (US1)

1. Phase 1 Setup (incl. the global spike, T002).
2. Phase 2 Foundational — API field + detection primitive.
3. Phase 3 US1 — the `ModuleAccessWrapper` block + its tests + e2e.
4. **STOP & VALIDATE**: flag one module in a test DB, verify the block in an impersonated session, verify no change elsewhere. Demo.

### Incremental delivery

- + US2: apply the production column via DBA, prove the per-module toggle, add API tests.
- + US3: lock in the helper's full test matrix and the "read from Redux" guarantee.
- Phase 6: full regression, quickstart run, `/code-review`.

---

## Notes

- `[P]` = different files, no incomplete-task dependency.
- The exact SchoolBox global (T002) is the only unknown; the helper ships fail-open with a
  placeholder if the spike is deferred, so it never blocks the MVP.
- No new env var, no browser storage, no `/auth` contract change.
- Commit after each task or logical group; `/speckit-git-commit` is available.
