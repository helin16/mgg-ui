import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iEmailTemplate from '../../types/Email/iEmailTemplate';

const endPoint = '/emailTemplate';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iEmailTemplate>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const getById = (id: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iEmailTemplate> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const create = (params: iConfigParams, config?: iConfigParams): Promise<iEmailTemplate> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams, config?: iConfigParams): Promise<iEmailTemplate> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iEmailTemplate> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const EmailTemplateService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
}

export default EmailTemplateService;
