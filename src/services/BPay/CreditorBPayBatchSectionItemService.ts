import iCreditorBPayBatchSectionItem from '../../types/BPay/iCreditorBPayBatchSectionItem';
import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/cBPay/batchSectionItem';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatchSectionItem> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const get = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatchSectionItem> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatchSectionItem>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const getBySectionId = (sectionId: string | number, params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iCreditorBPayBatchSectionItem>> => {
  return getAll({
    perPage: 9999999,
    where: JSON.stringify({
      sectionId,
    }),
    ...params,
  }, config);
}

const update = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iCreditorBPayBatchSectionItem> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iCreditorBPayBatchSectionItem> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const CreditorBPayBatchSectionItemService = {
  create,
  update,
  getAll,
  getBySectionId,
  get,
  deactivate,
}

export default CreditorBPayBatchSectionItemService;
