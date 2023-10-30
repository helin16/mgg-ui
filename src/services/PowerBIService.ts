import AppService, {iConfigParams} from './AppService';
import {iPowerBIReportListItem} from '../types/PowerBI/iPowerBIReportList';
import iPaginatedResult from '../types/iPaginatedResult';
import iPowerBIReport from '../types/PowerBI/iPowerBIReport';
import {AxiosRequestConfig} from 'axios';


const endPoint = '/powerBI';
const getAccessToken = (): Promise<{accessToken: string}> => {
  return AppService.post(`${endPoint}/accessToken`, {}).then(resp => resp.data);
}

const getMSReports = (): Promise<iPowerBIReportListItem[]> => {
  return AppService.get(`${endPoint}/ms`, {}).then(resp => resp.data).then(resp => resp.value);
}

const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iPowerBIReport>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const getById = (id: string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPowerBIReport> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const create = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iPowerBIReport> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const update = (id: string, params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iPowerBIReport> => {
  return AppService.put(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const deactiveate = (id: string, params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iPowerBIReport> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const PowerBIService = {
  getAccessToken,
  getMSReports,
  getAll,
  getById,
  create,
  update,
  deactiveate,
}

export default PowerBIService;
