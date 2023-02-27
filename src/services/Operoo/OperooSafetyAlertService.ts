import appService, {iConfigParams, iParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iOperooSafetyAlert from '../../types/Operoo/iOperooSafetyAlert';
import {AxiosRequestConfig} from 'axios';
import iMessage from '../../types/Message/iMessage';

const endPoint = '/operoo/safetyAlert';
const getOperooSafetyAlerts = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iOperooSafetyAlert>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
}

const ignoreOperooSafetyAlert = (id: string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iOperooSafetyAlert> => {
  return appService.put(`${endPoint}/${id}/ignore`, params, config).then(({data}) => data);
}

const syncOperooSafetyAlert = (id: string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iOperooSafetyAlert> => {
  return appService.put(`${endPoint}/${id}/sync`, params, config).then(({data}) => data);
}

const refetchAlerts = (studentId: string | number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iOperooSafetyAlert[]> => {
  return appService.get(`/${endPoint}/refetch/${studentId}`, params, config).then(({data}) => data);
}

const downloadAlerts = (params: iParams = {}, config: AxiosRequestConfig = {}): Promise<iMessage> => {
  return appService.post(`${endPoint}/download`, params, config).then(({data}) => data);
}

const OperooSafetyAlertService = {
  getOperooSafetyAlerts,
  ignoreOperooSafetyAlert,
  syncOperooSafetyAlert,
  refetchAlerts,
  downloadAlerts,
}

export default OperooSafetyAlertService
