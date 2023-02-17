import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iBTExcludeCode from '../../types/BudgetTacker/iBTExcludeCode';

const endPoint = '/bt/glExcludeCodes'
const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iBTExcludeCode[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const create = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iBTExcludeCode> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const deactivate = (id: number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<{ success: boolean }> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const BTExcludeGLService = {
  getAll,
  create,
  deactivate,
}
export default BTExcludeGLService;
