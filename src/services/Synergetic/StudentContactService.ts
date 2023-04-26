import AppService, {iConfigParams} from '../AppService';
import iStudentContact from '../../types/Synergetic/iStudentContact';
import iPaginatedResult from '../../types/iPaginatedResult';

const getStudentContacts = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iStudentContact>> => {
  return AppService.get(`/syn/studentContact`, params, options).then(resp => resp.data);
};

const StudentContactService = {
  getStudentContacts
}

export default StudentContactService;
