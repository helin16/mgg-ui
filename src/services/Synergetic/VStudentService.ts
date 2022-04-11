import AppService, {iConfigParams} from '../AppService';
import iVStudent from '../../types/student/iVStudent';

const searchVStudents = (searchTxt: string, params: iConfigParams = {}): Promise<iVStudent[]> => {
  return AppService.get(`/vStudent`, {...params, searchTxt}).then(resp => resp.data);
};

const getCurrentVStudent = (synId: string | number, params: iConfigParams = {}): Promise<iVStudent> => {
  return AppService.get(`/vStudent/current/${synId}`, params).then(resp => resp.data);
};

const VStudentService = {
  searchVStudents,
  getCurrentVStudent,
}

export default VStudentService;
