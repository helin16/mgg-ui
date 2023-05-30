import AppService, {iConfigParams} from '../AppService';
import iVStudent, {iVPastAndCurrentStudent, iVPastStudent} from '../../types/Synergetic/iVStudent';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/syn/vStudent';
const searchVStudents = (searchTxt: string, params: iConfigParams = {}): Promise<iVStudent[]> => {
  return AppService.get(endPoint, {...params, searchTxt}).then(resp => resp.data);
};

const getCurrentVStudents = (params: iConfigParams = {}, config?: iConfigParams): Promise<iVStudent[]> => {
  return AppService.get(`${endPoint}/current/`, params, config).then(resp => resp.data);
};

const getCurrentVStudent = (synId: string | number, params: iConfigParams = {}): Promise<iVStudent> => {
  return AppService.get(`${endPoint}/current/${synId}`, params).then(resp => resp.data);
};

const getVStudentAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iVStudent>> => {
  return AppService.get(`${endPoint}/all`, params).then(resp => resp.data);
};

const getVPastStudentAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iVPastStudent>> => {
  return AppService.get(`${endPoint}/pastAll`, params).then(resp => resp.data);
};

const getVPastAndCurrentStudentAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iVPastAndCurrentStudent>> => {
  return AppService.get(`${endPoint}/pastAndCurrentAll`, params).then(resp => resp.data);
};

const SynVStudentService = {
  getCurrentVStudents,
  searchVStudents,
  getCurrentVStudent,
  getVStudentAll,
  getVPastStudentAll,
  getVPastAndCurrentStudentAll,
}

export default SynVStudentService;
