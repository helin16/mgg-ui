# Quickstart: Export Class Columns

## Scope

Implementation spans the sibling `../mggs-api` repository and the Student Absence list in this UI repository. UI request payloads remain unchanged.

## Read Before Implementation

- `specs/012-export-class-columns/spec.md`
- `specs/012-export-class-columns/plan.md`
- `specs/012-export-class-columns/research.md`
- `specs/012-export-class-columns/data-model.md`
- `specs/012-export-class-columns/contracts/student-absence-report-contract.md`
- `../mggs-api/AGENTS.md`

## Expected Change Areas

- `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.ts`
- `../mggs-api/src/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.tsx`
- Relevant tests under `../mggs-api/tests/helper/StudentAbsence/` and `../mggs-api/tests/controllers/StudentAbsence/`

Do not change frontend request payloads or any email subject, body, PDF attachment, recipient, attachment name, filter, or access middleware. The live response and table rows include the two class values.

## Baseline and Call Graph

- The pre-change email PDF is A4 portrait with eight columns: Student Name, Yr Lvl., Form, Absent Date, Period, Absence Type, Absence Reason, and Absence Comment.
- Direct export calls `exportReport` → `getSourceRows` → `genPDFAsset`.
- Manual email calls `sendManualReport` → `getSourceRows` → `genPDFAsset` → the existing mail helper.
- Scheduled Head of Year and tutor email calls `runNightly` → `getSourceRows` → `genPDFAsset` → the existing mail helper.
- The class-enrichment and expanded-layout flags default off and are enabled only by `exportReport`; no HTTP payload or public option was added.

## Focused Verification

From `../mggs-api`:

```bash
npm test -- --runInBand tests/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.test.ts
npm test -- --runInBand tests/controllers/StudentAbsence/StudentAbsenceDailySummaryExportController.test.ts
npm test -- --runInBand tests/controllers/StudentAbsence/StudentAbsenceDailySummaryEmailController.test.ts
npm run build
```

Add or include PDF-page coverage that verifies:

- `ClassCode` and `Class Description` headers and cells;
- A4 landscape orientation;
- repeated headers and zero-row output;
- unique, duplicate-identical, ambiguous-distinct, missing, partial, `All Day`, `AM`, and `PM` cases;
- one bounded candidate lookup rather than per-row queries.

## Manual Verification

Use an authenticated non-production environment with representative Student Absence data:

1. Export a report containing a uniquely matched class, a non-class event, and an ambiguous candidate case.
2. Confirm the two columns appear after Form and before Period, with unique values or blanks as specified.
3. Send the same filters through manual Email Report and confirm its attachment retains the existing eight-column portrait output without class fields.
4. Exercise manual, Head of Year, and tutor email paths and confirm their PDFs remain on the existing eight-column portrait contract without class fields.
5. Confirm subjects, email bodies, recipients, filenames, filters, and delivery logs are unchanged.
6. Generate at least three pages with long descriptions/comments and inspect alignment, wrapping, repeated headers, and page footers.
7. Generate a zero-row report and confirm all ten headers plus `No records found.`

Record commands, test results, sample scopes, and visual inspection evidence in the implementation handoff.

## Implementation Verification — 10 August 2026

From `../mggs-api`, with local Sentry bootstrap disabled for deterministic controller tests:

```bash
env SENTRY_DSN= npm test -- --runInBand \
  tests/helper/StudentAbsence/StudentAbsenceDailySummaryHelper.test.ts \
  tests/helper/StudentAbsence/StudentAbsenceDailySummaryMailHelper.test.ts \
  tests/helper/StudentAbsence/StudentAbsenceDailySummaryPDFPage.test.tsx \
  tests/workers/StudentAbsenceDailySummaryWorker.test.ts \
  tests/controllers/StudentAbsence/StudentAbsenceDailySummaryLiveController.test.ts \
  tests/controllers/StudentAbsence/StudentAbsenceDailySummaryExportController.test.ts \
  tests/controllers/StudentAbsence/StudentAbsenceDailySummaryController.test.ts \
  tests/controllers/StudentAbsence/StudentAbsenceDailySummaryEmailController.test.ts
npm run build
```

Result: 8 suites passed, 50 tests passed, and `tsc` completed successfully.

Automated evidence covers one bounded candidate query, no lookup for empty exports or email generation, unchanged row counts/order, unique and duplicate-identical matches, ambiguous-distinct blanks, partial values, and blank `All Day`/`AM`/`PM` values. Controller coverage confirms unchanged export and email endpoint contracts.

Local render QA used 110 representative long rows and completed within the 10-second target. The direct export produced nine A4 landscape pages with ten ordered columns, readable wrapping, atomic rows, aligned cells, page numbering, and timestamps. Blank class values remained blank. A corresponding eight-page email sample remained A4 portrait with the original eight columns. The same default renderer is exercised for manual, Head of Year, and tutor email paths, with automated assertions proving class enrichment stays disabled.

Final diff review found no changes to routes, middleware, service payloads, email subjects/bodies, attachment naming, recipients, filters, logs, environment variables, or storage behavior. Authenticated non-production delivery remains recommended as release UAT because local verification does not send real email.

Screen follow-up verification: the live API now resolves class values under the same unique-match rules, and the UI displays `ClassCode` and `Class Description` after `luForm` and before `Period`. The paginated source request sorts by date, year level, form, student, and numeric period. API live/helper tests and builds pass; the focused UI suite passes 16 tests and the production UI build succeeds.

Date-query correction — 11 August 2026: the attendance candidate lookup now uses a parameterized raw query with `CONVERT(date, AttendanceDate)` rather than Sequelize timestamp conversion. Four affected API suites pass (35 tests), `tsc` passes, and a read-only Synergetic verification for 10 August Year 11 populated all 18 numeric/Tutor Group rows with their expected class values.

Event-time ordering follow-up: `AbsenceEventDateTime ASC` is the final tie-breaker after date, year level, form, student, and period in both the screen query and backend comparator. This keeps an earlier Sign In event before a later Sign Out event for the same student/date/period. API ordering/controller coverage passes 26 tests; the UI list suite passes 16 tests; both production builds pass.

Count-as-absent follow-up: a `YES` / `NO` / `ALL` button group defaults to `ALL`, persists non-default values in the URL, and filters the live on-screen results by `AbsenceEventAbsenceTypeCountAsAbsenceFlag`. The focused UI suite passes 17 tests; API helper coverage includes explicit YES/NO cases; API and UI builds pass.

PDF count-as-absent behavior: direct exports follow the user's on-screen `YES` / `NO` / `ALL` selection. Manual and scheduled Head of Year/tutor email PDFs enforce `Count as Absent: YES` in the backend. Five affected API suites pass (37 tests) and `tsc` passes.

Expanded cross-project regression coverage: API helper/controller/worker suites verify live/export forwarding and email-PDF YES enforcement (5 suites, 42 tests). UI component and new service-boundary suites verify button behavior, loop prevention, live/export propagation, and email omission (2 suites, 19 tests). Both builds pass.
