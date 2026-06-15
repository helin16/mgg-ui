# Service Interface Contract: Clipboard Music Sync Service

**Feature**: [Clipboard Music Sync Management UI](../spec.md) | **Data Model**: [data-model.md](../data-model.md)  
**Date**: 2026-06-15

## Service Layer Architecture

### Existing Services (Reuse)

#### ClipboardTeamService

**File**: `src/services/Clipboard/ClipboardTeamService.ts`

```typescript
export interface iClipboardTeamService {
  getAll(params?: iConfigParams, config?: iConfigParams): Promise<iPaginatedResult<iClipboardTeam>>;
  get(id: string | number, params?: iConfigParams, config?: iConfigParams): Promise<iClipboardTeam>;
}
```

**Usage**:
```typescript
const teamsResult = await ClipboardTeamService.getAll({ perPage: 100 });
const teams = teamsResult.data;
```

**Parameters**:
- `perPage`: Number of results per page (recommend 100 for initial load)
- `sort`: Sort order (e.g., "name:ASC")
- `filter`: Optional filter criteria

**Response**:
```typescript
type iPaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
```

#### ClipboardSessionService

**File**: `src/services/Clipboard/ClipboardSessionService.ts`

```typescript
export interface iClipboardSessionService {
  getAll(params?: iClipboardSessionQueryParams, config?: iConfigParams): Promise<iPaginatedResult<iClipboardSession>>;
  get(id: string | number, params?: iClipboardSessionQueryParams, config?: iConfigParams): Promise<iClipboardSession>;
}
```

**Usage**:
```typescript
const sessionsResult = await ClipboardSessionService.getAll({ 
  teams: [teamId],
  statuses: ['active'],
  perPage: 50
});
const sessions = sessionsResult.data;
```

**Query Parameters** (from iClipboardSessionQueryParams):
- `teams`: Array of team IDs to filter by
- `statuses`: Array of session statuses to include
- `fromDate`, `toDate`: Date range filters
- `perPage`, `page`: Pagination controls

---

### New Service (Create)

#### ClipboardMusicSyncService

**File**: `src/services/Clipboard/ClipboardMusicSyncService.ts`

**Purpose**: Wrapper around POST `/clipboard/syncMusic` endpoint with error handling and state management.

```typescript
import axios, { AxiosError } from 'axios';
import iClipboardSyncMessage from '../../types/Clipboard/iClipboardSyncMessage';
import AppService from '../AppService';
import Toaster from '../Toaster';

const ClipboardMusicSyncService = {
  /**
   * Trigger an adhoc music sync for all teams (or specific team if teamId provided)
   * @param teamId Optional team ID to sync (if omitted, syncs all teams)
   * @returns iClipboardSyncMessage with job status
   * @throws AxiosError if API call fails
   */
  triggerSync: async (teamId?: string | number): Promise<iClipboardSyncMessage> => {
    try {
      const endpoint = `${AppService.getAppUrl()}/clipboard/syncMusic`;
      const response = await axios.post<iClipboardSyncMessage>(
        endpoint,
        teamId ? { teamId } : {},
        {
          headers: AppService.getAxiosConfig().headers,
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const message = axiosError.response?.data?.message || 'Failed to trigger music sync';
      Toaster.error(message);
      throw error;
    }
  },

  /**
   * Poll for sync job status (optional, for real-time feedback)
   * @param messageId Job/message ID from triggerSync response
   * @returns iClipboardSyncMessage with updated status
   */
  pollSyncStatus: async (messageId: number): Promise<iClipboardSyncMessage> => {
    try {
      const endpoint = `${AppService.getAppUrl()}/clipboard/syncMusic/${messageId}`;
      const response = await axios.get<iClipboardSyncMessage>(
        endpoint,
        {
          headers: AppService.getAxiosConfig().headers,
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ClipboardMusicSyncService;
```

**API Contract**:

| Method | Endpoint | HTTP Verb | Request Body | Response | Error Codes |
|--------|----------|-----------|---|---|---|
| `triggerSync()` | `/clipboard/syncMusic` | POST | `{ teamId?: number }` | `iClipboardSyncMessage` | 400, 403, 409, 500 |
| `pollSyncStatus(messageId)` | `/clipboard/syncMusic/:id` | GET | (none) | `iClipboardSyncMessage` | 404, 500 |

**Error Handling**:
- 400 Bad Request: Invalid team ID or request
- 403 Forbidden: User lacks permission
- 409 Conflict: Sync already in progress
- 500 Internal Server Error: Backend failure

**Integration Points**:
- Uses `AppService.getAppUrl()` for base URL
- Uses `AppService.getAxiosConfig()` for headers (includes auth token)
- Uses `Toaster.error()` for error notifications

---

## Type Definitions

### New Type: iClipboardSyncMessage

**File**: `src/types/Clipboard/iClipboardSyncMessage.ts`

```typescript
export type iClipboardSyncMessage = {
  id: number;
  type: 'MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC';
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

### Existing Types (Reuse)

**File**: `src/types/Clipboard/iClipboardTeam.ts`

```typescript
import iBaseType from '../iBaseType';

type iClipboardTeam = iBaseType & {
  name: string | null;
  classCode: string | null;
  isHidden: boolean;
  externalId: string | null;
  externalObj: any | null;
  checkSum: string | null;
};

export default iClipboardTeam;
```

**File**: `src/types/Clipboard/iClipboardSession.ts`

```typescript
import iBaseType from '../iBaseType';

type iClipboardDepartment = {
  id: number;
  name: string;
};

type iClipboardActivity = {
  id: number;
  name: string;
  department: iClipboardDepartment;
};

type iClipboardTeam = {
  id: number;
  name: string;
};

type iClipboardStaff = {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
};

type iClipboardSession = iBaseType & {
  title: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  activity: iClipboardActivity;
  sisIds?: string[];
  teams?: iClipboardTeam[];
  assignedStaff?: iClipboardStaff[];
  cancelled?: boolean;
  scored?: boolean;
  feedback?: any[];
  externalObj?: any | null;
};

export default iClipboardSession;
```

---

## Hook Contract (Optional)

For repeated polling or subscription patterns, create a custom hook:

```typescript
// src/components/hooks/useClipboardSyncStatus.ts
import { useEffect, useState } from 'react';
import iClipboardSyncMessage from '../../types/Clipboard/iClipboardSyncMessage';
import ClipboardMusicSyncService from '../../services/Clipboard/ClipboardMusicSyncService';

export const useClipboardSyncStatus = (messageId: number | null, pollInterval = 2000) => {
  const [status, setStatus] = useState<iClipboardSyncMessage | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!messageId) return;

    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const updated = await ClipboardMusicSyncService.pollSyncStatus(messageId);
        setStatus(updated);

        if (updated.status === 'SUCCESS' || updated.status === 'FAILED') {
          setIsPolling(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error polling sync status:', error);
      }
    }, pollInterval);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [messageId, pollInterval]);

  return { status, isPolling };
};

export default useClipboardSyncStatus;
```

---

## Integration Guidelines

### In Components

```typescript
// Example usage in ClipboardTeamsListPanel.tsx
import ClipboardMusicSyncService from '../../../services/Clipboard/ClipboardMusicSyncService';
import iClipboardSyncMessage from '../../../types/Clipboard/iClipboardSyncMessage';

const handleSyncClick = async (teamId: number) => {
  try {
    setIsSyncing(true);
    const result: iClipboardSyncMessage = await ClipboardMusicSyncService.triggerSync(teamId);
    
    // Handle response based on status
    if (result.status === 'SUCCESS') {
      Toaster.success('Sync completed successfully');
    } else if (result.status === 'NEW' || result.status === 'PROCESSING') {
      Toaster.info('Sync job created. Processing...');
      // Optionally poll for updates
    }
  } catch (error) {
    // Error already toasted by service
    console.error('Sync error:', error);
  } finally {
    setIsSyncing(false);
  }
};
```

### In Tests

```typescript
// Example test setup
import { jest } from '@jest/globals';
import ClipboardMusicSyncService from '../../../services/Clipboard/ClipboardMusicSyncService';

describe('ClipboardMusicSyncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('triggerSync should return iClipboardSyncMessage', async () => {
    const mockResponse: iClipboardSyncMessage = {
      id: 123,
      type: 'MESSAGE_TYPE_CLIPBOARD_STUDENT_CLASSES_SYNC',
      status: 'NEW',
      createdAt: '2026-06-15T15:00:00Z',
      updatedAt: '2026-06-15T15:00:00Z',
      request: { trigger: 'adhoc', triggeredByUserId: 42 },
      response: null,
      error: null,
    };

    jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockResponse });
    const result = await ClipboardMusicSyncService.triggerSync(1);
    expect(result).toEqual(mockResponse);
  });
});
```

---

## Backward Compatibility

- No breaking changes to existing services (ClipboardTeamService, ClipboardSessionService)
- New service is additive; does not modify existing APIs
- Existing types remain unchanged; new type is purely additive
