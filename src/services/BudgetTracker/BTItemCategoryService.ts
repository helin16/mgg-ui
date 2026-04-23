import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iBTItemCategory from '../../types/BudgetTacker/iBTItemCategory';

const endPoint = '/bt/itemCategory'
const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iBTItemCategory[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const create = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iBTItemCategory> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};


const update = (id: number, params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iBTItemCategory> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const deactivate = (id: number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iBTItemCategory> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const BTItemCategoryService = {
  getAll,
  create,
  update,
  deactivate,
};

export default BTItemCategoryService;
