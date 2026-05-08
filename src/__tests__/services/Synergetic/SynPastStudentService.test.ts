import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynPastStudentService from '../../../services/Synergetic/SynPastStudentService';

describe('SynPastStudentService', () => {
  const endPoint = '/syn/pastStudent';

  ServiceTestHelper.testGetAll(endPoint, SynPastStudentService.getAll);
});
