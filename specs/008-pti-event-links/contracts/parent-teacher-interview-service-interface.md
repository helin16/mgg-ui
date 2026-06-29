# Service Interface Contract: Parent Teacher Interview Calendar UI

**Feature**: [Parent Teacher Interview Event Links](../spec.md) | **Data Model**: [../data-model.md](../data-model.md)  
**Date**: 2026-06-29

## Service Layer Architecture

### Existing Services Reused

#### `SynVStaffService`

**File**: `src/services/Synergetic/SynVStaffService.ts`

**Use**:
- load active teaching staff
- apply text search and department/category filters through query params

**Expected query shape**:
```typescript
{
  where: JSON.stringify({
    ActiveFlag: true,
    StaffDepartment: [SynLuDepartmentCodes.TS],
    ...(searchText),
    ...(categoryCodes.length > 0 ? { StaffCategory: categoryCodes } : {})
  })
}
```

#### `SynLuStaffCategoryService`

**File**: `src/services/Synergetic/Lookup/SynLuStaffCategoryService.ts`

**Use**:
- load category options for the first-step filter

#### `MggsModuleService`

**File**: `src/services/Module/MggsModuleService.ts`

**Use**:
- load Parent Teacher Interview module settings
- update module settings through the admin page

---

### New Service

#### `ParentTeacherInterviewCalendarService`

**File**: `src/services/ParentTeacherInterview/ParentTeacherInterviewCalendarService.ts`

**Purpose**: Typed frontend wrapper for the API endpoints provided by `../mggs-api` feature 004.

```typescript
import AppService, { iConfigParams } from '../AppService';
import iParentTeacherInterviewCalendarEventsResponse from '../../types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventsResponse';
import iParentTeacherInterviewCreateCalendarEventRequest from '../../types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventRequest';
import iParentTeacherInterviewCreateCalendarEventResponse from '../../types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventResponse';

const endPoint = '/parentTeacherInterview/calendarEvents';

const getCalendarEvents = (params: {
  staffId: number;
  startDateTime: string;
  endDateTime: string;
}): Promise<iParentTeacherInterviewCalendarEventsResponse> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const createCalendarEvent = (
  payload: iParentTeacherInterviewCreateCalendarEventRequest
): Promise<iParentTeacherInterviewCreateCalendarEventResponse> => {
  return AppService.post(endPoint, payload).then(resp => resp.data);
};

const ParentTeacherInterviewCalendarService = {
  getCalendarEvents,
  createCalendarEvent,
};

export default ParentTeacherInterviewCalendarService;
```

### Endpoint Contract

| Method | Endpoint | UI Caller | Response Type |
|---|---|---|---|
| `GET` | `/parentTeacherInterview/calendarEvents` | schedule step retrieval | `iParentTeacherInterviewCalendarEventsResponse` |
| `POST` | `/parentTeacherInterview/calendarEvents` | create submission | `iParentTeacherInterviewCreateCalendarEventResponse` |

### Behaviour Notes

- `GET` requires module-user access and returns empty events arrays successfully.
- `POST` requires module-admin access and may return `201 CREATED`, `200 EXISTS`, or `400/502` style `FAILED` outcomes.
- The frontend service should not toast by itself; pages/components should decide how to surface mixed per-row states.

## Type Contract

### New Types

**Folder**: `src/types/ParentTeacherInterview/`

#### `iParentTeacherInterviewCalendarEventSummary.ts`
```typescript
type iParentTeacherInterviewCalendarEventSummary = {
  id: string;
  subject: string;
  startDateTime: string;
  endDateTime: string;
  organizer: {
    name: string;
    address: string;
  };
  isOnlineMeeting: boolean | null;
  teamsJoinUrl: string | null;
};
```

#### `iParentTeacherInterviewCalendarEventsResponse.ts`
```typescript
import iParentTeacherInterviewCalendarEventSummary from './iParentTeacherInterviewCalendarEventSummary';

type iParentTeacherInterviewCalendarEventsResponse = {
  staffId: number;
  staffOccupEmail: string;
  startDateTime: string;
  endDateTime: string;
  events: iParentTeacherInterviewCalendarEventSummary[];
};
```

#### `iParentTeacherInterviewCreateCalendarEventRequest.ts`
```typescript
type iParentTeacherInterviewCreateCalendarEventRequest = {
  staffId: number;
  subject: string;
  bodyText: string;
  startDateTime: string;
  endDateTime: string;
};
```

#### `iParentTeacherInterviewCreateCalendarEventResponse.ts`
```typescript
import iParentTeacherInterviewCalendarEventSummary from './iParentTeacherInterviewCalendarEventSummary';

type iParentTeacherInterviewCreateCalendarEventResponse = {
  staffId: number;
  staffOccupEmail: string;
  outcome: 'CREATED' | 'EXISTS' | 'FAILED';
  auditMessageId: string;
  event: iParentTeacherInterviewCalendarEventSummary | null;
  failureCategory?: 'VALIDATION' | 'PERMISSION' | 'TARGET_INELIGIBLE' | 'GRAPH' | null;
  message: string;
};
```

#### `iParentTeacherInterviewModuleSettings.ts`
```typescript
type iParentTeacherInterviewModuleSettings = {
  parentTeacherInterviewCalendar?: {
    subject?: string;
    bodyText?: string;
  };
};
```

#### `iParentTeacherInterviewScheduleRow.ts`
```typescript
import iParentTeacherInterviewCalendarEventSummary from './iParentTeacherInterviewCalendarEventSummary';

type iParentTeacherInterviewScheduleRow = {
  staffId: number;
  staffName: string;
  staffCode: string;
  startDateTime: string | null;
  endDateTime: string | null;
  retrievalStatus: 'IDLE' | 'LOADING' | 'READY' | 'EMPTY' | 'FAILED';
  retrievalMessage: string | null;
  events: iParentTeacherInterviewCalendarEventSummary[];
};
```

## Supporting Enum Contract

**File**: `src/types/Synergetic/Lookup/SynLuDepartmentCodes.ts`

```typescript
enum SynLuDepartmentCodes {
  TS = 'TS',
}

export default SynLuDepartmentCodes;
```

## Verification Contract

Service tests should cover:
- `getCalendarEvents` query parameter pass-through
- `createCalendarEvent` request body pass-through
- typed handling of `CREATED`, `EXISTS`, and `FAILED`
- no direct axios usage outside `AppService`
