import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iPaginatedResult from '../../types/iPaginatedResult';
import {
  iRecordType,
  iStudentAbsence,
  STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT, STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN,
} from '../../types/StudentAbsence/iStudentAbsence';
import iMessage from '../../types/Message/iMessage';

const endPoint = '/studentAbsence';

const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iStudentAbsence>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const get = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsence> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const create = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsence> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const update = (id: number | string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsence> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const remove = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iStudentAbsence> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const submitByParent = (params: iConfigParams, config?: AxiosRequestConfig): Promise<iMessage> => {
  return appService.post(`${endPoint}/parentSubmission`, params, config).then(({data}) => data);
}

const getAbsenceTypeName = (type: iRecordType) => {
  if(type === STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT) {
    return 'Early Sign-outs';
  }
  if(type === STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN) {
    return 'Late Sign-ins';
  }
  return 'unknow';
}

const StudentAbsenceService =  {
  getAll,
  get,
  create,
  update,
  remove,
  getAbsenceTypeName,
  submitByParent,
}

export default StudentAbsenceService;
