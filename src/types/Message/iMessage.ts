import iBaseType from '../iBaseType';

export const MESSAGE_TYPE_CRON_JOBS_OPEROO_SAFETY_DOWNLOADER = 'CRON_JOBS_OPEROO_SAFETY_DOWNLOADER';
export const MESSAGE_TYPE_TIME_TABLE_IMPORT = 'TIME_TABLE_IMPORT';
export const MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST = 'FUNNEL_DOWNLOAD_LATEST';

export const MESSAGE_TYPE_TERM_ROLLING = 'TERM_ROLLING';

export const MESSAGE_STATUS_NEW = 'NEW';
export const MESSAGE_STATUS_WIP = 'PROCESSING';
export const MESSAGE_STATUS_SUCCESS = 'SUCCESS';
export const MESSAGE_STATUS_FAILED = 'FAILED';

type iMessage = iBaseType & {
  type: string;
  status?: string;
  request?: any;
  response?: any;
  error?: any;
  requestCheckSum?: string;
}

export default iMessage;
