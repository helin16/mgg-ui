# Implementation Plan: Future L.O.A. Column

**Branch**: `005-future-loa-column` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-future-loa-column/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Update the enrolment numbers dashboard so the current-year future section gains a
`Returning L.O.A.` column positioned between `Not Returning Next Year` and `Place Offered`,
place same-year returning leave students in rows by their current `StudentYearLevel`,
include qualifying current-year leave-return students in that column and in `Total at Year
End`, fix the existing omission of current-year future students from the current-year
future status columns, and keep the PDF export aligned with the visible table.

## Technical Context

**Language/Version**: TypeScript 4.9 in a React 18.3.1 application  
**Primary Dependencies**: React, react-bootstrap, styled-components, moment-timezone, lodash, `@react-pdf/renderer`, Jest, React Testing Library  
**Storage**: N/A  
**Testing**: Jest component tests in `src/__tests__/components/Enrollments/`  
**Target Platform**: Browser-based SchoolBox/remote enrolments UI with PDF export  
**Project Type**: Single React application  
**Performance Goals**: Preserve current synchronous dashboard rendering expectations after data load and keep PDF export generation at the current user-visible speed  
**Constraints**: Must preserve `MGGS_MODULE_ID_ENROLLMENTS` access, reuse existing service and type boundaries, avoid new API calls or contract changes, keep current filters working, place same-year returning leave students by current year level, preserve existing next-year L.O.A. year-level inference, and keep visible table and PDF export column layouts in sync  
**Scale/Scope**: One dashboard panel, one PDF export component, one enrolments page surface, and focused Jest coverage for dashboard calculations and export structure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Affected route and module surface are identified as the enrolments module dashboard
  rendered through `EnrolmentManagementPage` under `MGGS_MODULE_ID_ENROLLMENTS`; existing
  `ModuleAccessWrapper` enforcement remains unchanged.
- Backend interactions continue through existing service wrappers only:
  `MggsModuleService`, `SynLuFutureStatusService`, `SynLuCampusService`,
  `SynLuYearLevelService`, `SynVStudentService`, `SynVFutureStudentService`, and
  `SynLuTransitionDateService`. No direct `axios` usage or new contract types are planned.
- User-triggered async behavior remains the existing dashboard load/refresh/export flow
  with current loading spinner and `Toaster` failure behavior; the feature changes only
  calculation and presentation within already-defined async states.
- No new env vars, embeds, uploads, tokens, HTML rendering paths, or broader student-data
  exposure are introduced. The feature reuses existing enrolment data already shown in the
  dashboard and export.
- Verification will cover changed shared dashboard logic and PDF structure with automated
  Jest tests, plus documented manual validation for live enrolment counts and export output.

## Project Structure

### Documentation (this feature)

```text
specs/005-future-loa-column/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── enrolment-dashboard-current-future-columns.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   └── Enrollments/
│       ├── EnrolmentDashboardPanel.tsx
│       └── EnrolmentDashboardExportPdf.tsx
├── pages/
│   └── Enrollments/
│       └── EnrolmentManagementPage.tsx
├── services/
│   ├── Module/
│   └── Synergetic/
├── types/
│   ├── modules/
│   └── Synergetic/
└── __tests__/
    └── components/Enrollments/
        ├── EnrolmentDashboardPanel.test.tsx
        └── EnrolmentDashboardExportPdf.test.tsx
```

**Structure Decision**: Keep the implementation inside the existing enrolments dashboard
surface. The main calculation and column-order changes belong in
`src/components/Enrollments/EnrolmentDashboardPanel.tsx`, export layout changes belong in
`src/components/Enrollments/EnrolmentDashboardExportPdf.tsx`, and verification belongs in
the existing enrolments component tests under `src/__tests__/components/Enrollments/`.

## Complexity Tracking

No constitution violations are currently required.
