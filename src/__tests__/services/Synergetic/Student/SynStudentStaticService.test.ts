import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStudentStaticService from '../../../../services/Synergetic/Student/SynStudentStaticService';

describe('SynStudentStaticService', () => {
  const endPoint = '/syn/studentStatic';

  ServiceTestHelper.testGetAll(endPoint, SynStudentStaticService.getAll);
});
