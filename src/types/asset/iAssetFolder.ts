import iBaseType from '../iBaseType';

export const ASSET_FOLDER_TYPE_CAMPUS_DISPLAY = 'CAMPUS_DISPLAY'

type iAssetFolder = iBaseType & {
  name: string;
  type: string;
  parentId?: string | null;
  path?: string | null;
  Parent?: iAssetFolder | null;
};

export default iAssetFolder;
