# Feature Specification: BPay Batch Panel

**Feature Branch**: `001-bpay-batch-panel`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "need to create Panel to under the "BPay Batching", then allow user to 1. select a creditor from a AutoComplete, 2. if there are more than BPayInfo under the selected creditor then display a table then allow the user to select from one o fthe BPayInfo. if there is only one, then the one gets selected. 3.allow user to input the amount and click on Add button then: if this one record is under the same creditor, then a new BPayBatctionSectionItem under an exisiting BPayBatchSection of the BPayBatch. if there are no BPayBatch yet, then a new BPayBatch will be created with a new BPayBatchSection."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a creditor payment entry (Priority: P1)

A finance user opens the BPay Batching area, finds a creditor, enters an amount, and
adds that payment entry into the current batch without needing to manually manage batch
or section records.

**Why this priority**: This is the core business outcome. Without it, the BPay Batching
tab remains informational only and cannot support batch creation work.

**Independent Test**: Open the BPay Batching area, choose a creditor with a single valid
BPay record, enter an amount, click Add, and confirm the payment entry is added to a
batch structure and shown back to the user.

**Acceptance Scenarios**:

1. **Given** no batch currently exists for the working session, **When** the user selects
   a creditor with one valid BPay record, enters a valid amount, and adds it, **Then**
   the system creates a new BPay batch, creates a new section for that creditor, and adds
   the payment entry to that new section.
2. **Given** an existing batch already contains a section for the selected creditor,
   **When** the user enters a valid amount and adds the payment entry, **Then** the
   system adds a new item under that existing creditor section instead of creating a
   duplicate section.

---

### User Story 2 - Resolve multiple BPay records for a creditor (Priority: P2)

A finance user can review and deliberately choose the correct BPay record when the
selected creditor has more than one available BPay setup.

**Why this priority**: Some creditors may have multiple BPay configurations. Selecting
the wrong one creates payment processing risk, so the user must be able to confirm the
correct record before adding the amount.

**Independent Test**: Select a creditor with multiple available BPay records and confirm
the system displays those options in a selectable table before allowing the payment entry
to be added.

**Acceptance Scenarios**:

1. **Given** the selected creditor has more than one BPay record, **When** the creditor
   is chosen, **Then** the system displays the available BPay records in a table and
   allows the user to select exactly one before adding the amount.
2. **Given** the selected creditor has exactly one BPay record, **When** the creditor is
   chosen, **Then** the system automatically selects that record and does not require an
   extra selection step.

---

### User Story 3 - Preserve batch grouping rules (Priority: P3)

A finance user can continue building a batch while the system groups entries into the
correct creditor section automatically.

**Why this priority**: Correct grouping is necessary for producing a usable BPay batch
output and for reducing manual reconciliation later.

**Independent Test**: Add entries for two different creditors in sequence and verify that
the first creditor reuses its existing section while the second creditor is placed into a
separate section within the working batch.

**Acceptance Scenarios**:

1. **Given** a batch already exists but does not yet contain a section for the selected
   creditor, **When** the user adds a valid payment entry for that creditor, **Then** the
   system creates a new section for that creditor within the existing batch and places the
   new entry inside it.
2. **Given** the user has already added one or more entries for a creditor, **When** the
   user adds another valid entry for the same creditor, **Then** the system keeps all of
   those entries under the same creditor section.

### Edge Cases

- What happens when the user can open Finance but lacks the required BPay batching access?
- What happens when the selected creditor has no active BPay records available?
- What happens when the user changes the creditor after an amount or BPay record selection
  has already been made?
- How does the system prevent the user from adding an amount before a valid creditor and
  BPay record have been resolved?
- What happens when the add action succeeds in creating a batch but fails while creating
  the section or item?
- How does the system handle zero, negative, or invalid amount input?
- How does the system behave if another user or process changes the working batch between
  selection and add?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a BPay batching panel within the existing BPay
  Batching area of Finance.
- **FR-002**: The system MUST allow the user to search for and select a creditor.
- **FR-003**: The system MUST load the available BPay records for the selected creditor.
- **FR-004**: The system MUST automatically select the BPay record when exactly one record
  is available for the selected creditor.
- **FR-005**: The system MUST display available BPay records in a selectable table when
  more than one record is available for the selected creditor.
- **FR-006**: The system MUST require the user to select exactly one BPay record before
  allowing an amount to be added when multiple BPay records are available.
- **FR-007**: The system MUST allow the user to enter a monetary amount for the new batch
  entry.
- **FR-008**: The system MUST reject blank, zero, negative, or otherwise invalid amount
  input and explain the problem to the user.
- **FR-009**: When no working BPay batch exists, the system MUST create a new batch,
  create a new section for the selected creditor, and add the new section item in one
  user action.
- **FR-010**: When a working BPay batch already contains a section for the selected
  creditor, the system MUST add the new entry to that existing section.
- **FR-011**: When a working BPay batch exists but does not contain a section for the
  selected creditor, the system MUST create a new creditor section inside that batch and
  place the new entry in it.
- **FR-012**: After a successful add action, the system MUST show the user the resulting
  batch state or a confirmation that clearly identifies what was added.
- **FR-013**: The system MUST prevent duplicate add submissions while the add action is in
  progress.
- **FR-014**: The system MUST preserve access-control rules for the Finance and BPay
  batching surface.
- **FR-015**: The system MUST handle unavailable creditor, BPay record, batch, or section
  data with user-visible failure messaging and no silent data loss.
- **FR-016**: Specification identifies the affected route or module surface as the Finance
  module's BPay Batching area and requires existing access-control behaviour to remain in
  force.
- **FR-017**: Specification requires updates to the shared service and type contracts for
  BPay batch, batch section, batch section item, creditor lookup, and creditor BPay
  record retrieval.
- **FR-018**: Specification defines loading, success, empty, validation, and error
  behaviour for creditor lookup, BPay record selection, and add actions.
- **FR-019**: Specification requires review of finance-data handling so the feature does
  not expose sensitive creditor payment details beyond the BPay batching workflow.

### Key Entities *(include if feature involves data)*

- **BPay Batch**: A working collection of BPay payment entries grouped for later export or
  processing.
- **BPay Batch Section**: A grouping inside a batch that represents a single creditor's
  entries.
- **BPay Batch Section Item**: An individual payment entry tied to one selected creditor
  BPay record and one amount.
- **Creditor**: The payee selected by the finance user as the target for the batch entry.
- **Creditor BPay Record**: A creditor-specific BPay setup containing the details the user
  must confirm before adding a payment item.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A finance user can add a valid BPay batch entry for a creditor with a single
  available BPay record in under 2 minutes without manual batch maintenance.
- **SC-002**: 100% of successful add actions place the new entry into the correct batch
  section based on the selected creditor.
- **SC-003**: When a creditor has multiple available BPay records, the user can identify
  and choose one record before adding the entry in a single uninterrupted workflow.
- **SC-004**: Invalid or incomplete input is prevented before submission and explained to
  the user in all tested validation scenarios.

## Assumptions

- Finance users already have access to the existing BPay Batching area through the current
  module permissions.
- The system can determine one current working batch context for this workflow; if none
  exists, the add action creates one.
- A creditor section is unique per creditor within a working batch.
- If a working batch exists and the selected creditor is not yet represented in it, the
  system creates a new section in that existing batch instead of creating a second batch.
- Creditor BPay records shown to the user are already filtered to records that are valid
  for batching use.
- High-risk verification will rely on manual validation of the batch-creation flow unless
  automated end-to-end coverage becomes practical in the same iteration.
