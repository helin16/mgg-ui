import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iMggApp from '../../types/Settings/iMggApp';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/app';

const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iMggApp>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const get = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggApp> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const create = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggApp> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const update = (id: number | string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggApp> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const deactivate = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggApp> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const MggAppService = {
  getAll,
  get,
  create,
  update,
  deactivate,
}

export default MggAppService;
