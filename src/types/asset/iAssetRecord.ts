import iBaseType from '../iBaseType';
import iAssetRecordType from './iAssetRecordType';
import iSynCommunity from '../Synergetic/iSynCommunity';

type iAssetRecord = iBaseType & {
  name: string;
  description: string;
  synId?: number | null;
  assetTag: string;
  status: string;
  externalId?: string;
  assetTypeId: string;
  originalJson: any;
  AssetRecordType?: iAssetRecordType;
  SynCommunity?: iSynCommunity;
};

export default iAssetRecord;
