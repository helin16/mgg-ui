import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iMggAppDevice from '../../types/Settings/iMggAppDevice';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/appDevice';

const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iMggAppDevice>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const get = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggAppDevice> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const create = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggAppDevice> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const update = (id: number | string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggAppDevice> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const deactivate = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iMggAppDevice> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const MggAppDeviceService = {
  getAll,
  get,
  create,
  update,
  deactivate,
}

export default MggAppDeviceService;
