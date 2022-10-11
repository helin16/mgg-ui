import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iModule from '../../types/modules/iModule';

const getModule = (moduleId: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iModule> => {
  return appService.get(`/syn/mggsModule/${moduleId}`, params, config).then(({data}) => data);
};

const updateModule = (moduleId: number | string, params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iModule> => {
  return appService.put(`/syn/mggsModule/${moduleId}`, params, config).then(({data}) => data);
};

const MggsModuleService = {
  getModule,
  updateModule,
};

export default MggsModuleService;
