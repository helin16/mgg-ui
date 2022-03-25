import AppService, {iConfigParams} from './AppService';

const searchStudents = (searchTxt: string, params: iConfigParams = {}) => {
  return AppService.get(`/student`, {...params, searchTxt}).then(resp => resp.data);
};

const StudentService = {
  searchStudents
}

export default StudentService;
