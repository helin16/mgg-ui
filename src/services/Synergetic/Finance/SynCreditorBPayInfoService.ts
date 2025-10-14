import AppService, {iConfigParams} from '../../AppService';
import iSynCreditorBPayInfo from '../../../types/Synergetic/Finance/iSynCreditorBPayInfo';
import iPaginatedResult from '../../../types/iPaginatedResult';

const endPoint = '/syn/creditorBPayInfo';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynCreditorBPayInfo> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynCreditorBPayInfo>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iSynCreditorBPayInfo> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iSynCreditorBPayInfo> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const SynCreditorBPayInfoService = {
  create,
  update,
  getAll,
  deactivate,
}

export default SynCreditorBPayInfoService;
