# Feature Specification: Clipboard Return To Play

**Feature Branch**: `003-clipboard-return-to-play`  
**Created**: 2026-05-29  
**Status**: Draft  
**Input**: User description: "Read ../mggs-api and update Clipboard incident handling so the incident response returns nested returnToPlay data and the UI data structure and alert rendering follow that shape."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Show active return-to-play restrictions in class attendance (Priority: P1)

When a staff member opens the Clipboard attendance modify view for a class, they can see
which students still have an active concussion-related return-to-play restriction.

**Why this priority**: The alert exists to prevent students returning to activity too early.
If the restriction data is not interpreted correctly, staff can make the wrong decision in
an active class workflow.

**Independent Test**: Open a class attendance page for a class containing a student with a
confirmed concussion incident whose return-to-play date is today or in the future, and
confirm the alert appears with the student name and restriction wording.

**Acceptance Scenarios**:

1. **Given** a student in the selected class has a confirmed Clipboard incident with a
   return-to-play date on or after the class date, **When** the attendance modify view is
   opened, **Then** the concussion alert is shown for that student.
2. **Given** the alert is shown, **When** staff read it, **Then** it uses the incident's
   return-to-play reason when one is available.

---

### User Story 2 - Suppress expired return-to-play restrictions (Priority: P2)

When a return-to-play restriction has already expired, staff should not see an outdated
warning on the attendance page.

**Why this priority**: Stale alerts create noise and reduce trust in the restriction
workflow, even if the rest of the attendance page still functions.

**Independent Test**: Open a class attendance page for a class whose related incident has a
return-to-play date before the class date, and confirm no concussion alert is shown for
that incident.

**Acceptance Scenarios**:

1. **Given** a student has a confirmed Clipboard incident whose return-to-play date is
   before the class date, **When** the attendance modify view is opened, **Then** that
   incident does not produce a visible alert.
2. **Given** multiple qualifying incidents exist for students in the class, **When** the
   attendance modify view is opened, **Then** each active restriction is listed once and
   expired restrictions are omitted.

---

### User Story 3 - Tolerate incomplete return-to-play details without breaking the page (Priority: P3)

When incident data is incomplete, staff should still be able to use the attendance page and
see a sensible warning rather than losing the alert entirely or breaking the page.

**Why this priority**: Clipboard data is operational data and may not always be perfectly
complete. The page must fail safely.

**Independent Test**: Load an attendance page where a qualifying incident is missing a
return-to-play reason or has an empty return-to-play object, and confirm the page remains
usable and the warning degrades gracefully.

**Acceptance Scenarios**:

1. **Given** a qualifying incident has no return-to-play reason, **When** the alert is
   shown, **Then** the alert uses a generic concussion reason label instead of blank text.
2. **Given** the incident request fails or returns incomplete return-to-play details,
   **When** the attendance modify view is loaded, **Then** the page remains usable and the
   user receives the existing visible failure feedback for the incident request.

### Edge Cases

- The incident payload omits the `returnToPlay` object entirely for one or more incidents.
- The `returnToPlay.date` value is blank or invalid.
- The incident payload includes a reason but no usable date.
- The UTC return-to-play timestamp falls near a local day boundary in Australia/Melbourne.
- Multiple active concussion incidents exist for students in the same class.
- The user can open the attendance route but the incident lookup fails after the page has
  already rendered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat the affected surface as the embedded Clipboard
  concussion alert shown on the Clipboard attendance modify workflow.
- **FR-002**: The system MUST expose return-to-play details for Clipboard incidents as a
  single `returnToPlay` data object containing the restriction date and reason, rather than
  separate top-level return-to-play fields.
- **FR-003**: The system MUST return the nested `returnToPlay` structure consistently for
  both Clipboard incident list responses and single-incident responses used by the UI.
- **FR-004**: The system MUST update the shared Clipboard incident data contract used by the
  UI so consumers read return-to-play information from the nested object.
- **FR-005**: The concussion alert MUST determine whether a restriction is still active
  using the nested return-to-play date.
- **FR-006**: The system MUST treat `returnToPlay.date` as a UTC timestamp supplied by
  Clipboard and interpret it as UTC before local date comparison or display.
- **FR-007**: The concussion alert MUST display the nested return-to-play reason when one is
  supplied.
- **FR-008**: The concussion alert MUST fall back to a generic concussion label when the
  nested return-to-play reason is blank.
- **FR-009**: The system MUST show a concussion alert for confirmed incidents whose
  return-to-play date is today or in the future.
- **FR-010**: The system MUST omit concussion alerts for incidents whose return-to-play date
  is before the current class date.
- **FR-011**: The system MUST handle missing or invalid nested return-to-play data without
  crashing the attendance page or rendering broken alert text.
- **FR-012**: The system MUST preserve the current visible loading and failure behaviour of
  the incident lookup so staff are not shown stale alert content while the request is in
  flight and still receive error feedback if the request fails.
- **FR-013**: The system MUST continue to hide the alert entirely when no active qualifying
  incidents are returned for the class.
- **FR-014**: The feature MUST preserve the existing authentication and route access rules
  for both the Clipboard incident endpoint and the attendance page where the alert appears.
- **FR-015**: The feature MUST not introduce new environment-variable, storage, upload, or
  third-party embed requirements beyond the existing Clipboard integration.
- **FR-016**: The feature MUST continue exposing only the incident and student details
  already required for the restriction alert, without broadening sensitive data shown in the
  page.

### Key Entities *(include if feature involves data)*

- **Clipboard Incident**: An incident record associated with a student, including concussion
  status, incident timing, and return-to-play restriction details.
- **Return-To-Play Restriction**: The incident sub-record that carries the restriction date
  and optional reason used to decide whether a student should still be flagged.
- **Clipboard Concussion Alert**: The attendance-page warning shown when one or more
  students in the selected class have an active restriction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In manual validation, staff can open a qualifying class attendance page and
  identify active return-to-play restrictions within 10 seconds of the page settling.
- **SC-002**: In sampled test cases, 100% of confirmed incidents with a return-to-play date
  on or after the class date produce an alert, and 100% of confirmed incidents with an
  earlier return-to-play date do not.
- **SC-003**: In sampled test cases, attendance pages receiving incomplete return-to-play
  data continue to render without blocking attendance entry.
- **SC-004**: Support staff can verify that the same return-to-play date and reason shown in
  the alert are present in the Clipboard incident response used by the page.

## Assumptions

- The frontend and `../mggs-api` changes will be released together, so long-term support for
  both the old flat return-to-play fields and the new nested object is not required.
- Clipboard supplies `returnToPlay.date` in UTC, and the UI must convert from UTC before
  local date comparison or display.
- The alert remains on the existing Clipboard attendance modify workflow; this feature does
  not add new pages or move the alert to another surface.
- Existing incident selection, authentication, and error-reporting patterns remain in place
  and are reused for this contract change.
- Historic incidents that lack complete return-to-play details should fail safely by keeping
  the page usable and avoiding silent data loss.
