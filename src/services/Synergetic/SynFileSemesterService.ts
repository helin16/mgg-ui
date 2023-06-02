import AppService, {iConfigParams} from '../AppService';
import iSynFileSemester from '../../types/Synergetic/iSynFileSemester';

const endPoint = `/syn/fileSemester`;
const getFileSemesters = (params: iConfigParams = {}, options?: iConfigParams): Promise<iSynFileSemester[]> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const getSchoolDays = (params: iConfigParams = {}, options?: iConfigParams): Promise<string[]> => {
  return AppService.get(`${endPoint}/schoolDays`, params, options).then(resp => resp.data);
};

const SynFileSemesterService = {
  getSchoolDays,
  getFileSemesters,
}

export default SynFileSemesterService;
