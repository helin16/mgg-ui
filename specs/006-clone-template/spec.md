# Feature Specification: Clone Email Template

**Feature Branch**: `006-clone-template`  
**Created**: 2026-06-09  
**Status**: Draft  
**Input**: User description: "as per screenshot, we need a popup confirm btn after the Send btn and before the Archive btn. It's called clone, which will clone the current template into a new template. In the PopupModal, we need the user to provide the new name, and checkbox for whether it's a new Style."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clone a template from the list (Priority: P1)

A template manager can clone an existing email template directly from the template list by using a new `Clone` action placed between `Send` and `Archive`.

**Why this priority**: Cloning an existing template is the primary workflow requested and removes the need to rebuild a similar template manually.

**Independent Test**: Can be fully tested by opening the template list, cloning one existing template with a new name, and confirming the cloned template appears as a separate editable record while the source template remains unchanged.

**Acceptance Scenarios**:

1. **Given** a user can access the Synergetic Email Template management screen and a template row is visible, **When** the user clicks `Clone`, **Then** the screen opens a confirmation modal for that specific template.
2. **Given** the clone modal is open, **When** the user enters a valid new template name and confirms, **Then** the system creates a new template record based on the selected source template and keeps the original template unchanged.
3. **Given** the clone succeeds, **When** the operation completes, **Then** the user sees a success confirmation and the cloned template is visible in the current template list with the new name.

---

### User Story 2 - Choose whether the clone uses new style (Priority: P2)

A template manager can decide during cloning whether the new template should be created as a `New Style` template.

**Why this priority**: The request explicitly requires the user to control style mode at clone time, which affects how the cloned template is managed afterward.

**Independent Test**: Can be tested by cloning one template with the `New Style` checkbox selected and one without it selected, then verifying each clone reflects the chosen style state in the list.

**Acceptance Scenarios**:

1. **Given** the clone modal is open, **When** the user selects the `New Style` checkbox before confirming, **Then** the cloned template is created with `New Style` enabled.
2. **Given** the clone modal is open, **When** the user leaves the `New Style` checkbox unselected before confirming, **Then** the cloned template is created without `New Style` enabled.

---

### User Story 3 - Prevent accidental or invalid cloning (Priority: P3)

A template manager gets clear validation and confirmation behavior so cloning cannot create unnamed templates or duplicate requests caused by repeated clicks.

**Why this priority**: This protects data quality and avoids accidental duplicate template creation during an async save.

**Independent Test**: Can be tested by attempting to confirm the modal with no name, with whitespace-only input, and by clicking confirm repeatedly during an in-progress clone.

**Acceptance Scenarios**:

1. **Given** the clone modal is open, **When** the user has not provided a valid name, **Then** the confirm action is blocked and the user is shown a validation message.
2. **Given** a clone request is already in progress, **When** the user attempts to confirm again, **Then** the system prevents duplicate submissions until the first request resolves.

### Edge Cases

- The source template is archived, deleted, or otherwise unavailable by the time the user confirms the clone.
- The requested clone name matches an existing template name or violates existing template naming rules.
- The user chooses a `New Style` setting that differs from the source template's current style mode.
- The list is filtered or paginated such that the cloned record would not naturally remain visible after refresh.
- The user can reach the route but lacks the required module role to manage templates.
- The clone request fails after the modal opens or after the list has already rendered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add a `Clone` action to each row in the Synergetic Email Template management list, positioned after `Send` and before `Archive`.
- **FR-002**: The system MUST open a confirmation modal when the user selects `Clone` for a template.
- **FR-003**: The clone modal MUST display an input for the new template name and a checkbox for whether the clone should be created as `New Style`.
- **FR-004**: The system MUST require a non-empty template name before allowing the clone to be confirmed.
- **FR-005**: When the user confirms cloning, the system MUST create a new template based on the selected source template and preserve the source template unchanged.
- **FR-006**: The cloned template MUST be created as a separate record with its own identity and the user-provided name.
- **FR-007**: The cloned template's `New Style` state MUST reflect the checkbox value chosen in the modal, regardless of the source template's current style state.
- **FR-007a**: If the source template already has `New Style` builder data and the clone is created as `New Style`, the cloned template MUST receive a copied builder design so it remains an actual clone of the source.
- **FR-007b**: If the source template does not already have `New Style` builder data and the clone is created as `New Style`, the cloned template MUST still copy the source communication-template content, but its `New Style` builder data may start empty.
- **FR-008**: After a successful clone, the system MUST show a success outcome and refresh the visible template list so the user can find the newly created template.
- **FR-009**: The system MUST preserve existing access-control behavior for the Synergetic Email Template management surface; only users who can already manage templates may clone them.
- **FR-010**: The feature MUST reuse the existing template management service boundaries for reading the source template and creating the cloned template, with no new environment variables, storage locations, uploads, embeds, or sensitive-data exposure introduced by this feature.
- **FR-011**: The clone interaction MUST define loading, success, validation, and error behavior for the modal submission, including preventing duplicate confirmations while the clone request is in progress.
- **FR-012**: If cloning fails, the system MUST leave the source template unchanged, keep the user informed of the failure, and allow the user to retry or cancel from the modal.
- **FR-013**: Existing `Send` and `Archive` actions MUST continue to behave the same after the `Clone` action is introduced.

### Key Entities *(include if feature involves data)*

- **Template Clone Request**: The user-submitted clone instruction containing the source template, the new template name, and the selected `New Style` state.
- **Cloned Template**: A newly created template record derived from an existing template's content but stored as its own independent template entry.
- **New Style Builder Record**: Optional builder data associated with a cloned template when the clone is marked as `New Style`, including copied builder design when the source already has one.
- **Template List Row Action Set**: The row-level actions available for a template in the Synergetic Email Template management list, including `Send`, `Clone`, and `Archive`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A template manager can complete a clone request from the template list in under 1 minute without leaving the current screen.
- **SC-002**: 100% of successful clone operations create a separate template entry with the user-provided name while leaving the source template unchanged.
- **SC-003**: 100% of completed clone operations reflect the `New Style` choice selected in the modal.
- **SC-004**: During UAT, users can complete the primary clone workflow on the first attempt without needing to recreate the template manually.

## Assumptions

- The affected module surface is the existing Synergetic Email Template management screen that already shows row actions for `Send` and `Archive`.
- Users who can currently manage templates on that screen are the same users who should be allowed to clone templates.
- Existing template creation capabilities are sufficient to persist a clone without introducing a new externally visible configuration surface.
- The newly cloned template should remain editable through the same template edit flow used for other templates.
- When a source template has no existing builder design, creating a `New Style` clone does not require generating builder JSON from HTML during this feature.
- If the requested clone name conflicts with an existing validation rule, the system will reuse the current template-validation behavior rather than inventing a new naming policy for this feature.
