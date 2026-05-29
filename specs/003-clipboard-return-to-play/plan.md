# Implementation Plan: Clipboard Return To Play

**Branch**: `003-clipboard-return-to-play` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-clipboard-return-to-play/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Update the Clipboard incident contract used by the attendance concussion alert so return to
play data is delivered as a nested `returnToPlay` object, then align the shared UI incident
type and alert logic to consume that shape. The plan covers both repositories involved in
the flow: `../mggs-api` for the Clipboard connector/controller contract and `mgg-ui` for
the typed service boundary, UTC-safe restriction filtering, and alert rendering.

## Technical Context

**Language/Version**: TypeScript 4.9 in `mgg-ui`; TypeScript Node service in `../mggs-api`  
**Primary Dependencies**: React 18.3.1, styled-components, moment-timezone, axios-based service helpers, Express router/controller flow in `../mggs-api`  
**Storage**: N/A for new browser storage; Clipboard remains the upstream source of incident data  
**Testing**: Jest service/component helper tests in `mgg-ui`; Jest connector/controller tests in `../mggs-api`; documented manual validation for the Clipboard attendance flow  
**Target Platform**: Browser-based embedded attendance UI plus Node-backed API proxy service  
**Project Type**: Single React application with a neighboring API service dependency  
**Performance Goals**: Preserve current attendance-page load expectations and keep restriction filtering synchronous once incident data is returned  
**Constraints**: Must preserve `src/services/*` and `src/types/*` boundaries in `mgg-ui`, preserve existing `/clipboard/incident` auth flow in `../mggs-api`, interpret `returnToPlay.date` as UTC before local comparison/display, and avoid widening student-data exposure  
**Scale/Scope**: One embedded attendance alert component, one Clipboard incident service/type contract in `mgg-ui`, and one Clipboard incident connector/controller contract in `../mggs-api`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Affected surface is the embedded Clipboard attendance modify workflow that inserts
  `ClipboardConcussionAlert` via `src/LoadComponents.tsx`; no new route or `moduleId` is
  introduced, and the existing attendance page access model remains unchanged.
- `mgg-ui` continues consuming incident data only through `src/services/Clipboard/ClipboardIncidentService.ts`
  and `src/types/Clipboard/iClipboardIncident.ts`; no direct `axios` use is planned in UI code.
- Async behaviour remains explicit: the alert stays hidden while loading, surfaces failures
  through `Toaster.showApiError`, and returns to a no-alert state when no active incidents
  qualify.
- No new env vars, storage, uploads, embeds, or HTML rendering paths are introduced; the
  feature continues exposing only student name, incident timing, and return-to-play details
  already needed for the alert.
- Verification will cover the shared contract changes with automated tests in both repos
  and use a documented manual check for the end-to-end attendance alert behaviour.

## Project Structure

### Documentation (this feature)

```text
specs/003-clipboard-return-to-play/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── clipboard-return-to-play.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   └── Clipboard/
├── services/
│   └── Clipboard/
├── types/
│   └── Clipboard/
├── LoadComponents.tsx
└── __tests__/
    └── services/Clipboard/

../mggs-api/
├── src/
│   ├── connectors/Clipboard/
│   ├── controllers/Clipboard/
│   └── routes.ts
└── tests/
    ├── connectors/Clipboard/
    └── controllers/Clipboard/
```

**Structure Decision**: Keep the UI changes inside the existing Clipboard alert flow in
`src/components/Clipboard/ClipboardConcussionAlert.tsx`, `src/services/Clipboard/ClipboardIncidentService.ts`,
`src/types/Clipboard/iClipboardIncident.ts`, and related service tests. Track the upstream
contract work explicitly against the neighboring `../mggs-api` repo because the frontend
spec depends on that API proxy returning the nested `returnToPlay` shape consistently for
both list and single-incident requests.

## Complexity Tracking

No constitution violations are currently required.
