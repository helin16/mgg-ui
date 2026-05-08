import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentParentService from '../../../../services/Synergetic/Student/SynVStudentParentService';

describe('SynVStudentParentService', () => {
  const endPoint = '/syn/vStudentParent';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentParentService.getAll);
});
