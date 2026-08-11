# Data Model: Export Class Columns

## AbsenceSourceRow

The authoritative source record retained from the existing absence-event report query.

| Field | Type | Rules |
|---|---|---|
| absenceEventId | number/string | Stable identity when available; enrichment must not change it |
| studentId | number/string | Required for class matching |
| absenceDate | date | Normalized to Melbourne-local calendar date |
| periodCode | string/null | May be numeric or a non-class label |
| periodNumber | number/null | Preferred numeric period identity |
| yearLevel | string/null | Existing report value |
| formCode | string/null | Existing report value |
| existing report fields | mixed | Student, type, reason, comment, campus; preserved unchanged |

## AttendanceClassCandidate

A read-only attendance row that may supply class information.

| Field | Type | Rules |
|---|---|---|
| studentId | number/string | Must equal the absence student |
| attendanceDate | date | Must normalize to the absence date |
| attendancePeriod | number | Must equal the numeric absence period |
| classCode | string/null | Trim whitespace; blank is allowed |
| classDescription | string/null | Trim whitespace; blank is allowed |

## ClassAssociationKey

Composite normalized identity used only during report generation.

`studentId | YYYY-MM-DD | numericPeriod`

Validation rules:

- All three values are required.
- Date normalization uses the configured Melbourne timezone.
- Non-numeric period values produce no key and therefore no class association.
- The key does not include form or year level because student/date/period identifies the attendance slot; those fields remain report filters and display data.

## ResolvedClassAssociation

| Field | Type | Rules |
|---|---|---|
| classCode | string | Trimmed; empty when unavailable or ambiguous |
| classDescription | string | Trimmed; empty when unavailable or ambiguous |
| status | `unique` \| `missing` \| `ambiguous` \| `not-applicable` | Internal diagnostic/test state; not exposed in the PDF or HTTP response |

Resolution rules:

1. Normalize candidate code and description.
2. Deduplicate candidates with the same normalized pair.
3. Exactly one distinct pair resolves to `unique`, even if one member of the pair is blank.
4. Zero pairs resolves to `missing` and two blank values.
5. More than one distinct pair resolves to `ambiguous` and two blank values.
6. A source row without a numeric period resolves to `not-applicable` and two blank values.

## StudentAbsenceExportRow

The expanded printable row used only by the direct Export action.

| Order | Field | Type | Source |
|---:|---|---|---|
| 1 | studentName | string | Existing absence normalization |
| 2 | yearLevelLabel | string | Existing absence normalization |
| 3 | formCode | string | Existing absence normalization |
| 4 | classCode | string | Resolved class association |
| 5 | classDescription | string | Resolved class association |
| 6 | absenceDate | string | Existing formatted date |
| 7 | periodLabel | string | Existing timetable-resolved label |
| 8 | absenceType | string | Existing absence normalization |
| 9 | absenceReason | string | Existing absence normalization |
| 10 | absenceComment | string | Existing absence normalization |

## Relationships and Invariants

- One source absence produces exactly one printable row.
- Zero or many candidate rows may be examined for one absence, but at most one resolved class pair is attached.
- Enrichment never creates, removes, filters, or reorders source rows.
- Direct export consumes the expanded ten-column row; all email paths retain their existing eight-column printable row.
- Empty reports contain zero rows but use the same ten-column header contract.

## Processing State

Direct export: `source loaded` → `candidates loaded` → `associations resolved` → `export rows built` → `expanded PDF rendered` → `downloaded`

Email: existing source → existing eight-column rows → existing PDF layout → queued, with no class enrichment.

Failure behavior remains unchanged: a source/query/render failure rejects report generation through the existing controller or worker path; missing or ambiguous optional class data does not fail generation.
