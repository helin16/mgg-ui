# Route & UI Contract: Clipboard Music Sync Management

**Feature**: [Clipboard Music Sync Management UI](../spec.md) | **Data Model**: [data-model.md](../data-model.md)  
**Date**: 2026-06-15

## Route Definition

### Primary Route

**Path**: `/modules/remote/:code/clipboard/music-sync`

**Alternative Paths** (if Clipboard module has its own routing):
- `/clipboard/music-sync`
- `/management/clipboard/music-sync`

**Parameters**:
- `:code` (from SchoolBoxRouter) — remote module code from URL

**Access Control**:
- Required module: `MGGS_MODULE_ID_CLIP_BOARD` (constant in `src/types/modules/iModuleUser`)
- Required role: Any user with Clipboard module access (admin roles may have additional sync permissions)
- Wrapper: `ModuleAccessWrapper` or equivalent module auth guard

**Query Parameters** (optional, for future expansion):
- `?team=<teamId>` — Pre-select a specific team on load
- `?tab=<tabName>` — Pre-select tab (e.g., "music-sync", "logs", "settings")

---

## Page Structure & UX Contract

### Layout (Finance Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│  Page Title: "Clipboard Management"                         │
│  ─────────────────────────────────────────────────────────── │
│  [ Music Sync ] [ Logs (future) ] [ Settings (future) ]     │
│  ═════════════════════════════════════════════════════════════
│                                                              │
│  Teams List Panel                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Team Name      │ Session         │ Last Sync  │ Sync │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Year 10 PE A   │ Team Practice   │ 2h ago    │ [Sync]│  │
│  │  └ Details...  │ Start: 3:00 PM  │           │       │  │
│  │  └ 5 students  │ End: 4:30 PM    │           │       │  │
│  │                │ Staff: J. Smith │           │       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Year 11 Music  │ Rehearsal       │ 24h ago  │ [Sync]│  │
│  │  └ Details...  │ Start: 1:00 PM  │           │       │  │
│  │  └ 12 students │ End: 2:30 PM    │           │       │  │
│  │                │ Staff: M. Jones │           │       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### State Views

#### Loading State
- Spinner centered on page
- Message: "Loading clipboard teams..."
- User cannot interact

#### Success State (Teams Loaded)
- Table displays all teams (max visible without scroll: ~10 rows)
- Each row shows: Team Name, Session Title, Last Sync Time, Sync Button
- Rows are expandable (click team name or row) to reveal session details
- Sync button is enabled (clickable)

#### Empty State
- Message: "No clipboard teams configured. Contact your administrator."
- No table rendered

#### Error State
- Error banner with message and retry button
- Message format: "[Error Type]: [Description]"
- Examples:
  - "Failed to load teams: API error. Retry?"
  - "Authorization failed: You do not have permission to view this page."
- Previous data (if cached) may be shown as stale with "Last loaded: [time]"

---

## Component Communication

### Data Flow

```
ClipboardMusicSyncPage
│
├─ useEffect (on mount)
│  └─> ClipboardTeamService.getAll()
│      └─> [iClipboardTeam[], ...]
│
└─> ClipboardTeamsListPanel
    ├─ Props: teams[], isLoading, error, onSyncClick
    ├─ State: selectedTeamId (for expansion)
    │
    └─> Table Row (per team)
        ├─ Display: Team Name, Session Title, Last Sync Time
        │
        └─> on Sync Button Click
            ├─> ClipboardSyncConfirmPopup
            │   ├─ onConfirm: triggerSync(teamId)
            │   │  └─> ClipboardMusicSyncService.triggerSync()
            │   │      └─> iClipboardSyncMessage
            │   │
            │   └─ onCancel: close popup
            │
            └─> Show Toast (on sync result)
                ├─ Success: "Sync triggered. Processing..."
                └─ Error: "Sync failed: [error message]"
```

### Service Calls

| Operation | Service Method | Endpoint | Return Type | Timing |
|-----------|---|---|---|---|
| Load teams | `ClipboardTeamService.getAll()` | GET `/clipboard/team` | `iPaginatedResult<iClipboardTeam>` | On page load |
| Load sessions (optional) | `ClipboardSessionService.getAll()` | GET `/clipboard/session` | `iPaginatedResult<iClipboardSession>` | On page load or expand team |
| Trigger sync | `ClipboardMusicSyncService.triggerSync()` | POST `/clipboard/syncMusic` | `iClipboardSyncMessage` | On user confirmation |

---

## API Response Contract

### GET `/clipboard/team` Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Year 10 PE Class A",
      "classCode": "PE10A",
      "externalId": "clip-team-001",
      "isHidden": false,
      "checkSum": "abc123...",
      "createdAt": "2026-06-01T10:00:00Z",
      "updatedAt": "2026-06-15T14:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20
}
```

### POST `/clipboard/syncMusic` Response

```json
{
  "id": 12345,
  "type": "MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC",
  "status": "NEW",
  "createdAt": "2026-06-15T15:00:00Z",
  "updatedAt": "2026-06-15T15:00:00Z",
  "request": {
    "trigger": "adhoc",
    "triggeredByUserId": 42
  },
  "response": null,
  "error": null
}
```

### Error Response (400/500)

```json
{
  "code": "CLIPBOARD_API_ERROR",
  "message": "Failed to trigger sync: team not found",
  "details": { ... }
}
```

---

## UI Interactivity Contract

### Sync Button Behavior

| State | Appearance | Enabled | Click Behavior |
|-------|---|---|---|
| Ready | "Sync" label, blue | ✅ Yes | Open confirmation popup |
| Processing | "Syncing..." label, spinner, gray | ❌ No | No-op (disabled) |
| Success | "Synced" label (briefly), green checkmark | ✅ Yes (after 2-3s) | Open confirmation popup |
| Error | "Sync Failed" label, red | ✅ Yes | Open confirmation popup |

### Confirmation Popup

**Trigger**: Click "Sync" button on team row

**Content**:
```
┌─────────────────────────────────────┐
│ Confirm Music Sync                  │
├─────────────────────────────────────┤
│ Team: Year 10 PE Class A            │
│                                     │
│ This will trigger a synchronization │
│ of student rosters for this team.   │
│ This may take up to 1 minute.       │
│                                     │
│ [ Cancel ]    [ Confirm Sync ]      │
└─────────────────────────────────────┘
```

**Actions**:
- Cancel: Close popup, no action
- Confirm Sync: Trigger API call, show progress indicator, close popup, show toast

---

## Error Handling Contract

### Common Error Scenarios

| Scenario | HTTP Status | Error Message | User Action |
|---|---|---|---|
| Team list fetch fails | 500 or 4xx | "Failed to load teams: [reason]" | Retry button |
| User lacks permission | 403 | "You do not have permission to perform this action" | None (read-only mode) |
| Sync API unavailable | 503 or 500 | "Sync service unavailable. Try again later." | Retry button |
| Sync already running | 409 or 400 | "A sync is already in progress for this team. Please wait." | None (disable button) |
| Invalid team ID | 400 | "Team not found. Refresh the page." | Refresh button |

### Toast Notifications (via Toaster service)

**Success**:
- Message: "Music sync triggered successfully. Processing..."
- Duration: 3 seconds

**Error**:
- Message: "Music sync failed: [error detail]"
- Duration: 5 seconds
- Action: Optional "Retry" button

---

## Accessibility Contract

- Page title: "Clipboard Management - Music Sync"
- Buttons have `aria-label` (e.g., "Sync team Year 10 PE Class A")
- Table has proper `<thead>`, `<tbody>` structure
- Confirmation popup is a modal with `role="dialog"`
- Toasts use `role="alert"` for screen readers
- Loading spinner has `aria-busy="true"`
- Error messages are associated with form controls via `aria-describedby`

---

## Performance Contract

- **Page Load**: Initial team list displayed within 5 seconds (SC-001)
- **Sync Feedback**: User receives success/error feedback within 30 seconds (SC-003)
- **Duplicate Prevention**: Sync button disabled immediately on click (prevents duplicate API calls)
- **No Pagination Lag**: All 10+ teams rendered without layout shift or scroll jank (SC-002)
