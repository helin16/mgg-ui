# Implementation Plan: Export Class Columns

**Branch**: `012-export-class-columns` | **Date**: 2026-08-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/012-export-class-columns/spec.md`

**Note**: This plan ends after Phase 1 design. Run `/speckit.tasks` to generate implementation tasks.

## Summary

Extend only the direct Student Absence export path in the sibling `mggs-api` service with optional `ClassCode` and `Class Description` columns. Preserve `vStudentAbsenceEvents` as the authoritative absence set, enrich export rows through a bounded `vAttendancesWithAbsences` lookup keyed by student, local date, and numeric period, blank both values for missing or ambiguous matches, and render direct exports in landscape orientation. Manual and scheduled email PDFs retain their existing rows and portrait layout.

## Technical Context

**Language/Version**: TypeScript 4.6 on Node.js 18+ in `../mggs-api`; React 18 JSX for PDF composition  
**Primary Dependencies**: Express 4, Sequelize 6 with Microsoft SQL Server, `@react-pdf/renderer` 3.1, Moment Timezone, existing Asset/Message and queue helpers  
**Storage**: Read-only Synergetic views (`vStudentAbsenceEvents`, `vAttendancesWithAbsences`, timetable/year-level lookups); existing local Asset and Message records only, with no schema changes  
**Testing**: Jest/ts-jest helper and controller suites in `../mggs-api/tests`, PDF render-prop assertions, and manual authenticated export/email attachment inspection  
**Target Platform**: Node.js API/worker service generating PDF files for the existing React SchoolBox module  
**Project Type**: Cross-repository web application change spanning the sibling backend service and the existing frontend list, with unchanged request payloads  
**Performance Goals**: Preserve one report-generation operation per user action or scheduled scope; add at most one bounded class-candidate query per source-row load and avoid per-row queries; normal export and enqueue flows remain within 10 seconds for existing report volumes  
**Constraints**: Keep source absence row count unchanged; match class data only for the same student/date/numeric period; blank both class fields unless exactly one distinct class pair remains; opt in only the direct export path; keep every email PDF, body, endpoint payload, filter, recipient, attachment name, and access behavior unchanged  
**Scale/Scope**: One shared class-association helper/query for direct export and the authorised live list, one conditional PDF row/layout contract, two on-screen columns, focused API/UI tests, and email regression tests

## Constitution Check

*GATE status before research: PASS.*

- **I. Module-Gated Delivery — PASS**: The affected surface remains SchoolBox `/student_inout/home`, guarded by the existing Student Absences module ID `7`. Export/email controllers retain app-token, user-token, and daily-summary access middleware; no route is added.
- **II. Typed Service Boundaries — PASS**: The UI continues to call the existing service methods without payload changes. Backend export-row types gain class fields behind an export-only rendering option; email row contracts remain unchanged.
- **III. Explicit Async UX States — PASS**: Existing UI loading/disabled controls, download success, queued-email toast, validation, empty report, access denial, and API failure behavior remain unchanged.
- **IV. School Data and Configuration Safety — PASS**: Class metadata is added only to already-authorised report attachments. No browser storage, new environment variable, upload, embed, token handling, HTML table, or wider recipient exposure is introduced.
- **V. Risk-Based Verification — PASS**: Automated tests cover export enrichment, ambiguous/missing matches, expanded export PDFs, and regression protection for unchanged manual/scheduled email PDFs; manual checks cover multi-page exports and unchanged email attachments.

## Project Structure

### Documentation (this feature)

```text
specs/012-export-class-columns/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── student-absence-report-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (cross-repository)

```text
# Frontend repository (contract remains unchanged)
src/
├── pages/studentAbsences/components/StudentAbsenceList.tsx
└── services/StudentAbsences/StudentAbsenceDailySummaryService.ts

# Sibling API repository (implementation target)
../mggs-api/
├── src/
│   ├── helper/StudentAbsence/
│   │   ├── StudentAbsenceDailySummaryHelper.ts
│   │   ├── StudentAbsenceDailySummaryPDFHelper.tsx
│   │   └── StudentAbsenceDailySummaryPDFPage.tsx
│   └── models/Synergetic/Attendance/
│       └── SynVAttendancesWithAbsence.ts
└── tests/
    ├── helper/StudentAbsence/
    │   └── StudentAbsenceDailySummaryHelper.test.ts
    └── controllers/StudentAbsence/
        ├── StudentAbsenceDailySummaryExportController.test.ts
        └── StudentAbsenceDailySummaryEmailController.test.ts
```

**Structure Decision**: Keep one API report pipeline and one PDF component. Direct export and the authorised live response opt into class enrichment; only direct export opts into the expanded landscape PDF. The existing UI request remains unchanged and displays the returned class values. Email callers retain their eight-column portrait output.

## Phase 0: Research

**Status**: COMPLETE. See [research.md](research.md).

Resolved decisions:

1. Preserve `vStudentAbsenceEvents` as the authoritative absence list so non-class events and report row counts do not change.
2. Load class candidates in one bounded query from the existing `vAttendancesWithAbsences` read model rather than issuing per-row lookups.
3. Associate candidates by student ID, Melbourne-local attendance date, and numeric absence/attendance period; non-numeric periods do not receive class values.
4. Collapse duplicate candidates with the same normalized class code/description, accept exactly one distinct pair, and blank both fields for zero or multiple distinct pairs.
5. Add optional class fields only when direct export requests enrichment; do not run candidate lookup for live or email paths.
6. Render direct export as ten-column A4 landscape; retain the existing eight-column A4 portrait PDF for every email attachment.

## Phase 1: Design and Contracts

### Data Model

See [data-model.md](data-model.md).

Key design objects:

- `AbsenceSourceRow`
- `AttendanceClassCandidate`
- `ClassAssociationKey`
- `ResolvedClassAssociation`
- `StudentAbsenceReportRow`

### Class Association Flow

1. Fetch the authoritative absence rows for the requested date range using the existing query and filters.
2. Collect unique student IDs and the bounded date range; if no source rows exist, skip the candidate query.
3. Fetch attendance candidates for those students and dates with only the identity/period/class fields needed by the association.
4. Normalize each source row and candidate to a `studentId|YYYY-MM-DD|numericPeriod` key in the configured Melbourne timezone.
5. Within a key, normalize and deduplicate identical `(classCode, classDescription)` pairs.
6. Attach the pair only when one distinct candidate remains. For zero candidates, multiple distinct candidates, non-numeric periods, `All Day`, `AM`, or `PM`, attach empty strings.
7. Build expanded printable rows only for direct export. Existing manual/nightly email callers build and render their current rows without class lookup or layout changes.

### Interfaces

See [contracts/student-absence-report-contract.md](contracts/student-absence-report-contract.md).

- HTTP endpoints and payloads remain backward compatible.
- Export-normalized rows gain optional `ClassCode`/`ClassDescription` values.
- Direct-export printable rows gain `classCode`/`classDescription` strings and the ten-column sequence.
- Email printable rows retain the current eight fields and portrait sequence.

### Planned Source Changes

**Sibling API modifications**:

- `StudentAbsenceDailySummaryHelper.ts`
  - Add export-only candidate loading, key normalization, duplicate collapse, ambiguity handling, and class fields in export rows.
  - Pass an explicit layout/column option only from `exportReport`; preserve all email calls and behavior.
- `StudentAbsenceDailySummaryPDFPage.tsx`
  - Support the expanded headers/cells and A4 landscape only when the export option is set; retain the existing email rendering by default.
- `StudentAbsenceDailySummaryPDFHelper.tsx`
  - No behavioral fork; retain the shared document wrapper and accept the extended row contract.
- Focused tests under `tests/helper/StudentAbsence/` and existing export/email controller suites as needed for unchanged endpoint behavior.

**Frontend changes**: None. Existing `StudentAbsenceDailySummaryService` calls already cause the API to generate and deliver the attachment.

### Verification Strategy

- Unit-test unique, duplicate-identical, ambiguous-distinct, missing, partial, and non-numeric class association cases.
- Assert the candidate query is skipped for zero source rows and is performed once for populated rows.
- Assert export row building maps class values and blanks consistently.
- Assert direct-export headers/cells and landscape props, including empty reports and long content.
- Exercise manual email, scheduled Head of Year, and scheduled tutor paths to prove their eight-column portrait assets are unchanged and skip class lookup.
- Retain controller authentication, authorization, date validation, and request-shaping coverage.
- Manually inspect a three-page long-content direct export and compare all three email attachment paths against their existing portrait format.

## Post-Design Constitution Check

*Gate status after design: PASS.*

- The existing module route, module ID `7`, and controller access middleware remain unchanged.
- Frontend request boundaries remain stable; the existing live response row gains printable class fields used by the authorised table.
- No async interaction or user-facing failure mode is added.
- Class data is exposed only in already-authorised attachments, with ambiguous data blanked rather than guessed.
- Automated export transformation/render tests, explicit email regressions, and documented manual checks cover the operational risk.

## Next Steps

Implementation coordinates the shared resolver in `../mggs-api` with the existing Student Absence table in this repository; no new route or request payload is required.

## Complexity Tracking

No constitution violations require justification.
