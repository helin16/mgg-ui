# Research: Export Class Columns

## Decision 1: Keep absence events as the authoritative row set

**Decision**: Continue loading report rows from `vStudentAbsenceEvents` and enrich those rows with optional class data.

**Rationale**: The existing source includes all reportable absence types, including all-day and non-class events. Replacing it with an attendance view could remove legitimate records or change row counts, violating the specification.

**Alternatives considered**:

- Replace the source with `vAttendancesWithAbsences`: rejected because attendance-based rows are not guaranteed to represent every absence event and can contain multiple class candidates.
- Join directly in the existing absence SQL: deferred because the repository does not establish a unique one-to-one database relationship and a join could duplicate report rows.

## Decision 2: Enrich with one bounded attendance-candidate query

**Decision**: Query `vAttendancesWithAbsences` once per source load, bounded by report dates and the source student IDs, selecting student ID, attendance date, numeric attendance period, class code, and class description.

**Rationale**: The existing read model already exposes the required class fields. One bounded query avoids N+1 behavior and permits explicit ambiguity handling before report rows are built.

**Alternatives considered**:

- One query per absence row: rejected for avoidable latency and load.
- Query all attendance rows for the date range without student bounds: rejected because it reads unnecessary student data.
- Add a new database view or migration: rejected because existing read models are sufficient and no storage change is needed.

## Decision 3: Match by student, local date, and numeric period

**Decision**: Use a normalized key of `StudentID`, Melbourne-local `YYYY-MM-DD`, and numeric period. Only numeric period events are eligible for class enrichment.

**Rationale**: Attendance classes are period-specific. Student and date alone can match several classes, while `All Day`, `AM`, and `PM` do not reliably identify one class.

**Alternatives considered**:

- Student and date only: rejected because it is ambiguous on ordinary multi-period days.
- Display period text: rejected because labels can be mapped or localized and are less stable than the numeric period identity.
- Student timetable membership without attendance date: rejected because it can include several classes and does not prove the absence's applicable period.

## Decision 4: Blank ambiguous matches

**Decision**: Normalize and deduplicate identical class pairs. Use the pair only when exactly one distinct pair remains; otherwise return blank class code and description.

**Rationale**: This implements the user's clarification and prevents an arbitrary class from being reported. Duplicate rows representing the same class should not create a false ambiguity.

**Alternatives considered**:

- Choose the first candidate: rejected because ordering is not evidence of correctness.
- Concatenate all candidates: rejected because the report requests one class association and combined data could be misleading.
- Fail the whole report: rejected because optional class context should not make an otherwise valid absence report unavailable.

## Decision 5: Add an export-only option to the shared report pipeline

**Decision**: Add class enrichment and expanded printable fields behind an explicit option passed only by direct export. Keep existing email callers on the default eight-column path. Do not change HTTP payloads, email content, or frontend services.

**Rationale**: Direct export and emails share an asset generator, but the revised scope requires email PDFs to remain unchanged. One conditional renderer avoids a duplicated template while providing a strict compatibility default.

**Alternatives considered**:

- Separate templates for export and email: rejected because it duplicates existing title/footer/table behavior.
- Change every shared PDF: rejected by the revised export-only scope.
- Add a public request flag: rejected because the API action itself determines the output; the option remains internal.

## Decision 6: Use A4 landscape for the expanded table

**Decision**: Render direct exports as A4 landscape with ten columns; preserve A4 portrait and existing widths for all email attachments.

**Rationale**: Two additional export columns make portrait too narrow, while changing email orientation would violate the revised scope.

**Alternatives considered**:

- Keep portrait and reduce font size: rejected because it harms readability and long descriptions.
- Remove or abbreviate existing columns: rejected because all existing fields must remain.
- Use separate detail rows: rejected because it complicates scanning and breaks column parity.
