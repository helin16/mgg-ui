import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iPaginatedResult from '../../types/iPaginatedResult';
import iStudentAbsenceSchedule from '../../types/StudentAbsence/iStudentAbsenceSchedule';
import iMessage from '../../types/Message/iMessage';

const endPoint = '/studentAbsenceSchedule';

const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iStudentAbsenceSchedule>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const get = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsenceSchedule> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const create = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsenceSchedule> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const update = (id: number | string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsenceSchedule> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const remove = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsenceSchedule> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const scheduleForTomorrow = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iMessage> => {
  return appService.post(`${endPoint}/scheduleForTomorrow`, params, config).then(({data}) => data);
};

const StudentScheduledAbsenceService =  {
  getAll,
  get,
  create,
  update,
  remove,
  scheduleForTomorrow,
}

export default StudentScheduledAbsenceService;
