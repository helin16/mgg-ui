import AppService, { iConfigParams } from '../AppService';
import iClipboardSyncMessage from '../../types/Clipboard/iClipboardSyncMessage';
import Toaster from '../Toaster';

const endPoint = '/clipboard/syncMusic';

/**
 * Triggers a manual music sync operation for a specific team or all teams
 * Sends a POST request to /clipboard/syncMusic
 * 
 * @param teamId Optional team ID to sync. If not provided, syncs all teams
 * @param params Optional additional query/body parameters
 * @param config Optional axios configuration
 * @returns Promise<iClipboardSyncMessage> with sync job status
 */
const triggerSync = async (
  teamId?: string | number,
  params: iConfigParams = {},
  config?: iConfigParams
): Promise<iClipboardSyncMessage> => {
  try {
    const payload = teamId ? { teamId, ...params } : params;
    const response = await AppService.post(
      endPoint,
      payload,
      config
    );
    return response.data as iClipboardSyncMessage;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 
                         error?.message || 
                         'Failed to trigger music sync';
    Toaster.error(errorMessage);
    throw error;
  }
};

/**
 * Polls the status of an ongoing music sync job
 * Sends a GET request to /clipboard/syncMusic/:messageId
 * 
 * @param messageId The sync job message ID to poll
 * @param params Optional additional query parameters
 * @param config Optional axios configuration
 * @returns Promise<iClipboardSyncMessage> with updated sync job status
 */
const pollSyncStatus = async (
  messageId: number,
  params: iConfigParams = {},
  config?: iConfigParams
): Promise<iClipboardSyncMessage> => {
  try {
    const response = await AppService.get(
      `${endPoint}/${messageId}`,
      params,
      config
    );
    return response.data as iClipboardSyncMessage;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 
                         error?.message || 
                         'Failed to get sync status';
    Toaster.error(errorMessage);
    throw error;
  }
};

const ClipboardMusicSyncService = {
  triggerSync,
  pollSyncStatus,
};

export default ClipboardMusicSyncService;
