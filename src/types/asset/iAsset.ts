import iBaseType from '../iBaseType';

type iAsset = iBaseType & {
  filePath: string;
  type: string;
  fileName: string;
  comments?: string;
  downloadUrl: string;
};

export default iAsset;
