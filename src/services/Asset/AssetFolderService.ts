import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iAssetFolder from '../../types/asset/iAssetFolder';

const endPoint = '/assetFolder';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iAssetFolder> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iAssetFolder>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iAssetFolder> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iAssetFolder> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const AssetFolderService = {
  create,
  update,
  getAll,
  deactivate,
}

export default AssetFolderService;
