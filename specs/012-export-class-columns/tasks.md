# Tasks: Export Class Columns

**Input**: Design documents from `/specs/012-export-class-columns/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/student-absence-report-contract.md`, `quickstart.md`

**Implementation repository**: `../mggs-api`  
**Tests**: Required for class association, conditional PDF rendering, export behavior, and unchanged email PDF behavior.

**Organization**: Tasks are grouped by user story so the data-enrichment MVP and the layout enhancement can be implemented and verified as distinct increments.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes a different file or has no dependency on unfinished tasks
- **[Story]**: Maps the task to a user story in `spec.md`
- Every task includes an exact target path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm cross-repository scope and preserve the existing email baseline before implementation.

- [X] T001 Review implementation constraints and the active backend plan in `../mggs-api/AGENTS.md` and `../mggs-api/specs/005-auto-signout-study-hall/plan.md`
- [X] T002 Record the existing eight-column portrait email PDF baseline and current export/email helper call graph in `specs/012-export-class-columns/quickstart.md`
- [X] T003 [P] Confirm the existing attendance candidate fields and read-only model contract in `../mggs-api/src/models/Synergetic/Attendance/SynVAttendancesWithAbsence.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish typed, internal export-only options without changing public endpoints or default email rendering.

**⚠️ CRITICAL**: Complete this phase before either user story.

- [X] T004 Define typed source-row, class-candidate, resolved-association, export-row, and internal PDF option contracts in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts` and `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.tsx`
- [X] T005 Add a default-off internal export-layout/class-column option through the document wrapper in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryPDFHelper.tsx`
- [X] T006 Verify existing export and email HTTP payloads remain unchanged against `src/services/StudentAbsences/StudentAbsenceDailySummaryService.ts` and document the result in `specs/012-export-class-columns/contracts/student-absence-report-contract.md`

**Checkpoint**: The shared PDF path can distinguish direct export from email without changing its default email contract.

---

## Phase 3: User Story 1 - Export Absences with Class Details (Priority: P1) 🎯 MVP

**Goal**: Direct exports contain correct class code/description values or safe blanks, while every email path remains unchanged.

**Independent Test**: Export fixtures covering unique, duplicate-identical, ambiguous-distinct, missing, partial, and non-numeric matches produce one row per absence with correct values/blanks; manual and scheduled email fixtures perform no class lookup and retain their existing rows.

### Verification for User Story 1

- [X] T007 [P] [US1] Add failing class-association and bounded-query tests for unique, duplicate-identical, ambiguous-distinct, missing, partial, `All Day`, `AM`, and `PM` cases in `../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.test.ts`
- [X] T008 [P] [US1] Add export endpoint regression coverage for unchanged authentication, validation, request payload, response asset shape, filters, and row count in `../mggs-api/tests/controllers/StudentAbsence/StudentAbsenceDailySummaryExportController.test.ts`
- [X] T009 [P] [US1] Add manual email endpoint regression coverage proving no class option or payload field is introduced in `../mggs-api/tests/controllers/StudentAbsence/StudentAbsenceDailySummaryEmailController.test.ts`

### Implementation for User Story 1

- [X] T010 [US1] Implement one date-and-student-bounded `vAttendancesWithAbsences` candidate lookup with no per-row queries in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts`
- [X] T011 [US1] Implement Melbourne-local student/date/numeric-period keys, identical-pair deduplication, unique resolution, and blank ambiguous/non-applicable results in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts`
- [X] T012 [US1] Add export-only `ClassCode` and `ClassDescription` normalization and printable row mapping without filtering, duplicating, or reordering source rows in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts`
- [X] T013 [US1] Wire only `exportReport` to request class enrichment and the expanded PDF option while leaving `sendManualReport` and `runNightly` on the default path in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts`
- [X] T014 [US1] Extend helper regression coverage to prove zero-row exports skip the candidate query and manual, Head of Year, and tutor email generation skips enrichment in `../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.test.ts`
- [X] T015 [US1] Run the focused helper/export/email suites and record passing commands and results in `specs/012-export-class-columns/quickstart.md`

**Checkpoint**: Direct-export data is enriched safely and all email data paths remain behaviorally unchanged; this is the MVP even before final layout polish.

---

## Phase 4: User Story 2 - Preserve Usable Export Layout (Priority: P2)

**Goal**: Direct exports render ten aligned columns in A4 landscape with repeated headers and readable multi-page content, while email PDFs remain eight-column portrait documents.

**Independent Test**: Render populated, empty, long-content, and multi-page export fixtures and verify landscape orientation, ten headers/cells, wrapping, and repeated headings; render an email fixture and verify portrait orientation and the original eight headers.

### Verification for User Story 2

- [X] T016 [P] [US2] Create PDF component tests for export landscape orientation, ten-column order, values/blanks, empty state, and fixed headers in `../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.test.tsx`
- [X] T017 [P] [US2] Add PDF component regression tests for unchanged eight-column portrait email rendering in `../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.test.tsx`

### Implementation for User Story 2

- [X] T018 [US2] Add conditional `ClassCode` and `Class Description` headers/cells after Form and before Absent Date/Period in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.tsx`
- [X] T019 [US2] Apply A4 landscape orientation and rebalanced ten-column flex widths only for direct export while preserving default portrait styles for email PDFs in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.tsx`
- [X] T020 [US2] Verify empty export headings, long-row wrapping, repeated fixed headers, footer timestamps, and page numbering through component/render tests in `../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.test.tsx`
- [X] T021 [US2] Generate and manually inspect a three-page direct export plus manual, Head of Year, and tutor email PDFs, then record layout and regression evidence in `specs/012-export-class-columns/quickstart.md`

**Checkpoint**: Both stories are complete: direct exports are readable with class columns and all email PDFs retain their prior format.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Complete contract, build, performance, and verification evidence across the feature.

- [X] T022 [P] Synchronize final export-only behavior, class ambiguity rules, and email exclusions in `specs/012-export-class-columns/spec.md`, `specs/012-export-class-columns/plan.md`, and `specs/012-export-class-columns/contracts/student-absence-report-contract.md`
- [X] T023 Confirm one bounded candidate query, zero N+1 lookups, unchanged source row counts, and normal export completion within 10 seconds using instrumentation in `../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.test.ts`
- [X] T024 Run the full focused test list and TypeScript build from `specs/012-export-class-columns/quickstart.md` and record final results in that file
- [X] T025 Review the final diff for unchanged routes, access middleware, request/response payloads, email subjects/bodies/PDFs, attachment naming, filters, recipients, logs, environment variables, and storage in `specs/012-export-class-columns/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: No dependencies.
- **Phase 2 — Foundational**: Depends on Phase 1 and blocks both user stories.
- **Phase 3 — User Story 1**: Depends on Phase 2 and delivers the data-enrichment MVP.
- **Phase 4 — User Story 2**: Depends on Phase 2 contracts and integrates with US1's export rows; implement after US1 for the shortest validation path.
- **Phase 5 — Polish**: Depends on all selected user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundation; no dependency on US2.
- **US2 (P2)**: Its renderer tests can start after Foundation, but final export-value integration depends on US1's expanded export rows.

### Within Each User Story

- Write the focused failing tests before implementing the behavior they cover.
- Candidate loading precedes association resolution; resolution precedes export row mapping; mapping precedes export wiring.
- Conditional headers/cells precede final width and long-content validation.
- Automated and manual verification must pass before each story checkpoint.

### Parallel Opportunities

- T003 can run independently of T001–T002.
- T007, T008, and T009 modify separate test concerns/files and can run in parallel after Foundation.
- T016 and T017 can be authored together in the new PDF page test file, but should be assigned sequentially if multiple agents would edit that same file.
- T022 can run in parallel with final performance verification T023 because it changes documentation rather than backend tests.

---

## Parallel Example: User Story 1

```text
Task T007: Add class-association helper tests in ../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.test.ts
Task T008: Add export endpoint regression tests in ../mggs-api/tests/controllers/StudentAbsence/StudentAbsenceDailySummaryExportController.test.ts
Task T009: Add email endpoint exclusion tests in ../mggs-api/tests/controllers/StudentAbsence/StudentAbsenceDailySummaryEmailController.test.ts
```

## Parallel Example: User Story 2

```text
Task T016: Add export-mode PDF component tests in ../mggs-api/tests/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.test.tsx
Task T022: Synchronize feature documentation in specs/012-export-class-columns/
```

---

## Implementation Strategy

### MVP First — User Story 1

1. Complete Setup and Foundation.
2. Add class-association and endpoint regression tests.
3. Implement the bounded candidate lookup and safe resolver.
4. Wire the option only through direct export.
5. Stop and validate that export rows have correct class values and email paths are unchanged.

### Incremental Delivery

1. **Foundation**: Establish internal export-only contracts with default email compatibility.
2. **US1 MVP**: Deliver safe export data enrichment and email exclusion.
3. **US2**: Add landscape ten-column rendering and layout verification.
4. **Polish**: Run builds, complete manual checks, and record evidence.

### Parallel Team Strategy

1. One contributor establishes Foundation.
2. After Foundation, test work can split across helper, export controller, email controller, and PDF component files.
3. Keep implementation in `StudentAbsenceDailySummaryHelper.ts` sequential to avoid conflicting edits.
4. Integrate US1 before final US2 end-to-end PDF verification.

---

## Notes

## Screen Follow-up

- [X] T026 Add class values to authorised live-summary rows using the existing safe association rules in `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts`
- [X] T027 Add `ClassCode` and `Class Description` columns after `luForm` and before `Period` in `src/pages/studentAbsences/components/StudentAbsenceList.tsx`
- [X] T028 Update the paginated screen query order to date, year level, form, student, then numeric period and add regression coverage
- [X] T029 Run focused API/UI tests and production builds

- `[P]` means the task is safe to parallelize based on file/dependency boundaries.
- `[US1]` and `[US2]` map directly to the two prioritized user stories in `spec.md`.
- No frontend source implementation is planned.
- All backend writes occur in `../mggs-api`; the current command creates documentation only in this repository.
- Do not broaden scope to emailed PDFs, email bodies, live-report rows, new public flags, or database schema changes.
