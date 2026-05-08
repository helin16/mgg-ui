import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iHouseAwardStudentYear from '../../types/HouseAwards/iHouseAwardStudentYear';

const endPoint = '/houseAwards/studentYear';

const getStudentYears = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardStudentYear[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const getStudentYear = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardStudentYear> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const createStudentYear = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardStudentYear> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const updateStudentYear = (id: number | string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardStudentYear> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const deleteStudentYear = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardStudentYear> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const HouseAwardStudentYearService = {
  getStudentYears,
  getStudentYear,
  createStudentYear,
  updateStudentYear,
  deleteStudentYear,
};

export default HouseAwardStudentYearService;
