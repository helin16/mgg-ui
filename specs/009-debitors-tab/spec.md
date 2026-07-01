# Feature Specification: Finance Debitors Tab

**Feature Branch**: `009-debitors-tab`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: User description: "$speckit-specify as per screenshot, we need a new component called `DebitorsListPanel` under a new tab `Debitors` to:
1. list all the active Debitor by 10 records per page
2. use `src/components/common/Table.tsx` and `hover, stripe and responsive` to display the debitors.
3. have a read of ../mggs-api, as the debitors might have spouse, we need to be able to search that as well.
4. filters: 4.1 a input text field to search surname, given1, preferred, email, phone or mobile phone 4.2 new Current Student Selector(asyc) allow user to select by the current student."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find active debtors quickly (Priority: P1)

As a Finance module user, I want a dedicated Debitors tab that lists active debtor records in manageable pages so I can review debtor contact details without leaving the Finance page.

**Why this priority**: The primary value is making debtor records accessible from the existing Finance workflow with predictable paging and consistent presentation.

**Independent Test**: Can be fully tested by opening the Finance page, selecting the Debitors tab, and confirming that active debtor records are shown in pages of 10 with the expected debtor details.

**Acceptance Scenarios**:

1. **Given** a Finance module user opens the Finance page, **When** they select the Debitors tab, **Then** the system shows the first page of active debtor records and limits the visible list to 10 records.
2. **Given** more than 10 active debtor records exist, **When** the user changes page, **Then** the system shows the next set of debtor records without losing the current filter state.
3. **Given** no active debtor records match the current filters, **When** the tab finishes loading, **Then** the system shows an empty-state message instead of an empty table.

---

### User Story 2 - Search debtors and spouse details (Priority: P2)

As a Finance module user, I want to search debtors by debtor and spouse contact/name fields so I can find the correct family record even when I only know one parent or contact detail.

**Why this priority**: Users explicitly need debtor search to account for spouse data exposed by the existing backend debtor dataset, which affects whether the tab is practically usable.

**Independent Test**: Can be fully tested by entering search text that matches debtor fields and spouse fields separately and confirming the correct debtor records are returned.

**Acceptance Scenarios**:

1. **Given** a Finance module user enters text matching a debtor surname, given name, preferred name, email, phone, or mobile number, **When** they run the search, **Then** matching active debtor records are returned.
2. **Given** a Finance module user enters text matching a spouse surname, given name, preferred name, or spouse phone/mobile detail, **When** they run the search, **Then** matching debtor records are returned.
3. **Given** the user clears the text search, **When** the search refreshes, **Then** the debtor list returns to the unfiltered active debtor result set.

---

### User Story 3 - Narrow debtors by current student (Priority: P3)

As a Finance module user, I want to filter the debtor list by a selected current student so I can isolate the debtor record connected to that student.

**Why this priority**: This adds a second search path for common finance lookups and reduces the need to know the debtor's contact name before finding the right account.

**Independent Test**: Can be fully tested by selecting a current student, verifying only linked debtor records are shown, and then clearing the student filter to restore the broader result set.

**Acceptance Scenarios**:

1. **Given** a Finance module user selects a current student in the Debitors tab filter, **When** the list refreshes, **Then** only active debtor records linked to that student are shown.
2. **Given** the selected student has no active linked debtor records, **When** the list refreshes, **Then** the system shows a no-results state that makes clear the student filter is active.
3. **Given** the user removes the current student filter, **When** the list refreshes, **Then** the result set returns to the active debtor records that match the remaining filters.

### Edge Cases

- What happens when a debtor matches both the debtor fields and spouse fields for the same search term.
- What happens when the selected current student is valid but linked debtor data is missing, inactive, or duplicated in the source data.
- What happens when the user changes filters while a prior debtor search request is still in flight.
- What happens when the debtor list request fails after the tab has already rendered.
- What happens when a page number becomes invalid because a filter change reduces the number of result pages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Finance page MUST include a new tab labelled `Debitors` within the existing Finance module experience.
- **FR-002**: The Debitors tab MUST show only active debtor records by default.
- **FR-003**: The Debitors tab MUST present debtor records in pages of 10 results.
- **FR-004**: Users MUST be able to move between result pages without leaving the Debitors tab.
- **FR-005**: The debtor list MUST provide a text search filter that supports matching active debtor records by debtor surname, debtor given name, debtor preferred name, debtor email, debtor phone, and debtor mobile phone.
- **FR-006**: The debtor list MUST also match the same search workflow against available spouse name and spouse phone/mobile fields exposed by the existing debtor dataset.
- **FR-007**: The debtor list MUST provide an asynchronous current student selector filter that narrows results to debtor records linked to the selected current student.
- **FR-008**: The system MUST allow the text filter and current student filter to be used together.
- **FR-009**: The affected module surface is the existing Finance page, and access to the Debitors tab MUST follow the same Finance module access-control rules already enforced for that page.
- **FR-010**: The specification requires service-layer support for retrieving paginated active debtor records with combined debtor/spouse text filtering and optional current-student filtering, reusing the existing debtor and current-student data contracts where possible.
- **FR-011**: The Debitors tab MUST define and display user-visible states for initial loading, filtered loading, successful results, empty results, invalid or cleared filters, and request failure.
- **FR-012**: The Debitors tab MUST preserve the user’s current filters when they move between result pages.
- **FR-013**: When filters change, the result set MUST refresh from the first page to avoid showing an out-of-range page.
- **FR-014**: The result presentation MUST remain consistent with the existing Finance page table-based workflows and must clearly distinguish each debtor row for scanning.
- **FR-015**: The feature MUST not introduce new environment-variable, upload, payment-processing, or sensitive-data storage requirements beyond the existing authenticated Finance module access and debtor data retrieval already used by the application.

### Key Entities *(include if feature involves data)*

- **Debitor Row**: An active debtor record displayed in the Finance tab, including debtor identity, linked student identifier, and contact details used for filtering and display.
- **Debitor Search Criteria**: The combination of free-text search input, selected current student, and current page used to retrieve a specific debtor result set.
- **Current Student Option**: A current student record that can be selected asynchronously to limit the debtor list to related debtor records.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Finance users can open the Debitors tab and see the first page of active debtor records within 5 seconds under normal operating conditions.
- **SC-002**: 100% of debtor result sets are limited to 10 visible records per page unless fewer than 10 matching records exist.
- **SC-003**: In user acceptance testing, finance staff can find a debtor record by either debtor details or spouse details on their first attempt in at least 90% of tested scenarios.
- **SC-004**: In user acceptance testing, finance staff can narrow the list by current student and identify the linked debtor record in under 30 seconds for standard lookups.

## Assumptions

- The requested user-facing labels `Debitors` and `DebitorsListPanel` remain in scope as provided, even though the existing data/service naming in the codebase uses `Debtor`.
- "Active debtor" uses the existing backend debtor status/data rules already relied on by the Finance module rather than introducing a new business definition in this feature.
- The current student filter can be satisfied using the existing current-student dataset and the debtor-to-student relationship already present in debtor records.
- The existing backend debtor dataset already includes the spouse name and spouse phone/mobile fields needed for search, based on the current `vDebtor` model in `../mggs-api`.
- Verification will rely on focused UI and service coverage plus manual validation in the Finance module because the feature depends on authenticated debtor data retrieval.
