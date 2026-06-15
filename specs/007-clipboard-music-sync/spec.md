# Feature Specification: Clipboard Music Sync Management UI

**Feature Branch**: `007-clipboard-music-sync`  
**Created**: 2026-06-15  
**Status**: Draft  
**Input**: User description: "need a UI, similar to `Finance`, we need to be able to see the clipbard teams, clipboard session and be able to do Popup to manually trigger music sync."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View active clipboard teams and their sync status (Priority: P1)

Staff members open the Clipboard Music Sync management page and can see a list of all clipboard teams with their current synchronization status. This provides a dashboard view of which teams are configured and their music sync health.

**Why this priority**: This is the core visibility requirement that enables staff to monitor the Clipboard music sync operations across all teams. Without this, staff have no way to see what's configured.

**Independent Test**: Open the Clipboard Music Sync page and verify that a list of clipboard teams appears with status indicators showing sync state for each team.

**Acceptance Scenarios**:

1. **Given** the Clipboard Music Sync page is opened, **When** the page finishes loading, **Then** a list of clipboard teams is displayed with team names and current sync status.
2. **Given** multiple clipboard teams exist in the system, **When** the page loads, **Then** all teams are listed in a discoverable format (table, grid, or similar).
3. **Given** a team's music sync is up-to-date, **When** the team is shown in the list, **Then** the status indicator reflects a successful or current sync state.

---

### User Story 2 - View clipboard session details for each team (Priority: P1)

For each clipboard team, staff can view session information such as the current active session, last sync timestamp, and session metadata. This allows staff to understand the state of each team's clipboard session without diving into detailed logs.

**Why this priority**: Session information is critical to understanding why a sync might have failed or to verify that the current session is the intended one. This is equally important as the team list for operational awareness.

**Independent Test**: Select a clipboard team from the list and verify that session information is displayed, showing current session details and last sync timing.

**Acceptance Scenarios**:

1. **Given** a clipboard team is displayed in the list, **When** the team is selected or expanded, **Then** session information is shown (current session ID, creation/update time).
2. **Given** session information is displayed, **When** staff view it, **Then** the last successful music sync timestamp is visible.
3. **Given** no active session exists for a team, **When** the team is selected, **Then** a clear message indicates no active session rather than showing blank/null values.

---

### User Story 3 - Manually trigger music sync for a specific team via popup (Priority: P1)

Staff can click a button or action on a team row to open a confirmation popup that allows them to manually trigger a music sync operation for that specific clipboard team. This enables immediate sync without waiting for scheduled syncs.

**Why this priority**: Manual sync capability is the key differentiator and operational lever for this feature. Staff need this to resolve sync issues immediately and verify that the sync infrastructure is working.

**Independent Test**: Open the popup for music sync, confirm the action, and verify that the sync operation is initiated for the selected team.

**Acceptance Scenarios**:

1. **Given** a clipboard team is visible in the list, **When** staff click the "Sync" or equivalent action button for that team, **Then** a confirmation popup appears.
2. **Given** the sync confirmation popup is open, **When** staff confirm the action, **Then** the system initiates a music sync operation for that team.
3. **Given** a sync operation is initiated, **When** the operation completes, **Then** the team's status and last sync timestamp are updated in the list.
4. **Given** a sync operation is in progress, **When** staff attempt another sync, **Then** the UI prevents duplicate submissions (disables button or shows in-progress state).

---

### User Story 4 - Tabbed interface similar to Finance page (Priority: P2)

The Clipboard Music Sync management page uses a tabbed interface following the Finance page pattern, allowing future expansion with additional Clipboard-related management features (e.g., team administration, sync logs, settings).

**Why this priority**: Using the same UI pattern as Finance ensures consistency and familiarity for staff. This also creates a scalable architecture for adding more Clipboard features.

**Independent Test**: Render the page with tabs (Music Sync, and optionally placeholder tabs) and verify that the tab structure matches the Finance page pattern.

**Acceptance Scenarios**:

1. **Given** the Clipboard management page loads, **When** the page is rendered, **Then** a tab bar is displayed at the top with "Music Sync" as the active tab.
2. **Given** the tabbed interface is shown, **When** staff look at the design, **Then** it visually follows the same pattern as the Finance page (Tab component, title, layout).

---

### Edge Cases

- What happens when the Clipboard API fails to return the list of teams after the page has already rendered?
- How does the page behave if a staff member lacks the required module role to perform music sync operations?
- What happens if the clipboard teams list is empty (no teams configured)?
- How does the UI handle a sync operation that takes longer than expected (long-running async operation)?
- What happens if a sync operation fails mid-way — does the status update reflect the failure, and can staff retry?
- How does the page refresh/update team statuses if a sync is triggered from another browser tab or user?
- What happens if required environment variables or Clipboard API credentials are missing?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a page accessible via a new route under the Clipboard module with a tab-based interface following the Finance page pattern (using React Bootstrap Tabs and Tab components).
- **FR-002**: The system MUST retrieve and display a list of all configured clipboard teams from the Clipboard API or backend service.
- **FR-003**: For each clipboard team, the system MUST display the team name, current sync status, and session information (current session ID/identifier and last sync timestamp).
- **FR-004**: The system MUST provide a manual "Sync" action button for each clipboard team that opens a confirmation popup when clicked.
- **FR-005**: The confirmation popup MUST require staff to explicitly confirm the music sync action before initiating the operation.
- **FR-006**: When staff confirm the popup, the system MUST initiate a music sync operation via `POST /clipboard/syncMusic` endpoint (existing API endpoint in mggs-api).
- **FR-007**: The system MUST prevent duplicate sync submissions by disabling the sync button or showing an in-progress indicator while a sync operation is in flight.
- **FR-008**: After a music sync completes successfully, the system MUST update the team's status and last sync timestamp in the list.
- **FR-009**: If a music sync operation fails, the system MUST display an error message to staff and allow them to retry the operation.
- **FR-010**: The system MUST handle missing or incomplete team data from the Clipboard service gracefully (e.g., if session info is unavailable, show a placeholder or N/A).
- **FR-011**: The system MUST preserve the existing authentication and access control rules for the Clipboard module — only users with appropriate module permissions can access this page.
- **FR-012**: The system MUST define the route or URL for this feature and integrate it into the Clipboard module navigation (assuming a Clipboard module exists or needs to be created).
- **FR-013**: The system MUST use existing service-layer contracts in `src/services/Clipboard/*` (ClipboardTeamService, ClipboardSessionService) for fetching teams and sessions.
- **FR-014**: The system MUST create a new service ClipboardMusicSyncService in `src/services/Clipboard/*` to POST to `/clipboard/syncMusic` endpoint and track sync job status.
- **FR-015**: The system MUST use existing data types in `src/types/Clipboard/*` (iClipboardTeam, iClipboardSession) and create iClipboardSyncMessage for the Message response from music sync endpoint.
- **FR-016**: The system MUST define loading, success, empty, and error states for the teams list and sync operations.
- **FR-017**: No new environment variables are required beyond what already exists for the Clipboard API integration.

### Key Entities *(include if feature involves data)*

- **Clipboard Team**: A logical grouping representing a class or activity team in the Clipboard system. Attributes include `id`, `name`, `classCode`, `externalId`, `isHidden`, and relationship to Clipboard sessions.
- **Clipboard Session**: An active session associated with one or more clipboard teams. Attributes include `id`, `title`, `startDateTime`, `endDateTime`, `activity` (department and activity name), `teams[]`, `assignedStaff[]`, `cancelled`, and `scored` flags.
- **Music Sync Operation**: A message-queue job that synchronizes students to team rosters in the Clipboard system. Triggered via `POST /clipboard/syncMusic`. Returns a Message object with `id`, `type` (MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC), `status` (NEW|PROCESSING|SUCCESS|FAILED), `createdAt`, `updatedAt`, and optional response/error data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Staff can open the Clipboard Music Sync page and see a list of clipboard teams within 5 seconds of page load.
- **SC-002**: In a test scenario with 10+ clipboard teams, all teams are visible and accessible without pagination or scrolling issues.
- **SC-003**: Staff can manually trigger a music sync for a clipboard team and receive feedback (success or error) within 30 seconds.
- **SC-004**: 100% of successful music sync operations result in the team's status and last sync timestamp being updated in the UI within 5 seconds of operation completion.
- **SC-005**: Staff cannot accidentally trigger duplicate syncs — the sync button is disabled or clearly shows in-progress state during operation.
- **SC-006**: The page maintains accessibility and usability standards consistent with other pages in the mgg-ui application (e.g., responsive design, keyboard navigation).

## Assumptions

- **Module Navigation**: A Clipboard module exists or will be created to house this feature with appropriate route and navigation.
- **Existing Clipboard API**: ClipboardTeamService, ClipboardSessionService, and `POST /clipboard/syncMusic` endpoint are already implemented in mggs-api.
- **Authentication/Authorization**: Existing authentication system will be reused. The `/clipboard/syncMusic` endpoint validates module access via existing ModuleHelper.
- **UI Pattern**: The page follows Finance page structure with tabs, panels, and list components using React Bootstrap, styled-components, and existing common components.
- **Data Refresh**: Page shows data as of page load. Real-time sync updates from other browser tabs/users are not required in v1 (polling/WebSocket can be added later).
- **Sync Job Tracking**: Music sync jobs are tracked via Message model with status (NEW|PROCESSING|SUCCESS|FAILED) and timestamps. UI may need to poll for job completion or use returned Message object timestamps.
- **Error Handling**: If Clipboard API is unavailable, staff see error message but page remains usable.
- **Clipboard Music Sync**: The sync operation syncs students to team rosters within the Clipboard system itself. The API handles all sync logic internally.
- **Session Data Model**: Clipboard sessions include `title`, `startDateTime`, `endDateTime`, `activity`, `teams[]`, `assignedStaff[]`, `cancelled`, and `scored` fields per iClipboardSession interface.
