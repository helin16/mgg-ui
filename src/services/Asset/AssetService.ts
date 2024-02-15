import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iAsset from '../../types/asset/iAsset';

export const HEADER_NAME_ASSET_TYPE = 'X-MGGS-ASSET-TYPE';

const endPoint = '/asset';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iAsset>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const upload = (params: iConfigParams = {}, config?: iConfigParams): Promise<iAsset> => {
  return AppService.post(`${endPoint}/upload`, params, config).then(resp => resp.data);
}


const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iAsset> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const AssetService = {
  upload,
  getAll,
  deactivate,
}

export default AssetService;
