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

- [x] T001 Re-read [plan.md](./plan.md) + [research.md](./research.md); confirmed touched-file list. `mgg-ui` runs on `nvm use 20` (v20.20.0), `mggs-api` on `nvm use 18` (v18.20.8).
- [x] T002 [P] Spike (research.md R2) — **DONE 2026-09-03** on `mconnect.mentonegirls.vic.edu.au`. Signal = `window.schoolboxUser.impersonated === true` (`window.schoolboxUser` present on every SchoolBox page). Recorded in [research.md](./research.md) R2, [contracts/impersonation-helper.md](./contracts/impersonation-helper.md), and [spec.md](./spec.md) FR-002 / Assumptions. Fallback not needed. Optional follow-up: a paired impersonated capture to watch the field flip to `true` (field name is unambiguous, not blocking).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The data field and the detection primitive that US1/US2/US3 all sit on.

**⚠️ No user-story phase can start until this phase is complete.**

### mggs-api (`../mggs-api`, `nvm use 18`)

- [x] T003 [P] Added `blockImpersonatedUser: boolean` to `SynMggsModuleModel` + `{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }` attribute in `../mggs-api/src/models/Modules/SynMggsModule.ts`.
- [x] T004 [P] Created `../mggs-api/tests/migrations/SynergeticDB/20260903000001-add-blockImpersonatedUser-to-SynMggsModule.js` (`addColumn` up / `removeColumn` down). Verified: sqlite test schema builds and `SynMggsModuleController` suite passes.

### mgg-ui (`nvm use 20`)

- [x] T005 [P] Added `blockImpersonatedUser?: boolean` to `src/types/modules/iModule.ts`.
- [x] T006 [P] Created `src/helper/ImpersonationHelper.ts` — `SCHOOLBOX_IMPERSONATION_GLOBAL` (`schoolboxUser` / `impersonated === true`), `isImpersonating()`, `isEmbeddedInSchoolBox()`, `resolveImpersonation()` (pure, never throws, fail-open, warn-once via `@sentry/react`).
- [x] T007 Added `isImpersonating?: boolean` to `AppState` + `setImpersonation` action in `src/redux/reduxers/app.slice.ts` (exported).
- [x] T008 `src/App.tsx` boot `useEffect` now dispatches `setImpersonation({ isImpersonating: ImpersonationHelper.resolveImpersonation() })` synchronously.

**Checkpoint**: `state.app.isImpersonating` is populated at boot; the module type + API field exist.

---

## Phase 3: User Story 1 - Impersonating staff is blocked from a protected module (Priority: P1) 🎯 MVP

**Goal**: An impersonated session that opens a `blockImpersonatedUser` module sees the
access-denied panel; every other case is unchanged.

**Independent Test**: Flag one module in the DB, open it in an impersonated SchoolBox
session → `Page401`, module screen never renders; open it normally → module opens; open a
non-flagged module while impersonating → opens.

### Implementation for User Story 1

- [x] T009 [US1] `src/components/module/ModuleAccessWrapper.tsx` reads `s.app?.isImpersonating`. **getModule is only called when impersonating** (code-review fix: normal sessions keep their single request / unchanged first paint and never depend on the module-metadata endpoint). Resolution is stored as one `decision` object tagged with `{moduleId, roleId}`.
- [x] T010 [US1] Deny branch before the role check: `decision.blockImpersonated && isImpersonating` → impersonation `Page401` (or `accessDenyPanel` / `null` for `silentMode`); `Spinner` while not `ready`; `getModule` rejection → `Toaster.showApiError` + fail open. A `decision` computed for a different `moduleId`/`roleId` counts as not-ready (code-review fix: no stale allow/deny on a reused instance; no setState-in-effect loop).

### Verification for User Story 1 ⚠️

- [x] T011 [P] [US1] Added `src/__tests__/components/module/ModuleAccessWrapper.test.tsx` — 9 cases: deny / allow / no-flag / silentMode / spinner-pending / getModule-reject-fail-open / reads-from-Redux / **no module fetch when not impersonating** / **re-shows Spinner (no stale decision) on moduleId change**. All pass on Node 20.
- [~] T012 [US1] **Documented manual verification** — `quickstart.md` §3 steps 1–4 is the recorded manual procedure. Cypress spec `cypress/e2e/impersonation-module-block.cy.ts` not written (needs the dev server + an embedded SchoolBox route); optional follow-up.

**Checkpoint**: MVP is demoable end-to-end.

---

## Phase 4: User Story 2 - School turns the protection on per module (Priority: P2)

**Goal**: Every module defaults to unprotected; a school opts one in by setting
`blockImpersonatedUser` on that row, with no deploy.

**Independent Test**: With the flag `0`, an impersonated session opens the module; set it
`1`, the same session is now blocked; no other module is affected.

### Implementation for User Story 2

- [~] T013 [US2] **PENDING — external (IT/DBA), and a HARD RELEASE-ORDER GATE.** `contracts/synergetic-alter.sql` must be applied to the Synergetic DB **before** the `mggs-api` build with the model change is deployed — the model SELECTs `blockImpersonatedUser` on every `GET /syn/mggsModule/:id`, so deploying first breaks every page that reads module metadata (PTI, HOY Chat, Student Absences, Online Donation, Synergetic User Permissions, …). Order: SQL → mggs-api → mgg-ui. US2 production verification is blocked on this; dev/test (T015, T016) is not.
- [x] T014 [US2] Opt-in procedure (`UPDATE dbo.uMGGSModules SET blockImpersonatedUser = 1/0 WHERE ModuleID = <id>`) is documented in `quickstart.md` §3. On/off manual confirmation is part of the T022 quickstart run (pending, needs embedded SchoolBox).

### Verification for User Story 2 ⚠️

- [x] T015 [P] [US2] Covered by the `SynMggsModuleController` suite (Node 18): after the T004 migration the sqlite `uMGGSModules` has `blockImpersonatedUser` defaulting to `false` (asserted `module.blockImpersonatedUser === false`). `down` is the mechanical `removeColumn` inverse + the paired prod rollback in `synergetic-alter.sql`.
- [x] T016 [US2] Added to `../mggs-api/tests/controllers/MggsModule/SynMggsModuleController.test.ts`: `GET /syn/mggsModule/:ModuleID` returns `blockImpersonatedUser` (`false` unflagged, `true` when set). 13/13 pass (with `SENTRY_DSN=""` to sidestep a pre-existing local `@sentry` init crash unrelated to this change).

**Checkpoint**: US1 and US2 both verifiable; existing modules provably unaffected.

---

## Phase 5: User Story 3 - Reusable impersonation check for the rest of the UI (Priority: P3)

**Goal**: One shared helper answers "is this session impersonating?", resolved once at
boot into Redux; consumers read the slice, not the page.

**Independent Test**: Stub the host-page global impersonating → `state.app.isImpersonating`
is `true` after boot; absent/normal → `false`.

### Verification for User Story 3 ⚠️

- [x] T017 [P] [US3] Added `src/__tests__/helper/ImpersonationHelper.test.ts` — 8 cases (impersonating; normal; embedded via `#mgg-root[data-url]` + missing global → warn; embedded + non-boolean `impersonated` → warn; embedded via `/modules/remote/` path → warn; not embedded → no warn; warn-once; hostile getter never throws). All pass.
- [x] T018 [P] [US3] Added `setImpersonation` cases to `src/__tests__/redux/app.slice.test.ts` (true / false / leaves `isProd` + `backendSchoolBoxUrl` intact).
- [x] T019 [US3] `ModuleAccessWrapper.test.tsx` case "impersonation state is taken from the Redux app slice, not window" — deny with no `window.schoolboxUser` set, driven only by the mocked selector.

### Implementation for User Story 3

- [x] T020 [US3] "Reuse notes" block at the top of `src/helper/ImpersonationHelper.ts`; [research.md](./research.md) R2 already carries the same note (only `App.tsx` calls `resolveImpersonation()`; consumers read the slice).

**Checkpoint**: Detection primitive is proven reusable and single-sourced.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T021 [P] `mgg-ui` full suite (Node 20): **1335 pass**, +20 new; 10 failures in 4 `SynergeticUserPermissions` suites are **pre-existing** (fail identically on `git stash`) and unrelated. `mggs-api` `SynMggsModuleController` suite: 13/13 pass with `SENTRY_DSN=""` (blanking sidesteps a pre-existing `@sentry` init crash; `ModuleHelper.test.ts` and other non-Sentry suites pass normally).
- [~] T022 **PENDING** — `quickstart.md` §1–§4 end-to-end run needs an embedded SchoolBox session; steps §3.1–§3.4 (block behaviour) and §3.5–§3.6 (fail-open / warn) to be executed and evidence recorded in the PR.
- [~] T023 [P] **PENDING** — user runs `/code-review` on `023-impersonation-module-block` (cannot be launched from within implement).
- [x] T024 Confirmed FR-010: `git status` shows no change to `src/services/AuthService.ts` (mgg-ui) or `src/controllers/AuthController.ts` / `src/helper/ModuleHelper.ts` (mggs-api); `/auth/canAccess` and the `/auth/schoolbox` handshake untouched.

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
- **T006 depended on T002** — resolved: `window.schoolboxUser.impersonated`. T006 can be
  written directly against that constant now.

### Parallel opportunities

- **Phase 1**: T002 runs alone (spike).
- **Phase 2**: T003 ∥ T004 (mggs-api, different files); T005 ∥ T006 (mgg-ui, different files). T007 then T008.
- **Phase 3**: T011 ∥ T012 after T009–T010.
- **Phase 4**: T013 ∥ T015; T016 after T005/T004.
- **Phase 5**: T017 ∥ T018; T019 after them.
- **Phase 6**: T021 ∥ T023; T024 after the implementation tasks land.

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
