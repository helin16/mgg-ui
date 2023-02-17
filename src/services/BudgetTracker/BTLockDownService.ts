import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iBTLockDown from '../../types/BudgetTacker/iBTLockDown';

const endPoint = '/bt/lockDown'
const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iBTLockDown[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const create = (data: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iBTLockDown> => {
  return appService.post(endPoint, data, config).then(({data}) => data);
};

const BTLockDownService = {
  getAll,
  create,
};

export default BTLockDownService;
