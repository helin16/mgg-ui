import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynSubjectClassService from '../../../services/Synergetic/SynSubjectClassService';

describe('SynSubjectClassService', () => {
  const endPoint = '/syn/subjectClass';

  ServiceTestHelper.testGetAll(endPoint, SynSubjectClassService.getAll);
});
