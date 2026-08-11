# Contract: Student Absence Direct Export

## Compatibility

Existing endpoint requests and responses remain unchanged:

- `POST /studentAbsence/dailySummary/export`
- `POST /studentAbsence/dailySummary/email`
- Existing scheduled Head of Year and tutor worker requests remain out of scope and unchanged

No new filter, recipient, response, or feature-flag field is introduced. Authentication, authorization, validation, asset naming, email subject/body, and delivery logging remain unchanged.

The existing live-summary response rows add `classCode` and `classDescription` printable string fields. No request field or new endpoint is introduced. The authorised screen displays those values after `luForm` and before `Period`.

## Direct-Export Printable Row

```ts
type StudentAbsenceExportRow = {
  studentName: string;
  yearLevelLabel: string;
  formCode: string;
  classCode: string;
  classDescription: string;
  absenceDate: string;
  periodLabel: string;
  absenceType: string;
  absenceReason: string;
  absenceComment: string;
};
```

`classCode` and `classDescription` are always printable strings. Missing, non-applicable, or ambiguous values are represented as `""`, never `null`, placeholder text, concatenated candidates, or an arbitrary first match.

## PDF Contract

Directly exported Student Absence PDF assets use:

1. Student Name
2. Yr Lvl.
3. Form
4. ClassCode
5. Class Description
6. Absent Date
7. Period
8. Absence Type
9. Absence Reason
10. Absence Comment

Layout rules:

- A4 landscape pages.
- Fixed table header repeated on each page.
- Existing title, subtitle, filters footer, generation timestamp, and page numbering preserved.
- Zero-row reports show the same ten headers and the existing `No records found.` message.
- Values remain within their own columns and rows may grow vertically for wrapped text.

## Class Resolution Contract

For each absence source row:

1. Resolve a numeric period from the source event. `All Day`, `AM`, `PM`, blank, and other non-numeric values are not class-associated.
2. Find attendance candidates matching the same student ID, Melbourne-local date, and numeric period.
3. Normalize whitespace and deduplicate identical `(classCode, classDescription)` pairs.
4. If one distinct pair remains, use it.
5. Otherwise, set both values to blank.

The operation must preserve exactly one output row per input absence row.

## Email Compatibility

Manual Email Report, scheduled Head of Year, and scheduled tutor PDFs retain the existing eight-column portrait contract. They do not query or render class fields. Their subjects, bodies, recipients, filenames, filters, rows, orientation, empty-state output, and delivery logs remain unchanged.

## Error Contract

- Missing/ambiguous class data: render blank class cells and continue.
- Empty source set: render the existing empty report.
- Source, candidate-query, asset-render, or message-queue failure: use the existing failure behavior; do not return a partially generated report as successful.
- No class-resolution details are added to emailed PDFs, email bodies, public responses, or delivery logs.
