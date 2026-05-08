import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStudentYearService from '../../../../services/Synergetic/Student/SynStudentYearService';

describe('SynStudentYearService', () => {
  const endPoint = '/syn/studentYear';

  ServiceTestHelper.testGetAll(endPoint, SynStudentYearService.getAll);
});
