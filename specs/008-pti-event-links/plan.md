# Implementation Plan: Parent Teacher Interview Event Links

**Branch**: `008-pti-event-links` | **Date**: 2026-06-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-pti-event-links/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a restricted Parent Teacher Interview SchoolBox page and matching admin page that reuse the existing module/page patterns, allow module users to find active teaching staff, automatically retrieve each selected staff member's existing calendar events for a chosen local-time window, and allow module admins to create Teams meeting links in bulk through new typed Parent Teacher Interview calendar services backed by the `../mggs-api` feature 004 endpoints and module-managed subject/body settings.

## Technical Context

**Language/Version**: TypeScript 4.9 + React 18  
**Primary Dependencies**: React Bootstrap, styled-components, axios via `AppService`, moment/moment-timezone, react-datetime  
**Storage**: Backend API + existing module settings (`/syn/mggsModule/:id`)  
**Testing**: Jest + React Testing Library; Cypress for route/access workflow; manual verification for SchoolBox-hosted access path  
**Target Platform**: React SPA used inside SchoolBox/remote module routing  
**Project Type**: Single-project web application  
**Performance Goals**: Staff search step loads within 5 seconds for normal staff volumes; per-staff calendar retrieval feedback within 30 seconds; duplicate create submissions prevented immediately  
**Constraints**: Must use `ModuleAccessWrapper` and `Page`/`AdminPage` patterns, must use `AppService`-based service wrappers and typed contracts, must not add new env vars, must display/validate datetimes in browser local timezone while sending offset-aware values to the API, and must keep create unavailable to non-admin users while still allowing retrieval  
**Scale/Scope**: One new module route, one main page, one admin settings surface, one new calendar service, several new types/components, and focused test coverage for routing/access/retrieval/create flow

## Constitution Check

**Gate Status**: ✅ **PASS**

- ✅ **I. Module-Gated Delivery**: The plan introduces `SchoolBoxUrls.ParentTeacherInterview = '/parentTeacherInterview'`, `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24`, a `SchoolBoxRouter` entry wrapped by `ModuleAccessWrapper`, and an admin page that reuses `AdminPage` for admin-only access.
- ✅ **II. Typed Service Boundaries**: All backend interactions stay in `src/services/*`, reusing `SynVStaffService`, `SynLuStaffCategoryService`, and `MggsModuleService`, plus a new `ParentTeacherInterviewCalendarService` with matching `src/types/ParentTeacherInterview/*`.
- ✅ **III. Explicit Async UX States**: Staff list loading, category loading, per-row calendar retrieval, create submission, empty results, validation failures, access denial, missing settings, and mixed per-staff outcomes are all defined and surfaced.
- ✅ **IV. School Data and Configuration Safety**: No new env vars, uploads, or embeds; meeting links remain visible only to authorized module users; subject/body are stored in existing module settings under `parentTeacherInterviewCalendar` instead of browser storage.
- ✅ **V. Risk-Based Verification**: Plan includes service tests, component/page/router tests, and Cypress/manual verification for the restricted SchoolBox route, automatic retrieval flow, and mixed retrieval/create workflow.

## Project Structure

### Documentation (this feature)

```text
specs/008-pti-event-links/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── parent-teacher-interview-route.md
│   └── parent-teacher-interview-service-interface.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── common/
│   ├── module/
│   └── staff/
├── layouts/
│   └── SchoolBox/
├── pages/
│   ├── Enrollments/
│   └── ParentTeacherInterview/
├── services/
│   ├── Module/
│   ├── ParentTeacherInterview/
│   └── Synergetic/
├── types/
│   ├── ParentTeacherInterview/
│   ├── Synergetic/
│   └── modules/
└── __tests__/
    ├── layouts/
    ├── pages/
    └── services/

cypress/
├── e2e/
└── support/
```

**Structure Decision**: Keep the feature inside the existing single React application. Reuse the existing SchoolBox router, page/admin layouts, module settings editor, staff lookup services, category selector, and shared table component. Add a focused `ParentTeacherInterview` page/service/type namespace rather than extending unrelated modules.

## Phase 0: Research

**Status**: ✅ **COMPLETE**

See [research.md](research.md). Resolved decisions:

1. Use `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24` to align with the API module ID.
2. Add `SchoolBoxUrls.ParentTeacherInterview = '/parentTeacherInterview'` and route it through `SchoolBoxRouter`.
3. Reuse `SynVStaffService` and `SynLuStaffCategoryService`; add a local `SynLuDepartmentCodes.TS` enum for the teaching-staff filter.
4. Use option A for retrieval UX: auto-load existing events per selected row once both datetimes are valid or changed, and show those events inline in the schedule step before create.
5. Store subject/body in `module.settings.parentTeacherInterviewCalendar.subject` and `.bodyText`.
6. Main page access matches Enrolments; non-admin users can retrieve but not create, and the UI explains that create requires module-admin access.

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md) for entity fields, validation rules, and UI state transitions.

**Key entities**:
- `iParentTeacherInterviewSelectableStaffRow`
- `iParentTeacherInterviewScheduleRow`
- `iParentTeacherInterviewCalendarEventsResponse`
- `iParentTeacherInterviewCreateCalendarEventResponse`
- `iParentTeacherInterviewModuleSettings`

### Contracts

See [contracts/parent-teacher-interview-route.md](contracts/parent-teacher-interview-route.md) and [contracts/parent-teacher-interview-service-interface.md](contracts/parent-teacher-interview-service-interface.md).

**New frontend service**:
- `ParentTeacherInterviewCalendarService.getCalendarEvents(params)`
- `ParentTeacherInterviewCalendarService.createCalendarEvent(params)`

**Primary reusable services**:
- `SynVStaffService.getStaffList(...)`
- `SynLuStaffCategoryService.getAll(...)`
- `MggsModuleService.getModule(...)`
- `MggsModuleService.updateModule(...)`

### Planned Source Changes

**New files**:
- `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`
- `src/pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage.tsx`
- `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel.tsx`
- `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.tsx`
- `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel.tsx`
- `src/services/ParentTeacherInterview/ParentTeacherInterviewCalendarService.ts`
- `src/types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventSummary.ts`
- `src/types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventsResponse.ts`
- `src/types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventRequest.ts`
- `src/types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventResponse.ts`
- `src/types/ParentTeacherInterview/iParentTeacherInterviewModuleSettings.ts`
- `src/types/ParentTeacherInterview/iParentTeacherInterviewScheduleRow.ts`
- `src/types/Synergetic/Lookup/SynLuDepartmentCodes.ts`

**Existing files modified**:
- `src/layouts/SchoolBox/SchoolBoxUrls.ts`
- `src/layouts/SchoolBox/SchoolBoxRouter.tsx`
- `src/types/modules/iModuleUser.ts`
- `AGENTS.md`

## Phase 1 Completion Checklist

- [x] Technical context anchored to current repo/tooling
- [x] Constitution gate passed
- [x] Research decisions captured and clarifications resolved
- [x] Data model defined for staff selection, retrieval, create outcomes, and settings
- [x] Route/UI and service contracts documented
- [x] AGENTS plan reference updated
- [x] Post-design constitution check passed

## Post-Design Constitution Check

- Route, module surface, and access model remain explicit and reuse existing shared guards.  
  Status: PASS.
- Service wrappers and typed contracts are defined for all new backend interactions.  
  Status: PASS.
- Async states are designed for staff load, retrieval load, create submission, missing settings, and mixed outcomes.  
  Status: PASS.
- Sensitive data/config handling stays inside existing module settings and authorized views only.  
  Status: PASS.
- Verification includes unit/component/router coverage and Cypress/manual path validation.  
  Status: PASS.

## Next Steps

**Phase 2**: Run `/speckit.tasks` to break this plan into implementation tasks.  
**Implementation**: Build the route, page/admin shells, staff-selection/schedule components, typed calendar service, module settings panel, and verification coverage.

## Complexity Tracking

No constitution violations are expected for this feature.
