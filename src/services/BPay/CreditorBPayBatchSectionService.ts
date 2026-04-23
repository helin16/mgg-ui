import iCreditorBPayBatchSection from '../../types/BPay/iCreditorBPayBatchSection';
import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/cBPay/batchSection';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatchSection> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const get = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatchSection> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatchSection>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const getByBatchId = (batchId: string | number, params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatchSection>> => {
  return getAll({
    perPage: 9999999,
    where: JSON.stringify({
      batchId,
    }),
    ...params,
  }, config);
}

const update = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatchSection> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCreditorBPayBatchSection> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CreditorBPayBatchSectionService = {
  create,
  update,
  getAll,
  getByBatchId,
  get,
  deactivate,
}

export default CreditorBPayBatchSectionService;
