import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStudentClassesHistoryService from '../../../../services/Synergetic/Student/SynStudentClassesHistoryService';

describe('SynStudentClassesHistoryService', () => {
  const endPoint = '/syn/studentClassesHistory';

  ServiceTestHelper.testGetAll(endPoint, SynStudentClassesHistoryService.getAll);
});
