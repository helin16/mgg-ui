import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iAssetRecordType from '../../types/asset/iAssetRecordType';

const endPoint = '/assetRecordType';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iAssetRecordType>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const get = (id: string | number, params: iConfigParams = {}, config?: iConfigParams): Promise<iAssetRecordType> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
};

const AssetRecordTypeService = {
  getAll,
  get,
};

export default AssetRecordTypeService;
