# Data Model: Clone Email Template

## Source Template

**Purpose**: Represents the existing Synergetic email template selected from the list for
cloning.

**Key fields**:

- `CommunicationTemplatesSeq`
- `Name`
- `Description`
- `MessageType`
- `MessageSubject`
- `MessageBody`
- `Owner`
- `PrivateFlag`
- `DocumentClassification`
- `SenderEmail`
- `ProgramName`
- `emailTemplate` presence in list context

**Relationships**:

- Appears as one row in the Synergetic Email Template list
- May optionally have one active `New Style Template Record`
- Is the source for one `Template Clone Request`

**Validation / rules**:

- Must be a template already visible to the current user under existing module access
  rules.
- Must remain unchanged after the clone workflow succeeds or fails.

## Template Clone Request

**Purpose**: Represents the user-provided input used to create a cloned template.

**Key fields**:

- `sourceTemplateSeq`
- `newName`
- `useNewStyle`

**Relationships**:

- Targets one `Source Template`
- Produces one `Cloned Template` on success

**Validation / rules**:

- `newName` is required and must not be blank after trimming.
- `useNewStyle` is a required boolean captured by the modal checkbox.
- Only one request can be submitted per modal instance while saving is in progress.

## Cloned Template

**Purpose**: Represents the new communication template created from the source template's
content and metadata.

**Key fields**:

- new `CommunicationTemplatesSeq`
- `Name` from the clone request
- copied `Description`
- copied `MessageType`
- copied `MessageSubject`
- copied `MessageBody`
- copied ownership/classification/sender fields required by current template creation

**Relationships**:

- Derived from one `Source Template`
- May optionally link to one `New Style Template Record`
- Reappears in the refreshed template list after creation

**Validation / rules**:

- Must be persisted as a separate template identity from the source.
- Must preserve the source template content unless the clone request explicitly changes the
  name or style mode.
- Must be visible through the same list/reload flow used for other templates the user can
  access.

## New Style Template Record

**Purpose**: Represents the supporting email-template builder record that marks a cloned
template as `New Style`.

**Key fields**:

- `CommunicationTemplatesSeq`
- `templateObj`
- active state in list lookup context

**Relationships**:

- Belongs to one `Cloned Template`
- Determines whether the list shows the `New Style?` check for that template

**Validation / rules**:

- Created only when `useNewStyle` is selected in the clone request.
- Not required when `useNewStyle` is false.
- If created, it must reference the newly created template sequence, not the source
  template sequence.
- If the source template already has builder data, the cloned record receives a copied
  `templateObj`.
- If the source template has no builder data, the cloned record may start with empty or
  null `templateObj`; this feature does not derive builder data from HTML.

## Clone Modal State

**Purpose**: Represents transient UI state for the clone confirmation interaction.

**Key fields**:

- selected source template
- current name input value
- current `useNewStyle` checkbox value
- `isSaving`
- validation error visibility

**Relationships**:

- Drives one `Template Clone Request`
- On success, triggers list refresh and closes

**Validation / rules**:

- Opens from the `Clone` action only.
- Must prevent duplicate confirms while `isSaving` is true.
- Must remain open on failure so the user can retry or cancel.
