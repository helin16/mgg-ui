# Data Model: Clipboard Return To Play

## Clipboard Incident

**Purpose**: Represents a Clipboard incident returned by the API proxy and consumed by the
attendance concussion alert.

**Key fields**:

- `id`
- `location`
- `studentConcerned`
- `dateTime`
- `concussionStatus`
- `archived`
- `returnToPlay`
- legacy informational fields already used elsewhere (`Diagnosis`, `RestrictedEndDate`,
  `ReviewDate`, `Comments`, `IncidentDescription`, `staff`, `staffMember`) when present

**Relationships**:

- Belongs to zero or one `Student Concerned`
- Contains zero or one `Return-To-Play Restriction`

**Validation / rules**:

- The alert only considers incidents with a qualifying concussion status.
- The nested `returnToPlay` object is the source of truth for restriction filtering and
  reason text.
- Missing `returnToPlay` data must not crash consumers.

## Return-To-Play Restriction

**Purpose**: Captures the rule that determines whether the student should still be flagged
as unable to return to play.

**Key fields**:

- `date`
- `reason`

**Relationships**:

- Nested within one `Clipboard Incident`

**Validation / rules**:

- `date` is a UTC timestamp from Clipboard.
- The UI must interpret `date` as UTC before local comparison or formatting.
- A blank or invalid `date` must be treated safely without crashing the page.
- A blank `reason` falls back to a generic concussion label in the alert.

## Student Concerned

**Purpose**: Identifies the student attached to the incident so the alert can be tied to a
class attendance context.

**Key fields**:

- `id`
- `firstName`
- `legalFirstName`
- `lastName`
- `smsId`
- `sisId`

**Relationships**:

- Referenced by one or more `Clipboard Incident` records

**Validation / rules**:

- Either `smsId` or `sisId` may be used to match incidents against class membership,
  depending on what the proxy returns.
- If identifying details are incomplete, the alert must still render a safe fallback name.

## Clipboard Concussion Alert State

**Purpose**: Represents the local UI state used to load, filter, and render return-to-play
warnings for a class.

**Key fields**:

- `isLoading`
- `incidents[]`
- `currentMoment`
- derived active/inactive restriction status

**Relationships**:

- Loads data through `ClipboardIncidentService`
- Filters `Clipboard Incident` records against the class date

**Validation / rules**:

- While loading, the alert remains hidden.
- On API failure, the error is surfaced and the alert resets to no incidents.
- Only active restrictions remain after filtering.
- If no active restrictions remain, the alert is not rendered.
