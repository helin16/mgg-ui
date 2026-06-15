# Data Model: Clipboard Music Sync Management UI

**Feature**: [Clipboard Music Sync Management UI](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-06-15

## Entity Definitions

### iClipboardTeam

**Purpose**: Represents a class or activity team in the Clipboard system that can have students synced to rosters.

**Fields**:
- `id` (number): Unique identifier in Clipboard system
- `name` (string | null): Team/class name (e.g., "Year 10 PE Class A")
- `classCode` (string | null): Associated class code (e.g., "PE10A")
- `externalId` (string | null): External identifier from source system
- `isHidden` (boolean): Whether team is hidden from UI (default: false)
- `checkSum` (string | null): Data integrity checksum

**Validation Rules**:
- `id` must be a positive integer
- `name` must be non-empty when displayed in list
- If `name` is null, use fallback: `classCode` or "Unknown Team"
- `isHidden` teams may be excluded from UI display or marked as inactive

**Relationships**:
- Has many `iClipboardSession` records
- Associated with sync job history via `iClipboardSyncMessage`

**State**:
- **Active**: Team has active sessions and can be synced
- **Inactive**: No active sessions; sync may not apply
- **Hidden**: `isHidden = true`; may be excluded from UI

---

### iClipboardSession

**Purpose**: Represents an active session (training, class, activity) associated with one or more teams where students can be managed.

**Fields**:
- `id` (number): Unique identifier in Clipboard system
- `title` (string): Session name (e.g., "Team Practice - Monday Evening")
- `startDateTime` (string, ISO 8601): Session start time in UTC
- `endDateTime` (string, ISO 8601): Session end time in UTC
- `activity` (iClipboardActivity): Activity/department context
  - `id` (number): Activity ID
  - `name` (string): Activity name
  - `department` (iClipboardDepartment):
    - `id` (number): Department ID
    - `name` (string): Department name
- `teams` (iClipboardTeam[], optional): Teams associated with this session
- `assignedStaff` (iClipboardStaff[], optional): Staff leading/assisting the session
  - `id` (number, optional)
  - `firstName` (string | null, optional)
  - `lastName` (string | null, optional)
- `sisIds` (string[], optional): Student information system IDs
- `cancelled` (boolean, optional): Whether session is cancelled
- `scored` (boolean, optional): Whether session has scoring/feedback
- `feedback` (any[], optional): Feedback/scoring data
- `externalObj` (any | null, optional): Raw external Clipboard data

**Validation Rules**:
- `title` must be non-empty
- `startDateTime` and `endDateTime` must be valid ISO 8601 timestamps in UTC
- `startDateTime` must be before `endDateTime`
- `cancelled = true` may affect sync eligibility (business logic TBD)
- `activity` and `department` must be present or handle gracefully

**Relationships**:
- Belongs to zero or more `iClipboardTeam` records
- Associated with staff assignments

**State**:
- **Active**: Session is current or future; can trigger syncs
- **Cancelled**: `cancelled = true`
- **Completed**: Session is past and scored
- **Pending**: Session exists but music sync has not been triggered

---

### iClipboardSyncMessage (New)

**Purpose**: Tracks the status and result of a manual or scheduled music sync job triggered via `POST /clipboard/syncMusic`.

**Fields**:
- `id` (number): Unique message/job ID in backend queue
- `type` (string): Always "MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC"
- `status` (enum): Current job status
  - `"NEW"`: Job created but not yet processed
  - `"PROCESSING"` (aka "WIP"): Job is actively syncing
  - `"SUCCESS"`: Sync completed successfully
  - `"FAILED"`: Sync encountered an error
- `createdAt` (string, ISO 8601): Timestamp when job was created
- `updatedAt` (string, ISO 8601): Timestamp of last status update
- `request` (object, optional): Original sync request payload
  - `trigger` (string): "adhoc" or "scheduled"
  - `triggeredByUserId` (number): User ID who triggered sync
  - Other request context
- `response` (object, optional): Sync result payload (populated on SUCCESS)
  - `syncedCount` (number, optional): Number of students synced
  - `teamId` (number, optional): Team ID that was synced
  - Other response details
- `error` (object, optional): Error details (populated on FAILED)
  - `message` (string): Error message
  - `code` (string, optional): Error code
  - Other error details

**Validation Rules**:
- `id` must be a positive integer
- `status` must be one of: NEW, PROCESSING (WIP), SUCCESS, FAILED
- `createdAt` and `updatedAt` must be valid ISO 8601 timestamps
- `createdAt` must be ≤ `updatedAt`
- `response` field populated only when `status = SUCCESS`
- `error` field populated only when `status = FAILED`

**Relationships**:
- Created by `ClipboardMusicSyncService.triggerSync()`
- Associated with a specific `iClipboardTeam` (via request context)
- May reference the `User` who triggered the sync

**State Transitions**:
```
NEW → PROCESSING → SUCCESS
                ↘ FAILED
```

- **NEW**: Initial state; job queued and awaiting processing
- **PROCESSING**: Job is executing; UI may show spinner or badge
- **SUCCESS**: Job completed; UI should display success notification and update team status
- **FAILED**: Job encountered error; UI should display error notification and allow retry

---

### Supporting Types (Existing, Reuse)

#### iClipboardActivity
```typescript
type iClipboardActivity = {
  id: number;
  name: string;
  department: iClipboardDepartment;
};
```

#### iClipboardDepartment
```typescript
type iClipboardDepartment = {
  id: number;
  name: string;
};
```

#### iClipboardStaff
```typescript
type iClipboardStaff = {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
};
```

---

## UI State Machine

### Teams List View

**State**: 
- **Loading**: `isLoading = true`, spinner shown, no teams rendered
- **Success**: `data.length > 0`, table of teams displayed
- **Empty**: `data.length === 0`, "No teams found" message
- **Error**: Error message displayed; user can retry

**Transitions**:
- Initial load → Loading → (Success | Empty | Error)
- Error state → Retry action → Loading → Success | Error

### Sync Operation State (per team)

**State**:
- **Ready**: Sync button enabled; no operation in flight
- **Pending**: Sync button disabled; operation processing; spinner/badge shown
- **Success**: Success toast displayed; team status updated
- **Failed**: Error toast displayed; retry button offered

**Transitions**:
- Ready → (User clicks Sync) → Confirm Popup → (User confirms) → Pending
- Pending → (API returns SUCCESS) → Success → Ready
- Pending → (API returns FAILED) → Failed → Ready (via retry or manual retry button)

---

## Type Definitions (Code)

```typescript
// src/types/Clipboard/iClipboardSyncMessage.ts
export type iClipboardSyncMessage = {
  id: number;
  type: string; // "MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC"
  status: 'NEW' | 'PROCESSING' | 'WIP' | 'SUCCESS' | 'FAILED';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  request?: {
    trigger: 'adhoc' | 'scheduled';
    triggeredByUserId: number;
    [key: string]: any;
  } | null;
  response?: {
    syncedCount?: number;
    teamId?: number;
    [key: string]: any;
  } | null;
  error?: {
    message: string;
    code?: string;
    [key: string]: any;
  } | null;
};

export default iClipboardSyncMessage;
```

---

## Assumptions & Notes

- **Session-Team Relationship**: A session can have multiple teams; the UI will display session info when a team is selected/expanded.
- **Sync Scope**: Music sync operations are team-scoped (not session-scoped); sync target is always the entire team roster within Clipboard.
- **Status Polling**: If sync jobs take >30 seconds, UI should either poll for status or use WebSocket for real-time updates (out of scope for v1).
- **Timezone Handling**: All timestamps from API are UTC; frontend should convert to local time for display (use moment-timezone per project pattern).
- **Error Recovery**: Failed syncs are retryable via the retry button; no automatic retry logic needed in v1.
