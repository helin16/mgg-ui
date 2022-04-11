import AppService, {iConfigParams} from '../AppService';
import iStudentContact from '../../types/student/iStudentContact';

const getStudentContacts = (params: iConfigParams = {}): Promise<iStudentContact[]> => {
  return AppService.get(`/studentContact`, params).then(resp => resp.data);
};

const StudentContactService = {
  getStudentContacts
}

export default StudentContactService;
