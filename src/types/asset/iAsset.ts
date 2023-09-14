import iBaseType from '../iBaseType';

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
