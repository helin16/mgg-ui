# Contract: Synergetic Email Template Clone Flow

## Affected Surfaces

- UI surface: `SynergeticEmailTemplateList` in the `Email Templates` tab
- Route/module surface: `SynergeticEmailTemplateManagerPage` under
  `MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE`
- Service surfaces: `SynCommunicationTemplateService` and `EmailTemplateService`

## Row Action Contract

- Each visible template row continues to show `Send` and `Archive`.
- After this change, each row must show `Clone` between `Send` and `Archive`.
- Selecting `Clone` must not trigger the `Send` or `Archive` flow.

## Clone Modal Contract

When the user selects `Clone` for a row:

- A confirmation modal opens for the selected source template.
- The modal must include:
  - a required input for the new template name
  - a checkbox for whether the clone should be `New Style`
  - confirm and cancel controls

### Validation Rules

- Confirm is blocked when the name is empty or whitespace-only.
- While clone submission is in progress, duplicate confirmation is blocked.

## Clone Outcome Contract

### Successful clone

- The system creates a new communication template record derived from the source template.
- The new record uses the name entered in the modal.
- The source template remains unchanged.
- If `New Style` is selected, the cloned template is also represented in the email
  template builder data so the list shows it as `New Style`.
- If `New Style` is selected and the source template already has builder data, the cloned
  template's builder record must contain a copied `templateObj`.
- If `New Style` is selected and the source template does not have builder data, the clone
  still succeeds as a `New Style` template without requiring HTML-to-builder conversion.
- The modal closes after success.
- The list refreshes so the new record can be discovered in the current view.
- The user receives a success indication.

### Failed clone

- No changes are applied to the source template.
- Partial clone state must not be presented as a successful result.
- The user receives an error indication through the shared error path.
- The modal remains available so the user can retry or cancel.

## Service Boundary Contract

- The feature must use existing typed service wrappers only.
- No new environment variables or browser storage are introduced.
- No new public backend contract is required for planning; the clone flow is composed from
  existing create/read template operations.

## Manual Verification Contract

- Confirm the row action order is `Send`, `Clone`, `Archive`.
- Confirm a standard clone creates a distinct template with the requested name.
- Confirm a `New Style` clone shows the `New Style?` indicator in the list.
- Confirm a `New Style` clone from an existing new-style template preserves the source
  builder design.
- Confirm blank-name validation and duplicate-submit protection behave correctly.
