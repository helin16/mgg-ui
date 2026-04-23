# Data Model: BPay Batch Panel

## BPay Batch

**Purpose**: Represents the working batch that groups one or more creditor payment entries.

**Key fields**:

- `id`
- `totalAmount` / `totalAmt`
- `createdAt`
- `createdById`
- `updatedAt`
- `updatedById`
- `generatedAt`
- `generatedById`
- `Sections[]`

**Relationships**:

- Has many `BPay Batch Section`

**Validation / rules**:

- A batch is created only when no working batch exists for the add action.
- The panel must not create duplicate batches for the same working flow.

## BPay Batch Section

**Purpose**: Groups all batch items belonging to one creditor within a batch.

**Key fields**:

- `id`
- `batchId`
- `creditorId` or creditor-identifying relationship
- `customerName`
- `title`
- `date`
- `totalAmount` / `totalAmt`
- `itemCount`
- `Items[]`

**Relationships**:

- Belongs to one `BPay Batch`
- Has many `BPay Batch Section Item`

**Validation / rules**:

- A section is unique per creditor within a working batch.
- If a section for the selected creditor exists, it must be reused.
- If no section exists for the selected creditor, a new one is created inside the existing
  batch.

## BPay Batch Section Item

**Purpose**: Represents one creditor payment amount entered by the finance user.

**Key fields**:

- `id`
- `sectionId`
- `creditorId`
- `billerCode`
- `reference` or `reference1..3`
- `amount` / `amt`
- `payerBankBSB`
- `payerBankAcc`
- `comments`
- `dueDate`

**Relationships**:

- Belongs to one `BPay Batch Section`
- References one `Creditor`
- Uses one selected `Creditor BPay Record`

**Validation / rules**:

- Amount must be present and greater than zero.
- An item cannot be added until exactly one creditor BPay record is resolved.
- Duplicate submission must be blocked while creation is in progress.

## Creditor

**Purpose**: The payee selected by the finance user as the target for a batch entry.

**Key fields**:

- `CreditorID`
- `CreditorNameExternal`
- `CreditorNameInternal`
- `ActiveFlag`

**Relationships**:

- May have many `Creditor BPay Record` entries
- May be represented by one `BPay Batch Section` per working batch

**Validation / rules**:

- Only active creditors should be selectable in the batching panel.

## Creditor BPay Record

**Purpose**: A creditor-specific BPay payment configuration that the user must confirm
before adding a batch item.

**Key fields**:

- `Seq`
- `CreditorID`
- `BPayBillerCode` / `BillerCode`
- `BPayReference` / `ReferenceNum`
- `Notes` / `Comments`
- `IsActive`

**Relationships**:

- Belongs to one `Creditor`
- Selected into one `BPay Batch Section Item`

**Validation / rules**:

- If exactly one active record is returned, it is auto-selected.
- If more than one active record is returned, the user must select one.
- If no active record is returned, the add action must remain blocked and the user must see
  an explicit empty/error state.
