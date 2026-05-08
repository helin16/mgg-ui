import AppService, {iConfigParams} from './AppService';
import iPaginatedResult from '../types/iPaginatedResult';
import iAlumniRequest from '../types/Alumni/iAlumniRequest';

const endPoint = '/alumniRequest';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iAlumniRequest>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iAlumniRequest> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
};

const approve = (id: string | number, params: iConfigParams = {}, config?: iConfigParams): Promise<iAlumniRequest> => {
  return AppService.put(`${endPoint}/${id}/approve`, params, config).then(resp => resp.data);
};

const deactivate = (id: string | number, params?: iConfigParams, config?: iConfigParams): Promise<iAlumniRequest> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
};

const AlumniRequestService = {
  getAll,
  create,
  approve,
  deactivate,
};

export default AlumniRequestService;
