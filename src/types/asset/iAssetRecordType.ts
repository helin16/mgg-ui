import iBaseType from '../iBaseType';

type iAssetRecordType = iBaseType & {
  externalId: string;
  name: string;
  originalJson?: any;
}

export default iAssetRecordType;
