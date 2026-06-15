/**
 * Represents a music sync job message from the Clipboard API
 * Used to track the status and results of student-to-team roster synchronization operations
 */
type iClipboardSyncMessage = {
  /** Unique identifier for the sync job */
  id: number;

  /** Type of sync operation (e.g., 'MUSIC', 'ATTENDANCE', etc.) */
  type: string;

  /** Current status of the sync job */
  status: 'NEW' | 'PROCESSING' | 'WIP' | 'SUCCESS' | 'FAILED';

  /** Timestamp when the sync job was created (ISO 8601 UTC) */
  createdAt: string;

  /** Timestamp when the sync job was last updated (ISO 8601 UTC) */
  updatedAt: string;

  /** Request payload sent to the sync operation (optional) */
  request?: {
    teamId?: string | number;
    [key: string]: any;
  };

  /** Response payload from the sync operation (optional) */
  response?: {
    syncedCount?: number;
    skippedCount?: number;
    [key: string]: any;
  };

  /** Error message if sync failed (optional) */
  error?: {
    code?: string;
    message: string;
    [key: string]: any;
  };
};

export default iClipboardSyncMessage;
