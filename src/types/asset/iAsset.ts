import iBaseType from '../iBaseType';

export const ASSET_TYPE_CAMPUS_DISPLAY = 'CAMPUS_DISPLAY';
export const ASSET_TYPE_EMAIL_TEMPLATE = 'EMAIL_TEMPLATE';
export const ASSET_TYPE_TEMP = 'TMP';
export const ASSET_TYPE_DELETE_AFTER_DOWNLOAD = 'DELETE_AFTER_DOWNLOAD';

type iAsset = iBaseType & {
  filePath: string;
  type: string;
  fileName: string;
  mimeType: string;
  fileSize?: number | null;
  comments?: string | null;
  url?: string | null;
  downloadUrl?: string;
  externalObj?: any | null;
  externalId?: string | null;
};

export default iAsset;
