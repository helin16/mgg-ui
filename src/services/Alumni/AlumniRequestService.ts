import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iAlumniRequest from '../../types/Alumni/iAlumniRequest';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/alumniRequest'
const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iAlumniRequest>> => {
  return appService.get(endPoint, {...params, page: params?.currentPage || 1}, config).then(({data}) => data);
};

const create = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iAlumniRequest> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const approve = (id: number, params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iAlumniRequest> => {
  return appService.put(`${endPoint}/${id}/approve`, params, config).then(({data}) => data);
};

const deactivate = (id: number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iAlumniRequest> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const AlumniRequestService = {
  getAll,
  approve,
  create,
  deactivate,
}

export default AlumniRequestService;
