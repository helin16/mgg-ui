import AppService from '../../../services/AppService';
import ClipboardMusicSyncService from '../../../services/Clipboard/ClipboardMusicSyncService';
import Toaster from '../../../services/Toaster';
import iClipboardSyncMessage from '../../../types/Clipboard/iClipboardSyncMessage';

// Mock AppService
jest.mock('../../../services/AppService');

// Mock Toaster
jest.mock('../../../services/Toaster', () => ({
  showToast: jest.fn(),
  showApiError: jest.fn(),
  TOAST_TYPE_ERROR: 'error',
}));

describe('ClipboardMusicSyncService', () => {
  const mockSyncResponse: iClipboardSyncMessage = {
    id: 1,
    type: 'MUSIC',
    status: 'NEW',
    createdAt: '2026-06-15T14:00:00Z',
    updatedAt: '2026-06-15T14:00:00Z',
    request: { teamId: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerSync', () => {
    it('calls POST /clipboard/syncMusic endpoint', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const result = await ClipboardMusicSyncService.triggerSync();

      expect(AppService.post).toHaveBeenCalledWith(
        '/clipboard/syncMusic',
        {},
        undefined
      );
    });

    it('includes teamId in request payload when provided', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const result = await ClipboardMusicSyncService.triggerSync(42);

      expect(AppService.post).toHaveBeenCalledWith(
        '/clipboard/syncMusic',
        { teamId: 42 },
        undefined
      );
    });

    it('returns sync message response', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const result = await ClipboardMusicSyncService.triggerSync();

      expect(result).toEqual(mockSyncResponse);
      expect(result.id).toBe(1);
      expect(result.status).toBe('NEW');
    });

    it('handles PROCESSING status response', async () => {
      const processingResponse: iClipboardSyncMessage = {
        ...mockSyncResponse,
        status: 'PROCESSING',
      };
      (AppService.post as jest.Mock).mockResolvedValue({ data: processingResponse });

      const result = await ClipboardMusicSyncService.triggerSync();

      expect(result.status).toBe('PROCESSING');
    });

    it('handles SUCCESS status response', async () => {
      const successResponse: iClipboardSyncMessage = {
        ...mockSyncResponse,
        status: 'SUCCESS',
        response: { syncedCount: 42, skippedCount: 2 },
      };
      (AppService.post as jest.Mock).mockResolvedValue({ data: successResponse });

      const result = await ClipboardMusicSyncService.triggerSync();

      expect(result.status).toBe('SUCCESS');
      expect(result.response?.syncedCount).toBe(42);
    });

    it('throws error and shows error toast on API failure', async () => {
      const apiError = new Error('Network error');
      (AppService.post as jest.Mock).mockRejectedValue(apiError);

      await expect(ClipboardMusicSyncService.triggerSync()).rejects.toThrow('Network error');
      expect(Toaster.showToast).toHaveBeenCalledWith('Network error', 'error');
    });

    it('shows detailed error message from API response', async () => {
      const apiError = {
        response: {
          data: {
            message: 'Team not found',
          },
        },
      };
      (AppService.post as jest.Mock).mockRejectedValue(apiError);

      await expect(ClipboardMusicSyncService.triggerSync()).rejects.toEqual(apiError);
      expect(Toaster.showToast).toHaveBeenCalledWith('Team not found', 'error');
    });

    it('shows generic error message when details are unavailable', async () => {
      (AppService.post as jest.Mock).mockRejectedValue({});

      await expect(ClipboardMusicSyncService.triggerSync()).rejects.toEqual({});
      expect(Toaster.showToast).toHaveBeenCalledWith('Failed to trigger music sync', 'error');
    });

    it('passes additional params to API request', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const params = { customParam: 'value' };
      await ClipboardMusicSyncService.triggerSync(1, params);

      expect(AppService.post).toHaveBeenCalledWith(
        '/clipboard/syncMusic',
        { teamId: 1, customParam: 'value' },
        undefined
      );
    });

    it('passes axios config when provided', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const config = { timeout: 30000 };
      await ClipboardMusicSyncService.triggerSync(1, {}, config);

      expect(AppService.post).toHaveBeenCalledWith(
        '/clipboard/syncMusic',
        { teamId: 1 },
        config
      );
    });

    it('works with string teamId', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      await ClipboardMusicSyncService.triggerSync('team-uuid-123');

      expect(AppService.post).toHaveBeenCalledWith(
        '/clipboard/syncMusic',
        { teamId: 'team-uuid-123' },
        undefined
      );
    });

    it('works with numeric teamId', async () => {
      (AppService.post as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      await ClipboardMusicSyncService.triggerSync(12345);

      expect(AppService.post).toHaveBeenCalledWith(
        '/clipboard/syncMusic',
        { teamId: 12345 },
        undefined
      );
    });
  });

  describe('pollSyncStatus', () => {
    it('calls GET /clipboard/syncMusic/:messageId endpoint', async () => {
      (AppService.get as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const result = await ClipboardMusicSyncService.pollSyncStatus(1);

      expect(AppService.get).toHaveBeenCalledWith(
        '/clipboard/syncMusic/1',
        {},
        undefined
      );
    });

    it('returns current sync message status', async () => {
      (AppService.get as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const result = await ClipboardMusicSyncService.pollSyncStatus(1);

      expect(result).toEqual(mockSyncResponse);
      expect(result.status).toBe('NEW');
    });

    it('handles PROCESSING status during polling', async () => {
      const processingResponse: iClipboardSyncMessage = {
        ...mockSyncResponse,
        status: 'PROCESSING',
      };
      (AppService.get as jest.Mock).mockResolvedValue({ data: processingResponse });

      const result = await ClipboardMusicSyncService.pollSyncStatus(1);

      expect(result.status).toBe('PROCESSING');
    });

    it('handles SUCCESS status after sync completes', async () => {
      const successResponse: iClipboardSyncMessage = {
        ...mockSyncResponse,
        status: 'SUCCESS',
        response: { syncedCount: 100, skippedCount: 0 },
      };
      (AppService.get as jest.Mock).mockResolvedValue({ data: successResponse });

      const result = await ClipboardMusicSyncService.pollSyncStatus(1);

      expect(result.status).toBe('SUCCESS');
    });

    it('handles FAILED status on sync error', async () => {
      const failedResponse: iClipboardSyncMessage = {
        ...mockSyncResponse,
        status: 'FAILED',
        error: { code: 'SYNC_ERROR', message: 'Sync failed' },
      };
      (AppService.get as jest.Mock).mockResolvedValue({ data: failedResponse });

      const result = await ClipboardMusicSyncService.pollSyncStatus(1);

      expect(result.status).toBe('FAILED');
      expect(result.error?.message).toBe('Sync failed');
    });

    it('throws error and shows toast on API failure', async () => {
      const apiError = new Error('Poll failed');
      (AppService.get as jest.Mock).mockRejectedValue(apiError);

      await expect(ClipboardMusicSyncService.pollSyncStatus(1)).rejects.toThrow('Poll failed');
      expect(Toaster.showToast).toHaveBeenCalledWith('Poll failed', 'error');
    });

    it('shows detailed error message from API', async () => {
      const apiError = {
        response: {
          data: {
            message: 'Message not found',
          },
        },
      };
      (AppService.get as jest.Mock).mockRejectedValue(apiError);

      await expect(ClipboardMusicSyncService.pollSyncStatus(1)).rejects.toEqual(apiError);
      expect(Toaster.showToast).toHaveBeenCalledWith('Message not found', 'error');
    });

    it('passes additional params to API request', async () => {
      (AppService.get as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const params = { customParam: 'value' };
      await ClipboardMusicSyncService.pollSyncStatus(1, params);

      expect(AppService.get).toHaveBeenCalledWith(
        '/clipboard/syncMusic/1',
        params,
        undefined
      );
    });

    it('passes axios config when provided', async () => {
      (AppService.get as jest.Mock).mockResolvedValue({ data: mockSyncResponse });

      const config = { timeout: 15000 };
      await ClipboardMusicSyncService.pollSyncStatus(1, {}, config);

      expect(AppService.get).toHaveBeenCalledWith(
        '/clipboard/syncMusic/1',
        {},
        config
      );
    });
  });

  describe('Service exports', () => {
    it('exports both methods', () => {
      expect(ClipboardMusicSyncService.triggerSync).toBeDefined();
      expect(ClipboardMusicSyncService.pollSyncStatus).toBeDefined();
    });

    it('methods are functions', () => {
      expect(typeof ClipboardMusicSyncService.triggerSync).toBe('function');
      expect(typeof ClipboardMusicSyncService.pollSyncStatus).toBe('function');
    });
  });
});
