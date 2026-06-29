# Quickstart: Parent Teacher Interview Event Links

**Feature**: [Parent Teacher Interview Event Links](spec.md) | **Plan**: [plan.md](plan.md) | **Data Model**: [data-model.md](data-model.md)  
**Date**: 2026-06-29

## Overview

This feature adds a restricted SchoolBox page and admin page for Parent Teacher Interview event-link creation. The user flow is:

1. load active teaching staff
2. search/filter and select staff
3. enter local-time schedule values
4. retrieve existing events per selected row
5. create Teams meeting links in bulk as a module admin

## Implementation Order

### Phase 1: Route, module constant, and type scaffolding

1. Add `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24` to `src/types/modules/iModuleUser.ts`
2. Add `SchoolBoxUrls.ParentTeacherInterview = '/parentTeacherInterview'` to `src/layouts/SchoolBox/SchoolBoxUrls.ts`
3. Add the new router case in `src/layouts/SchoolBox/SchoolBoxRouter.tsx`
4. Create `src/types/Synergetic/Lookup/SynLuDepartmentCodes.ts`
5. Create the new `src/types/ParentTeacherInterview/*` files from the contract

**Verify**:
```bash
cd /Users/helin/git/MentoneGirls/mgg-ui
npm test -- --watchAll=false src/__tests__/layouts/SchoolBox/SchoolBoxUrls.test.ts
```

### Phase 2: Calendar service and settings support

1. Create `src/services/ParentTeacherInterview/ParentTeacherInterviewCalendarService.ts`
2. Reuse `MggsModuleService.getModule(24)` on the main page to load subject/body settings
3. Create `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel.tsx`
4. Wire that settings panel into `ParentTeacherInterviewAdminPage.tsx`

**Verify**:
```bash
npm run test -- src/__tests__/services
```

### Phase 3: Main page and step flow

1. Create `ParentTeacherInterviewPage.tsx` using `Page`
2. Create `ParentTeacherInterviewStaffSelectionPanel.tsx`
   - reuse shared `Table`
   - reuse `SynLuStaffCategorySelector`
   - query `SynVStaffService` with `ActiveFlag=true` and `StaffDepartment=TS`
3. Create `ParentTeacherInterviewSchedulePanel.tsx`
   - maintain per-row local datetime state
   - auto-load calendar retrieval when row datetimes become valid
   - render inline existing events beneath the row
4. Gate create UI for non-admin users

**Verify**:
```bash
npm run test -- src/__tests__/pages
```

### Phase 4: Submit flow and mixed outcomes

1. Build the bulk create action using one request per selected row
2. Preserve per-row `CREATED`, `EXISTS`, and `FAILED` results
3. Prevent duplicate submission while requests are in flight
4. Surface API errors through row-level messages and shared `Toaster`

**Verify**:
```bash
npm run test -- src/__tests__/services src/__tests__/pages
```

### Phase 5: Router/component/Cypress coverage

1. Add/extend tests for:
   - `SchoolBoxRouter`
   - `Page`/admin access expectations
   - calendar service
   - staff selection and header checkbox behaviour
   - schedule step retrieval state
   - create button gating and submission outcomes
2. Add Cypress coverage for the restricted route and happy-path batch flow

**Verify**:
```bash
npm run cypress:open
```

## Suggested File Layout

```text
src/pages/ParentTeacherInterview/
├── ParentTeacherInterviewPage.tsx
├── ParentTeacherInterviewAdminPage.tsx
└── components/
    ├── ParentTeacherInterviewStaffSelectionPanel.tsx
    ├── ParentTeacherInterviewSchedulePanel.tsx
    └── ParentTeacherInterviewModuleSettingsPanel.tsx

src/services/ParentTeacherInterview/
└── ParentTeacherInterviewCalendarService.ts

src/types/ParentTeacherInterview/
├── iParentTeacherInterviewCalendarEventSummary.ts
├── iParentTeacherInterviewCalendarEventsResponse.ts
├── iParentTeacherInterviewCreateCalendarEventRequest.ts
├── iParentTeacherInterviewCreateCalendarEventResponse.ts
├── iParentTeacherInterviewModuleSettings.ts
└── iParentTeacherInterviewScheduleRow.ts
```

## Manual Validation Checklist

- Open the new SchoolBox route as a module user and confirm access matches Enrolments.
- Confirm non-admin users can retrieve existing events but cannot submit create.
- Confirm the admin page loads subject/body settings and saves them through `ModuleEditPanel`.
- Confirm selected rows remain selected while search/category filters change.
- Confirm header checkbox toggles all rows currently shown in the staff table.
- Confirm valid local datetimes trigger retrieval automatically.
- Confirm create stays blocked when retrieval has failed for any selected row.
- Confirm mixed `CREATED`/`EXISTS`/`FAILED` rows remain visible after submission.

## Environment Notes

- Use Node `>=20.0.0` as defined in `package.json`.
- This feature does not add any new `REACT_APP_*` variables.
- The API endpoints depend on the backend Parent Teacher Interview calendar feature being available.
