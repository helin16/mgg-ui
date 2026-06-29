# Research: Parent Teacher Interview Event Links

**Feature**: [Parent Teacher Interview Event Links](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-06-29

## Decision: Align the UI module constant and route naming with the API feature

**Decision**: Add `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24` to the UI and add `SchoolBoxUrls.ParentTeacherInterview = '/parentTeacherInterview'`, then route it through `SchoolBoxRouter`.

**Rationale**:
- The API already enforces `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24`.
- Matching the API constant avoids cross-repo drift in access checks and module settings.
- Existing SchoolBox route constants use short explicit paths, and `/parentTeacherInterview` is already the backend namespace for the calendar endpoints.

**Alternatives considered**:
- Reuse another module ID: rejected because access would become semantically wrong and harder to provision.
- Invent a different SchoolBox path such as `/parent_teacher_interview`: rejected because it adds unnecessary divergence from the API/module name.

## Decision: Reuse existing Synergetic staff/category services and add a local teaching-staff enum

**Decision**: Reuse `SynVStaffService.getStaffList(...)` for staff rows and `SynLuStaffCategoryService.getAll(...)`/`SynLuStaffCategorySelector` for category options. Add a local `SynLuDepartmentCodes` enum with `TS = 'TS'` and filter staff by `ActiveFlag = true` and `StaffDepartment = TS`.

**Rationale**:
- `StaffListPanel` already uses the same Synergetic staff/category services and search model.
- The feature only needs a narrower slice of the existing staff list behaviour rather than a new API.
- Defining `SynLuDepartmentCodes.TS` makes the "Teaching Staff" rule explicit and testable.

**Alternatives considered**:
- Add a new staff-specific API endpoint: rejected because current services already support filtering through query params.
- Infer teaching staff from job positions only: rejected because it is more expensive and the requested rule is now explicitly tied to department code `TS`.

## Decision: Use retrieval option A in the schedule step

**Decision**: Once a selected staff row has both valid datetimes, the schedule step automatically loads that staff member's existing calendar events for that range and shows the result inline beneath the row before create submission.

**Rationale**:
- The API contract describes `GET /parentTeacherInterview/calendarEvents` as a UI retrieval step before create.
- The helper/controller implementation confirms retrieval is a first-class workflow, while create still performs its own duplicate-check retrieval as a safety net.
- Inline retrieval results let operators see likely conflicts and existing bookings without leaving the second step.

**Alternatives considered**:
- Create types/services for retrieval but do not render it in v1: rejected because it leaves user value on the table and does not match the preferred option.
- Add a separate "Load events" button per row: rejected because it adds friction to a multi-row workflow.
- Show retrieval results in a modal: rejected because it makes multi-row comparison harder.

## Decision: Store subject and body in module settings under a nested Parent Teacher Interview key

**Decision**: Manage event content in `module.settings.parentTeacherInterviewCalendar = { subject, bodyText }` through a new admin settings panel built with `ModuleEditPanel`.

**Rationale**:
- `ModuleEditPanel` and `MggsModuleService` already provide the repo's standard module settings path.
- A nested key avoids collisions with unrelated module settings and keeps create payload generation deterministic.
- Centralized settings ensure all created events use the same configured wording.

**Alternatives considered**:
- Hard-code subject/body in the page: rejected because it makes content changes require code deployment.
- Store subject/body in local component state only: rejected because content would not be centrally managed.
- Add new env vars: rejected because the content is module-specific operational data, not environment configuration.

## Decision: Match Enrolments for route restriction and keep create action admin-only

**Decision**: Gate the main page with the same `ModuleAccessWrapper` pattern used by `EnrolmentManagementPage`, and allow only module admins to trigger create from that page. Non-admin module users can still use staff selection and retrieval but see create as unavailable.

**Rationale**:
- The user explicitly requested the same restricted-access pattern as Enrolments.
- The API enforces module-user access for retrieval and module-admin access for create, so the UI should reflect that split directly.
- Keeping retrieval available to non-admin module users still preserves the backend's read access model.

**Alternatives considered**:
- Block the entire page for non-admins: rejected because it would be stricter than the backend's retrieval permission model.
- Show create to everyone and rely only on backend rejection: rejected because it creates unnecessary failed submissions and worse UX.

## Decision: Use browser-local timezone for UI entry and send offset-aware values to the API

**Decision**: Display and validate schedule datetimes in the browser's local timezone using the project's existing `moment`/`moment-timezone` pattern, and send ISO-like values with explicit local offsets to the API.

**Rationale**:
- The feature requires user-facing scheduling input, and the user explicitly chose browser local timezone behaviour.
- The backend parses provided datetime strings and normalizes them into its configured feature timezone, so explicit offsets keep the round-trip stable.
- This approach keeps validation and display consistent on the client while remaining compatible with the API.

**Alternatives considered**:
- Force all UI entry to the backend timezone: rejected because it is less intuitive for users and was not requested.
- Send naive local datetime strings without offsets: rejected because timezone interpretation becomes ambiguous.
