import iCreditorBPayBatch from '../../types/BPay/iCreditorBPayBatch';
import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/cBPay/batch';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatch> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const get = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatch> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatch>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const getBatchList = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatch>> => {
  return getAll({
    perPage: 9999999,
    sort: 'createdAt:DESC',
    where: JSON.stringify({
      isActive: true,
    }),
    ...params,
  }, config);
}

const getWorking = async (params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatch | null> => {
  const resp = await getBatchList(params, config);
  const batches = resp.data || [];
  const unGenerated = batches.filter(batch => batch.generatedAt === null || `${batch.generatedAt || ''}`.trim() === '');
  return unGenerated.length > 0 ? unGenerated[0] : (batches.length > 0 ? batches[0] : null);
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
  getBatchList,
  getWorking,
  get,
  deactivate,
}

export default CreditorBPayBatchService;
