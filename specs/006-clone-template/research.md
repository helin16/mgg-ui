# Research: Clone Email Template

## Decision 1: Implement clone as a row action inside the existing template list

**Decision**: Add the new `Clone` action directly to the `operations` column in
`SynergeticEmailTemplateList` and manage the confirmation modal from the same component.

**Rationale**: The requested interaction is local to one list row, already sits beside
`Send` and `Archive`, and does not justify a broader routing or page-level workflow.

**Alternatives considered**:

- Add a separate clone page or edit route. Rejected because the user explicitly wants a
  popup flow from the current list.
- Reuse the existing edit panel instead of a dedicated clone confirmation. Rejected
  because the request requires a confirm-style popup with only the new name and `New
  Style` choice.

## Decision 2: Reuse existing template services instead of introducing a clone-specific API wrapper

**Decision**: Build the clone workflow from existing typed service operations:
read/copy the current `iSynCommunicationTemplate`, create a new communication template
through `SynCommunicationTemplateService.create`, and create an `EmailTemplateService`
record only when the user chooses `New Style`.

**Rationale**: The current code already supports creating classic templates and creating
new-style template records. The feature is a composition of those capabilities, not a
new backend surface.

**Alternatives considered**:

- Add a new `clone` service endpoint or wrapper. Rejected because the spec explicitly
  stays within current service boundaries and the existing create operations are adequate.
- Perform ad hoc API requests inside the component. Rejected because it would violate the
  service-layer constitution rule.

## Decision 3: Treat the `New Style` checkbox as the source of truth for the cloned record

**Decision**: Make the modal checkbox determine whether the cloned template receives an
active `EmailTemplateService` record, regardless of whether the source template already
has one.

**Rationale**: The requested behavior is explicit user choice at clone time. Tying the
clone to the source template's current mode would make the checkbox misleading.

**Alternatives considered**:

- Force the clone to match the source template's style mode. Rejected because it ignores
  the stated requirement to let the user decide in the popup.
- Allow style choice only when the source is already new-style. Rejected because it adds
  a hidden restriction not described in the request.

## Decision 4: Copy builder design only when the source already has builder data

**Decision**: When the user creates a `New Style` clone from a source template that
already has an active `EmailTemplateService` record, copy that source `templateObj` into
the cloned template's new `EmailTemplateService` record. When the source template does not
have builder data, still allow a `New Style` clone but create its builder record without
trying to derive `templateObj` from the source HTML.

**Rationale**: This preserves the user's expectation of cloning for existing new-style
templates while avoiding a risky HTML-to-builder conversion path that is outside the
current feature scope.

**Alternatives considered**:

- Always start `New Style` clones with blank builder data. Rejected because a new-style
  source should remain a true clone when the destination is also new-style.
- Convert HTML body into builder JSON for classic-to-new-style cloning. Rejected because
  the repo has no existing conversion flow and the feature request did not ask for one.

## Decision 5: Use explicit modal submission states for validation and duplicate protection

**Decision**: The clone modal will block confirmation when the name is blank, disable the
confirm button while the async clone is running, close on success, and surface failures
through the shared toaster flow while keeping the modal available for retry or cancel.

**Rationale**: This matches the repo constitution’s explicit async UX requirement and
reduces accidental duplicate creation during a multi-request clone operation.

**Alternatives considered**:

- Allow repeated confirm clicks and rely on backend duplicate handling. Rejected because
  the user experience would remain ambiguous and error-prone.
- Close the modal immediately on submit and rely on a later list refresh. Rejected because
  it would hide failures and make recovery unclear.

## Decision 6: Keep list refresh and action ordering unchanged except for the new button

**Decision**: Preserve the current row action layout and data reload behavior, inserting
only `Clone` between `Send` and `Archive` and reusing the current `count`-based refresh
pattern after a successful clone.

**Rationale**: The existing list already uses `count` increments to refresh after state
changing actions, and the user request is narrow.

**Alternatives considered**:

- Optimistically inject the cloned item into the list without reload. Rejected because it
  would introduce extra local state complexity and ordering risk.
- Reorder the existing actions while adding clone. Rejected because the request fixes the
  desired placement.

## Decision 7: Verify with targeted component tests plus manual module validation

**Decision**: Add focused Jest coverage around the template list clone workflow and record
manual validation for live module access, action ordering, and successful cloning with and
without `New Style`.

**Rationale**: The change is a contained UI workflow with shared service effects that is
well suited to component-level regression tests, while final confidence still benefits
from manual validation in the real module shell.

**Alternatives considered**:

- Service tests only. Rejected because the main risk is UI flow and action wiring.
- Cypress coverage in this change. Rejected because the existing surface has only light
  component coverage and this feature does not require a larger end-to-end harness to plan
  safely.
