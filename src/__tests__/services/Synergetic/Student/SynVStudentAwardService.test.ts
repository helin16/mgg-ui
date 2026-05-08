import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentAwardService from '../../../../services/Synergetic/Student/SynVStudentAwardService';

describe('SynVStudentAwardService', () => {
  const endPoint = '/syn/vStudentAward';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentAwardService.getAll);
});
