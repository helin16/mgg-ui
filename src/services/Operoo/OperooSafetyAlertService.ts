import appService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iOperooSafetyAlert from '../../types/Operoo/iOperooSafetyAlert';
import {AxiosRequestConfig} from 'axios';

const getOperooSafetyAlerts = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iOperooSafetyAlert>> => {
  return appService.get('/operoo/safetyAlert', params, config).then(({data}) => data);
}

const ignoreOperooSafetyAlert = (id: string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iOperooSafetyAlert> => {
  return appService.put(`/operoo/safetyAlert/${id}/ignore`, params, config).then(({data}) => data);
}

const OperooSafetyAlertService = {
  getOperooSafetyAlerts,
  ignoreOperooSafetyAlert,
}

export default OperooSafetyAlertService
