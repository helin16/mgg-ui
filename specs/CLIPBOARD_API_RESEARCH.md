# Clipboard API Research Summary

## Overview
The mggs-api repository contains a fully implemented Clipboard integration with controllers, models, connectors, and job queue processing.

---

## 1. File Locations and Code Structure

### Controllers
- **Location**: `/src/controllers/Clipboard/`
- **Files**:
  - `ClipboardTeamController.ts` - Team CRUD operations
  - `ClipboardSessionController.ts` - Session queries with complex filtering
  - `ClipboardAttendanceController.ts` - Attendance record queries
  - `ClipboardIncidentController.ts` - Incident/concussion tracking
  - `ClipboardSyncMusicController.ts` - **Music sync trigger endpoint** ⭐

### Models
- **Location**: `/src/models/Clipboard/`
- **Files**:
  - `ClipboardTeam.ts` - Team data model
  - `ClipboardSession.ts` - Session data model

### Connectors
- **Location**: `/src/connectors/Clipboard/`
- **Files**:
  - `ClipboardConnector.ts` - Main API connector to external Clipboard system
  - `types/` - TypeScript interfaces for all data types

### Queue/Workers
- **Location**: `/src/queue/ClipboardQueue.ts` and `/src/workers/Clipboard/`
- **Processing**: Message-based job queue for async operations
- **Helper**: `/src/helper/Clipboard/ClipboardStudentClassesSyncHelper.ts`

---

## 2. Clipboard API Endpoints

### Base Routes (defined in `/src/routes.ts`)
```
/clipboard/team          - Team management
/clipboard/session       - Session queries
/clipboard/incident      - Incident tracking
/clipboard/attendance    - Attendance records
/clipboard/syncMusic     - Music sync trigger ⭐
```

### Team Endpoint
- **GET** `/clipboard/team` - List all teams (paginated)
- **GET** `/clipboard/team/:id` - Get single team
- **Auth Required**: Token validation (app token + user token)

### Session Endpoint
- **GET** `/clipboard/session` - Complex query endpoint with filters:
  - `activityIds` (array)
  - `departmentIds` (array)
  - `locationIds` (array)
  - `sisIds` (array)
  - `teamId` (single)
  - `startDateTime`, `endDateTime`
  - `scored`, `cancelled`, `bye` (boolean)
  - `includeTeams`, `includeStaff`, `includeRoundName`
  - `includeSisIds`, `includeCustomFieldsMetadata`
  - `excludeSessionsWithTeams`
  - `includeStatuses` (array: 'confirmed' | 'unconfirmed' | 'draft')
  - `updatedBefore`, `updatedAfter`
  - Pagination support

### Attendance Endpoint
- **GET** `/clipboard/attendance` - Query attendance records with filters:
  - `activityIds`, `departmentIds`, `studentSisIds` (arrays)
  - `timePeriod`
  - `startDateTime`, `endDateTime`
  - `absent`, `explained` (boolean)
  - `updatedBefore`, `updatedAfter`

### Incident Endpoint
- **GET** `/clipboard/incident` - Query incidents with filters:
  - `sisIds` (array)
  - `activityIds` (array)
  - `startDateTime`, `endDateTime`
  - `concussionStatuses` (array: 'none' | 'potential' | 'confirmed' | 'any')
  - `updatedBefore`, `updatedAfter`
  - Includes "return to play" data structure

---

## 3. Music Sync API ⭐

### **Music Sync Endpoint Already Exists**
✅ **Confirmed: YES - Music sync API is fully implemented**

**Location**: [ClipboardSyncMusicController.ts](mggs-api/src/controllers/Clipboard/ClipboardSyncMusicController.ts)

### Endpoint Details
- **Route**: `POST /clipboard/syncMusic`
- **Authentication**: 
  - App token validation
  - User token validation
  - Module access validation (CLIPBOARD module required)
- **Request Body**: Empty (no payload needed)
- **Response**: Returns message object with sync job status

### Implementation Details
```typescript
// Trigger mechanism
ClipboardSyncMusicController.post(
  "/",
  AuthHelper.validateViaAppToken,
  AuthHelper.validateUserViaToken,
  ModuleHelper.validateAccessForModule(MGGS_MODULE_ID_CLIP_BOARD),
  getRoute(async (req, res) => {
    const currentUser = req.user as UserModel;
    const request = ClipboardStudentClassesSyncHelper.buildRequest({
      trigger: "adhoc",
      triggeredByUserId: currentUser.id,
    });

    const existingMessage = await ClipboardQueue.preCheckBeforeAddJob(
      request,
      MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC
    );
    if (existingMessage) {
      return res.status(200).json(existingMessage);
    }

    const message = await ClipboardQueue.addJobWithoutDuplicate(request, currentUser.id);
    return res.status(201).json(message);
  })
);
```

### Music Sync Request Structure
```typescript
type iSyncRequest = {
  trigger?: "nightly" | "adhoc";           // "adhoc" for manual trigger
  triggeredByUserId?: string | number;     // ID of user triggering sync
  queuedAt?: string;                       // ISO timestamp when queued
  runDate?: string;                        // YYYY-MM-DD format
  scope?: {                                 // Sync configuration
    fileType: "M";
    classCodePrefix: "X";
    currentSemesterOnly: true;
  };
};
```

### Music Sync Processing
- **Queue System**: Message-based job queue (ClipboardQueue)
- **Processing Type**: `MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC`
- **Worker**: `ClipboardStudentClassesSync` (async worker)
- **Duplicate Prevention**: Pre-checks for existing jobs; won't create duplicates
- **Return Status**: Returns 201 (Created) for new job or 200 (OK) for existing job

### Sync Scope Details
The sync operates on:
- **File Type**: "M" (Music/specific type)
- **Class Code Prefix**: "X" (classes starting with "X")
- **Semester**: Current semester only
- **Sync Operations**:
  - Adds new student memberships to teams
  - Ends expired memberships (based on leave dates)
  - Reopens memberships
  - Tracks unchanged memberships

---

## 4. Team Data Model

### ClipboardTeam Structure
```typescript
interface ClipboardTeamAttributes {
  id: number;                    // Auto-generated
  name: string | null;          // Team name
  classCode: string | null;     // e.g., "X101"
  isHidden: boolean;            // Default: false
  externalId: string | null;    // Clipboard system ID
  externalObj: object | null;   // Raw Clipboard response
  checkSum: string | null;      // For change detection
  createdAt: Date;
  updatedAt: Date;
}
```

### Team API Connector Methods
```typescript
// Get all teams
getTeams(params: {
  includeStudents?: boolean;
  includeMembers?: boolean;
  includeStudentDetails?: boolean;
  includeLeaveDates?: boolean;
  ...pagination
})

// Team data from Clipboard API includes:
// - id, name, classCode, campus
// - members (optional)
// - students (optional)
// - custom fields metadata
```

---

## 5. Session Data Model

### ClipboardSession Structure
```typescript
interface ClipboardSessionAttributes {
  id: number;
  title: string;                        // Session name
  synUserId: number | null;            // Synergetic user ID
  schoolBoxCalendarEventId: number | null;
  clipboardId: number | null;          // Clipboard session ID
  clipboardUserId: number | null;      // Clipboard user who created it
  clipboardTeamId: number | null;      // Associated team
  startDate: Date | string | null;
  endDate: Date | string | null;
  isAllDayEvent: boolean | null;
  isCancelled: boolean;                // Default: false
  externalObj: object | null;          // Raw Clipboard data
  externalObjSum: string | null;       // Checksum for changes
  createdAt: Date;
  updatedAt: Date;
}
```

### Session Query Parameters
- **Filter by Team**: `teamId`
- **Filter by Time**: `startDateTime`, `endDateTime`
- **Filter by Status**: `includeStatuses` ('confirmed', 'unconfirmed', 'draft')
- **Filter by Type**: `scored`, `cancelled`, `bye`
- **Include Related Data**:
  - `includeTeams` - Full team objects
  - `includeStaff` - Staff participation data
  - `includeRoundName` - Round information
  - `includeSisIds` - Student SIS IDs
  - `includeCustomFieldsMetadata` - Custom field definitions

---

## 6. External Clipboard Connector

### Environment Configuration
```
CLIP_BOARD_END_POINT=  // Base URL of Clipboard API
CLIP_BOARD_API_TOKEN=  // Bearer token for authentication
```

### Connector Methods Available
```typescript
getTeams(params)                    // Get teams
getSessions(params)                 // Get sessions
getAttendanceRecords(params)        // Get attendance
getIncidents(params)                // Get incidents/concussions
getDepartments(params)              // Get departments
getLocations(params)                // Get locations
getYearGroups(params)               // Get year groups
getIncident(id, params)             // Get single incident
```

### External Data Types
- `iClipboardTeam` - Team definition
- `iClipboardSession` - Session/match definition
- `iClipboardAttendance` - Attendance record
- `iClipboardIncident` - Incident record (with return-to-play data)
- `iClipboardDepartment` - Department
- `iClipboardLocation` - Location
- `iClipboardYearLevelGroup` - Year group
- `iClipboardStudent` - Student info
- `iClipboardUser` - User info
- `iClipboardTeamMember` - Team membership

---

## 7. Key Findings

### ✅ Confirmed
1. **Music Sync API exists** - Fully implemented at `POST /clipboard/syncMusic`
2. **Async job queue** - Uses message-based queue with duplicate prevention
3. **Team management** - Full CRUD and query capabilities
4. **Session management** - Complex filtering for sessions/matches
5. **Attendance tracking** - Detailed attendance records available
6. **Incident tracking** - Concussion/incident management with return-to-play data
7. **External integration** - Fully connected to external Clipboard system via API

### Data Flow for Music Sync
1. User triggers `POST /clipboard/syncMusic`
2. System creates sync request with trigger type "adhoc"
3. Request is queued to job system (duplicate check prevents duplicates)
4. Worker processes: `ClipboardStudentClassesSync`
5. Sync matches Synergetic classes with Clipboard teams
6. Student memberships are synced (added/ended/reopened)
7. Results tracked per class with summary statistics

### UI Opportunities (for mgg-ui)
- Display teams with student counts
- Show session schedules filtered by team/timeframe
- Display attendance/incident summaries
- Trigger manual music sync with status feedback
- Show sync job queue status and history

---

## 8. Architecture Patterns

### CRUD Pattern (Teams)
```typescript
ClipboardTeamController.get('/', ...middleware, CRUDHelper.getModels(...))
ClipboardTeamController.get('/:id', ...middleware, CRUDHelper.getModel(...))
```

### Query Pattern (Sessions, Attendance, Incidents)
```typescript
// Complex parameter parsing with defaults
// Supports arrays, booleans, dates, pagination
// Direct calls to ClipboardConnector
```

### Async Job Pattern (Music Sync)
```typescript
// Build request → Pre-check for duplicates → Add to queue → Worker processes
// Uses message-based queue system
```

---

## 9. External API Structure

Based on connector implementation, Clipboard API uses:
- **Base URL**: Environment variable `CLIP_BOARD_END_POINT`
- **Auth**: Bearer token in Authorization header
- **Endpoints**:
  - `/teams` - Team list
  - `/sessions` - Match/session list
  - `/incidents` - Incident/concussion list
  - `/attendance` - Attendance records
  - `/departments` - Department list
  - `/locations` - Location list
  - `/year-groups` - Year group list
- **Query Params**: Support pagination, filtering, data inclusion flags
- **Response Format**: Paginated JSON with data array

---

## Files Summary

| File | Purpose |
|------|---------|
| `ClipboardSyncMusicController.ts` | POST endpoint for music sync trigger |
| `ClipboardSessionController.ts` | GET endpoint for session queries |
| `ClipboardTeamController.ts` | GET endpoints for team CRUD |
| `ClipboardAttendanceController.ts` | GET endpoint for attendance |
| `ClipboardIncidentController.ts` | GET endpoint for incidents |
| `ClipboardConnector.ts` | External Clipboard API client |
| `ClipboardQueue.ts` | Job queue for async processing |
| `ClipboardStudentClassesSyncHelper.ts` | Sync request builder & logic |
| `ClipboardSession.ts` | Database model for sessions |
| `ClipboardTeam.ts` | Database model for teams |
