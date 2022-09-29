import AppService, {iConfigParams} from '../AppService';
import iVStudent from '../../types/Synergetic/iVStudent';

const endPoint = '/syn/vStudent';
const searchVStudents = (searchTxt: string, params: iConfigParams = {}): Promise<iVStudent[]> => {
  return AppService.get(endPoint, {...params, searchTxt}).then(resp => resp.data);
};

const getCurrentVStudents = (params: iConfigParams = {}): Promise<iVStudent[]> => {
  return AppService.get(`${endPoint}/current/`, params).then(resp => resp.data);
};

const getCurrentVStudent = (synId: string | number, params: iConfigParams = {}): Promise<iVStudent> => {
  return AppService.get(`${endPoint}/current/${synId}`, params).then(resp => resp.data);
};

const SynVStudentService = {
  getCurrentVStudents,
  searchVStudents,
  getCurrentVStudent,
}

export default SynVStudentService;
