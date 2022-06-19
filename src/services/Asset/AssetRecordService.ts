import AppService, {iConfigParams} from '../AppService';
import iSynCommunity from '../../types/Synergetic/iSynCommunity';
import iPaginatedResult from '../../types/iPaginatedResult';
import iAssetRecord from '../../types/asset/iAssetRecord';

const getAssetRecords = (params: iConfigParams = {}): Promise<iPaginatedResult<iAssetRecord>> => {
  return AppService.get(`/assetRecord`, params).then(resp => resp.data);
};

const AssetRecordService = {
  getAssetRecords
}

export default AssetRecordService;
