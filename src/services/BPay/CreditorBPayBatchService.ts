import iCreditorBPayBatch from '../../types/BPay/iCreditorBPayBatch';
import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/cBPay/batch';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatch> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const get = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatch>> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatch>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatch> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCreditorBPayBatch> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CreditorBPayBatchService = {
  create,
  update,
  getAll,
  get,
  deactivate,
}

export default CreditorBPayBatchService;
