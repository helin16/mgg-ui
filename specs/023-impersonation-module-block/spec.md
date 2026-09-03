# Feature Specification: Impersonation Detection & Per-Module Block

**Feature Branch**: `023-impersonation-module-block`
**Created**: 2026-09-03
**Status**: Draft
**Input**: User description: "we need to create a helper with function to detect whether the user is impersonating someone else. and block impersonated user to access Modules the `blockImpersonatedUser` from UI only. 1. add an extra boolean column in MggModules for `blockImpersonatedUser` with default false. 2. with all modules, we need to block any user from the UI to access that module from impersonating user." Follow-up: "create the helper on the UI side for now using: Detect it in the embedded page (client-side)".

## Clarifications

### Session 2026-09-03

- Q: Where does the impersonation signal come from? → A: Client-side detection from the embedded SchoolBox host page context (concrete signal defined below). No backend change to the authentication flow.
- Q: Behaviour when the SchoolBox host page cannot be inspected? → A: Fail open — treat the session as not impersonating and allow access. The block is defence-in-depth, not a security boundary.
- Q: How is `blockImpersonatedUser` set per module? → A: Outside the app for this iteration (database / backend admin), no in-app toggle. The API project (`../mggs-api`) must add a database migration and the model / read-path changes so the flag exists and is returned to the UI.
- Q: Scope of the block? → A: Gate the module screen on open. (Superseded below: entry-point hiding was dropped once it was confirmed the MGG UI has no in-app module navigation.)
- Q: The MGG UI has no in-app module navigation to hide - how should the "hide entry points" part be handled? → A: Drop it. The screen-level access-denied gate is the whole block; revisit entry-point hiding only if the MGG UI later grows its own module navigation.
- Q: What concrete signal does the helper check to detect impersonation? → A: A JavaScript global exposed on the SchoolBox host page (a user/context object with an "impersonating" / real-user field). The helper resolves this once at app boot and the resulting boolean is stored in the Redux `app` slice; all consumers (the module-access gate) read it from Redux rather than re-inspecting the page.
- Q: What happens when the app is embedded in SchoolBox but the impersonation global is missing or malformed? → A: Emit a Sentry warning once at boot (reusing existing Sentry wiring), then resolve the flag to `false` (fail open). A standalone / non-embedded boot is expected and MUST NOT warn.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Impersonating staff is blocked from a protected module (Priority: P1)

A staff member uses SchoolBox's "log in as" / impersonation feature to act as another
user (for example a student or parent). While impersonating, they navigate to a module
that the school has marked as protected against impersonation. The UI recognises the
session is an impersonated one and refuses to open the module, showing a clear
access-denied panel instead of the module screen.

**Why this priority**: This is the whole point of the feature - preventing sensitive
operational modules (finance, attendance, enrolments, reporting, messaging) from being
driven while a staff member is impersonating someone else, which would attribute actions
to the wrong person and expose data outside the impersonated user's normal reach.

**Independent Test**: Mark one module as protected, start an impersonated SchoolBox
session, open that module's route, and confirm the access-denied panel is shown and the
module screen never renders. Repeat without impersonation and confirm the module opens
normally.

**Acceptance Scenarios**:

1. **Given** a module flagged to block impersonated users, **When** an impersonated
   session opens that module, **Then** the UI shows the standard access-denied panel with
   a message explaining access is blocked because the session is impersonating another
   user, and the module's own screen is not rendered.
2. **Given** a module flagged to block impersonated users, **When** a normal
   (non-impersonated) session with the required module role opens that module, **Then**
   the module opens exactly as it does today.
3. **Given** a module that is NOT flagged (the default), **When** an impersonated session
   opens it, **Then** access is unchanged - impersonation has no effect.
4. **Given** an impersonated session sitting on a protected module screen, **When** the
   staff member ends impersonation and returns to their own account and reloads,
   **Then** access is re-evaluated and the module opens normally.

---

### User Story 2 - School turns the protection on per module (Priority: P2)

A module administrator decides which modules should be off-limits during impersonation.
Every module starts unprotected; the administrator opts a module in by setting the
`blockImpersonatedUser` flag on that module record directly in the database / backend
administration (no in-app screen this iteration). The change takes effect for subsequent
module opens without a code release.

**Why this priority**: The block must be selective. Some modules are safe to view while
impersonating (and impersonation is a legitimate support tool); protecting all of them
indiscriminately would break support workflows. Opt-in per module keeps the blast radius
controlled.

**Independent Test**: With the flag off for a module, confirm an impersonated session can
open it. Set the flag on for that module record, re-open in an impersonated session, and
confirm it is now blocked - with no other module affected.

**Acceptance Scenarios**:

1. **Given** a module with `blockImpersonatedUser` unset, **When** its stored value is
   read, **Then** it defaults to "not blocked" (false).
2. **Given** an administrator enables `blockImpersonatedUser` for one module, **When** an
   impersonated session next opens that module, **Then** it is blocked, and other modules
   remain accessible to impersonated sessions.

---

### User Story 3 - Reusable impersonation check for the rest of the UI (Priority: P3)

Any part of the UI that needs to know whether the current session is impersonating
another user can call one shared helper and get a definitive answer, rather than each
screen re-deriving it. The per-module block is the first consumer of that helper.

**Why this priority**: Consolidating the detection in one place prevents inconsistent
ad-hoc checks later (e.g. hiding a "send" button, warning banners) and keeps the
host-page-inspection logic in a single testable unit.

**Independent Test**: With the SchoolBox host-page global stubbed to an impersonating
value, boot the app and confirm the Redux `app` slice flag is `true`; with the global
absent or set to a normal value, confirm the flag is `false`.

**Acceptance Scenarios**:

1. **Given** the SchoolBox host-page global indicates an impersonated session, **When**
   the app boots, **Then** the Redux `app` slice impersonation flag is `true`.
2. **Given** the global is absent or indicates a normal session, **When** the app boots,
   **Then** the Redux `app` slice impersonation flag is `false`.
3. **Given** the flag is set, **When** any consumer needs the impersonation state, **Then**
   it reads it from the Redux `app` slice without re-inspecting the page.

---

### Edge Cases

- **Host-page context unavailable**: the UI is not always able to read the SchoolBox
  host-page global (e.g. loaded standalone rather than embedded, or the global is absent).
  In that case the helper resolves to "not impersonating", the Redux flag is `false`, and
  protected modules open normally (fail open) - see FR-011.
- **Host-page global name/shape changes** in a future SchoolBox upgrade: detection
  resolves to "not impersonating" and the block stops working, but an embedded boot with a
  missing/malformed global emits a Sentry warning (FR-011a) so the regression is visible.
  Verification must also include a documented manual check after SchoolBox upgrades, and
  the global's name/field-path MUST live in a single constant so the fix is one line.
- **Flag enabled but user also lacks the module role**: the existing role-based
  access-denied path still applies; the impersonation block is an additional gate, not a
  replacement.
- **Async ordering**: the impersonation flag is available synchronously from Redux once
  boot completes; the existing module-access check is still asynchronous, and while it is
  pending the UI shows a loading state, never a flash of the module screen.
- **Impersonation starts or ends without a full reload**: the flag is captured at app
  boot. SchoolBox impersonation start/stop navigates the page, which re-boots the MGG app,
  so the flag is re-resolved. If impersonation state somehow changes without a reboot, the
  Redux flag is stale until the next boot - accepted for this iteration.
- **Non-SchoolBox standalone public routes** (asset pickup, online donation, campus
  display, ENews): these are outside the module-access surface and are not in scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST provide a single shared helper that reports whether the current
  session is a SchoolBox impersonated session ("logged in as" another user).
- **FR-002**: The helper MUST determine impersonation by reading a JavaScript global
  exposed on the embedded SchoolBox host page — confirmed to be `window.schoolboxUser`,
  whose boolean `impersonated` field is `true` during an impersonated session. The exact
  path lives in one constant. It MUST NOT require a change to the `/auth/schoolbox`
  authentication handshake or any new backend authentication field.
- **FR-002a**: The helper MUST be run once during app boot (alongside the existing
  app-bootstrap wiring), and its boolean result MUST be stored in the Redux `app` slice.
  All consumers (the FR-005 gate, plus any future consumer) MUST read the flag from the
  Redux `app` slice, not by calling the helper again or re-inspecting the page.
- **FR-003**: The module records (`MggModules` / the `uMGGSModules` table) MUST gain a
  boolean attribute `blockImpersonatedUser` that defaults to `false` for every existing
  and new module.
- **FR-003a**: The `blockImpersonatedUser` column MUST be delivered as a reversible schema
  change in two parts: (a) a `tests/migrations/SynergeticDB/` mirror migration (`up` adds
  the column default `false`; `down` removes it) so automated tests exercise it, and (b) a
  reviewed forward + rollback SQL script (`contracts/synergetic-alter.sql`) for IT/DBA to
  apply to the production Synergetic database - `uMGGSModules` is externally managed and is
  not created by an in-repo migration. Existing rows backfill to `false` via the column
  default.
- **FR-003b**: The API project MUST expose `blockImpersonatedUser` on its module model
  and on the module payload returned by the endpoint the UI already uses to read a module,
  so no new endpoint is introduced.
- **FR-004**: The module's `blockImpersonatedUser` value MUST be readable by the UI
  through the existing module service/type layer (added to the shared module type) so the
  access gate can consult it.
- **FR-005**: The shared module-access gate (the `ModuleAccessWrapper` path) MUST deny
  access when the target module has `blockImpersonatedUser === true` AND the Redux `app`
  slice's impersonation flag is `true`.
- **FR-006**: When access is denied for impersonation, the UI MUST show the standard
  shared access-denied panel (`Page401`-style), with a message that states the module is
  blocked because the session is impersonating another user and advises returning to the
  user's own account. It MUST NOT render the module's own screen.
- **FR-007**: When `blockImpersonatedUser` is `false` (the default), the impersonation
  check MUST have no effect on access for that module - no behavioural change for any
  module that has not opted in.
- **FR-008**: When the session is not impersonating, access to a `blockImpersonatedUser`
  module MUST be identical to today (role-based access only).
- **FR-009**: The impersonation flag is resolved at app boot and read synchronously from
  the Redux `app` slice, so it adds no asynchronous wait. The gate MUST still resolve the
  existing (asynchronous) module-access check before rendering; while that is pending it
  MUST show the existing loading indicator and MUST NOT briefly render the protected
  screen.
- **FR-010**: Enforcement of the block is UI-only. The API changes (FR-003a / FR-003b)
  only add the `blockImpersonatedUser` field and return it; `/auth/canAccess`, the
  authentication handshake, and module data APIs do NOT gain any impersonation check and
  MUST NOT be relied on to enforce the block. The specification records that this is
  defence-in-depth in the browser, not a security boundary, and that a determined user who
  bypasses the UI is still subject to existing backend role checks.
- **FR-011**: When the UI cannot read the SchoolBox host-page global (context unavailable -
  standalone load, or the global is absent / a different shape), the shared helper MUST
  resolve to "not impersonating" and the Redux flag MUST default to `false`, so protected
  modules open normally (fail open). This is accepted because the block is browser-side
  defence-in-depth, not a security boundary.
- **FR-011a**: When the app booted through the SchoolBox module surface (embedded context)
  but the impersonation global is absent or malformed, the helper MUST emit a single
  Sentry warning at boot (reusing the existing Sentry wiring) before failing open per
  FR-011. A standalone / non-embedded boot is an expected condition and MUST NOT emit a
  warning.
- **FR-012**: For this iteration `blockImpersonatedUser` is set outside the app (directly
  in the database or via backend administration). No in-app toggle is in scope. The
  specification does not require any MGG UI screen to edit the flag.
- **FR-013**: The block applies at a single point: the module screen/route is gated on
  open and shows the access-denied panel per FR-006. The MGG UI renders no dashboard,
  module launcher, or cross-module navigation of its own, so there are no in-app entry
  points to hide; SchoolBox's own navigation is outside the app's control and the
  screen-level gate is the backstop for every entry path. If the MGG UI later gains its
  own module navigation, hiding protected entries while impersonating should be revisited.
- **FR-014**: The impersonation helper and the Redux `app` slice change MUST have
  automated unit tests covering: host-page global indicates impersonation → flag `true`;
  global absent / normal → flag `false`; embedded boot with missing/malformed global →
  flag `false` **and** a Sentry warning emitted; standalone boot with no global → flag
  `false` and **no** warning; consumers read the flag from Redux (shared helper + reducer,
  behaviour change - required by the verification principle).
- **FR-015**: The per-module block MUST have an end-to-end or documented manual
  verification covering: protected module + impersonated session = blocked screen;
  protected module + normal session = allowed; unprotected module + impersonated session =
  allowed (module-access flow - required by the verification principle).
- **FR-016**: The API project change MUST have verification that the migration applies and
  rolls back cleanly and that the module read endpoint returns `blockImpersonatedUser`
  (default `false`) for existing modules (shared data contract change - required by the
  verification principle).

### Key Entities *(include if feature involves data)*

- **MggModule** (`uMGGSModules` table, surfaced to the UI as the shared module type):
  an operational module exposed through the SchoolBox module surface. Gains one new
  attribute, `blockImpersonatedUser` (boolean, default `false`), meaning "the UI must
  refuse to open this module while the session is impersonating another user." All other
  module attributes and the module-user/role model are unchanged. The attribute is added
  by an API-project migration and returned by the existing module read endpoint.
- **Impersonation flag** (Redux `app` slice, session-scoped): a boolean derived once at
  app boot by the shared helper from the SchoolBox host-page global. Held in the existing
  Redux `app` slice, not persisted to storage, not sent to the backend, re-derived on each
  app boot. Default `false`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In an impersonated SchoolBox session, opening any module that has
  `blockImpersonatedUser` enabled results in the access-denied panel 100% of the time,
  and the module's own screen is never rendered.
- **SC-002**: In a normal (non-impersonated) session, opening a `blockImpersonatedUser`
  module succeeds for every user who has the required role - measured as zero change in
  successful opens versus before the feature.
- **SC-003**: For every module that has not opted in (the default), an impersonated
  session's ability to open it is unchanged - zero regressions across existing modules.
- **SC-004**: A school can enable or disable the protection for a module and see the new
  behaviour take effect on the next module open, with no application deployment.
- **SC-005**: The impersonation *determination* adds no network round-trip - it is
  resolved once at app boot and read synchronously from the Redux `app` slice. The access
  gate additionally reads the target module's `blockImpersonatedUser` through the existing
  module read endpoint, issued **in parallel** with the access-role check it already makes,
  so it adds no measurable delay to opening a module.
- **SC-006**: After the schema change is applied (test mirror in CI; production
  `ALTER TABLE` by IT/DBA), every pre-existing module record reports
  `blockImpersonatedUser = false`, and the paired rollback removes the column with no other
  data affected.

## Assumptions

- The MGG UI is injected into the SchoolBox page's own document by the app loader (which
  hides SchoolBox's `iframe#remote` and mounts the React app into a sibling `#mgg-root`),
  so the app shares the SchoolBox DOM and `window` and can read the SchoolBox host-page
  global. When that context is absent (standalone / bypass-host load) the helper fails
  open (FR-011).
- "MggModules" in the request refers to the module records (`uMGGSModules`) exposed to the
  UI through the existing module service/type layer; the work spans the API project
  (migration + model + read payload) and the UI project (shared type + boot-time
  impersonation helper + Redux `app` slice flag + module-access gate).
- The module table (`uMGGSModules`) lives in the externally-managed Synergetic-side
  database and is not created by an in-repo migration (plan.md R5). The column is therefore
  delivered as a `tests/migrations/SynergeticDB/` mirror plus a hand-applied
  `contracts/synergetic-alter.sql`. Applying that SQL in production is an IT/DBA action and
  a release-checklist item, not gated by CI; the production half of SC-006 is confirmed by
  IT after apply (`SELECT ModuleID, blockImpersonatedUser FROM dbo.uMGGSModules`).
- SchoolBox exposes `window.schoolboxUser` on every page (confirmed by spike 2026-09-03,
  tasks T002) — a user object carrying a boolean `impersonated` field plus `id`,
  `externalId` (Synergetic id), `role`, and `communityLogin`. `impersonated === true` is
  the detection signal, held in one constant. The DOM/cookie fallback in research.md R2 is
  not needed. `communityLogin` (parent/community portal) is a separate concept and is not
  read.
- Impersonation is a legitimate support tool, so the default (`false`) must leave every
  existing module fully usable while impersonating; only explicitly flagged modules are
  affected.
- The existing role-based `ModuleAccessWrapper` / `AuthService.canAccessModule` flow
  remains the primary access control; this feature adds one extra condition to it and
  does not alter role resolution.
- High-risk cross-system verification (module access) will be covered by a Cypress check
  or a documented manual SchoolBox/UAT procedure where full automation of an impersonated
  SchoolBox session is impractical.
