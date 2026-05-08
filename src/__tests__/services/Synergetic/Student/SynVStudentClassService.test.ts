import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentClassService from '../../../../services/Synergetic/Student/SynVStudentClassService';

describe('SynVStudentClassService', () => {
  const endPoint = '/syn/vStudentClass';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentClassService.getAll);
});
