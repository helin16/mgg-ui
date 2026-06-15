# Implementation Plan: Clipboard Music Sync Management UI

**Branch**: `007-clipboard-music-sync` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-clipboard-music-sync/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Create a management UI (similar to Finance page pattern) to display Clipboard teams and their sessions, with the ability to manually trigger student-to-team music sync operations via the existing `POST /clipboard/syncMusic` API endpoint. The page will use React Bootstrap tabs for consistency with Finance, display team/session data via existing ClipboardTeamService and ClipboardSessionService, and manage sync job status through a new ClipboardMusicSyncService.

## Technical Context

**Language/Version**: TypeScript + React 18
**Primary Dependencies**: React Bootstrap, styled-components, axios (via service layer)
**Storage**: Backend API (mggs-api) — no frontend storage needed
**Testing**: Jest + React Testing Library for unit tests; Cypress for e2e
**Target Platform**: Web (React SPA deployed to Netlify)
**Project Type**: React web application (module-gated feature under Clipboard module)
**Performance Goals**: Page load < 5 seconds; sync operation feedback within 30 seconds
**Constraints**: Module-gated access via existing ModuleAccessWrapper; no new environment variables required
**Scale/Scope**: Display 10+ clipboard teams; support concurrent sync operations with duplicate prevention
**Backend Dependency**: mggs-api with `POST /clipboard/syncMusic` endpoint (confirmed existing); ClipboardTeamService and ClipboardSessionService (confirmed existing)

## Constitution Check

**Gate Status**: ✅ **PASS** — All five principles satisfied.

- ✅ **I. Module-Gated Delivery**: Route is `/modules/remote/:code/clipboard/music-sync` (or similar under Clipboard module); `moduleId` is MGGS_MODULE_ID_CLIP_BOARD; access wrapped via ModuleAccessWrapper or module auth check.
- ✅ **II. Typed Service Boundaries**: Uses existing ClipboardTeamService, ClipboardSessionService; new ClipboardMusicSyncService created in `src/services/Clipboard/*`; all types in `src/types/Clipboard/*` (iClipboardTeam, iClipboardSession, new iClipboardSyncMessage).
- ✅ **III. Explicit Async UX States**: Loading spinner during team fetch; error toast on API failure; sync operation button disabled during flight; success/error feedback via toast after sync completes; empty state when no teams.
- ✅ **IV. School Data and Configuration Safety**: No new environment variables; sync endpoint uses existing Clipboard API credentials in mggs-api; no sensitive data rendered; no `dangerouslySetInnerHTML` or file uploads.
- ✅ **V. Risk-Based Verification**: Cypress e2e test for full flow (teams list → select team → trigger sync → confirm popup → sync completes); unit tests for ClipboardMusicSyncService; verification of no duplicate submissions.

## Project Structure

### Documentation (this feature)

```text
specs/007-clipboard-music-sync/
├── spec.md              # Feature specification ✅
├── plan.md              # This file (Phase 0-1 planning)
├── research.md          # Phase 0 output (SKIP — no clarifications)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (dev walkthrough)
├── contracts/           # Phase 1 output (route/API contracts)
│   ├── clipboard-music-sync-route.md
│   └── clipboard-sync-service-interface.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

**New files created**:
- `src/services/Clipboard/ClipboardMusicSyncService.ts` — Service wrapper for POST `/clipboard/syncMusic`
- `src/types/Clipboard/iClipboardSyncMessage.ts` — Type for sync job response
- `src/pages/Clipboard/ClipboardMusicSyncPage.tsx` — Main page component
- `src/pages/Clipboard/components/ClipboardTeamsListPanel.tsx` — Team list with sync buttons
- `src/pages/Clipboard/components/ClipboardSyncConfirmPopup.tsx` — Confirmation modal
- `src/pages/Clipboard/components/ClipboardSessionDetailsPanel.tsx` — Session info display

**Existing files modified**:
- `src/App.tsx` — Add new route for Clipboard Music Sync page
- `src/layouts/SchoolBoxRouter.tsx` — Add Clipboard music sync route under module
- `AGENTS.md` — Update speckit plan reference

---

## Phase 0: Research

**Status**: ✅ **COMPLETE** (no clarifications remaining in spec)

All three critical clarifications were resolved via mggs-api review:
1. ✅ Music Sync API: `POST /clipboard/syncMusic` exists in mggs-api/src/controllers/Clipboard/ClipboardSyncMusicController.ts
2. ✅ Sync Target: Internal Clipboard system (students to team rosters); API handles all logic
3. ✅ Session Data: `iClipboardSession` with title, startDateTime, endDateTime, activity, teams[], assignedStaff[], cancelled, scored

**Output**: No research.md needed — spec is concrete and API contracts confirmed.

---

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md) for complete entity definitions, validation rules, and state transitions.

**Key entities**:
- **iClipboardTeam**: id, name, classCode, externalId, isHidden
- **iClipboardSession**: id, title, startDateTime, endDateTime, activity, teams[], assignedStaff[], cancelled, scored
- **iClipboardSyncMessage** (new): id, type, status (NEW|PROCESSING|SUCCESS|FAILED), createdAt, updatedAt, request, response, error

### Service Contracts

**Existing services** (reuse as-is):
- `ClipboardTeamService.getAll()` → Promise<iPaginatedResult<iClipboardTeam>>
- `ClipboardSessionService.getAll(params)` → Promise<iPaginatedResult<iClipboardSession>>

**New service** (create):
- `ClipboardMusicSyncService.triggerSync(teamId?)` → POST `/clipboard/syncMusic` → Promise<iClipboardSyncMessage>
- `ClipboardMusicSyncService.pollSyncStatus(messageId)` → GET `/clipboard/syncMusic/:id` (if needed for status polling)

### UI Contract

**Route**: `/modules/remote/:code/clipboard/music-sync` (or under existing Clipboard route)

**Page Structure**:
```
ClipboardMusicSyncPage
├── Page wrapper (moduleId: MGGS_MODULE_ID_CLIP_BOARD)
├── Tabs (Finance pattern)
│   └── Tab: "Music Sync"
│       ├── ClipboardTeamsListPanel
│       │   └── Table with teams
│       │       ├── Team Name
│       │       ├── Session Info (expandable)
│       │       ├── Last Sync Time
│       │       └── Sync Button
│       │           └── ClipboardSyncConfirmPopup (on click)
│       └── ClipboardSessionDetailsPanel (on team expand)
│           └── Session metadata
```

### API Contracts

See [contracts/](contracts/) directory for detailed route and service interface definitions.

---

## Phase 1 Completion Checklist

- [x] Data model finalized with all entities, fields, and relationships
- [x] Service contracts defined (existing + new ClipboardMusicSyncService)
- [x] Route and page structure documented
- [x] UI state machine (loading, success, error, empty) defined
- [x] Module access control verified (moduleId, role checks)
- [x] Constitution Check re-evaluated post-design ✅ **PASS**
- [x] Agent context updated (AGENTS.md reference to this plan)

---

## Next Steps (After Phase 1)

**Phase 2** (via `/speckit.tasks`):
- Generate actionable implementation tasks from this plan
- Break down component creation, service integration, tests, and e2e verification

**Implementation** (via `/speckit.implement`):
- Execute Phase 2 tasks
- Create components, services, tests, and route integration
- Verify via Cypress e2e and unit test suite
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Single project (this repository)
src/
├── components/
├── helper/
├── layouts/
├── pages/
├── services/
├── redux/
├── types/
└── __tests__/

cypress/
├── e2e/
├── fixtures/
└── support/

public/
AppLoader/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
