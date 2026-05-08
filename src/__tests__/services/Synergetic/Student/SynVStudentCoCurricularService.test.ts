import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentCoCurricularService from '../../../../services/Synergetic/Student/SynVStudentCoCurricularService';

describe('SynVStudentCoCurricularService', () => {
  const endPoint = '/syn/vStudentCoCurricular';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentCoCurricularService.getAll);
});
