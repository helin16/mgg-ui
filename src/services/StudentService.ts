import AppService, {iConfigParams} from './AppService';
import iVStudent from '../types/student/iVStudent';

const searchStudents = (searchTxt: string, params: iConfigParams = {}): Promise<iVStudent[]> => {
  return AppService.get(`/student`, {...params, searchTxt}).then(resp => resp.data);
};

const StudentService = {
  searchStudents
}

export default StudentService;
