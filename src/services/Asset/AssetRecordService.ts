import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iAssetRecord from '../../types/asset/iAssetRecord';
import iAssetHandOverHistory from '../../types/asset/iAssetHandoverHistory';

const endPoint = '/assetRecord';

const getAssetRecords = (params: iConfigParams = {}): Promise<iPaginatedResult<iAssetRecord>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};


const pickup = (id: string, params = {}): Promise<iAssetHandOverHistory> => {
  return AppService.put(`${endPoint}/${id}/pickup`, params).then(resp => resp.data);
};

const AssetRecordService = {
  getAssetRecords,
  pickup,
}

export default AssetRecordService;
