import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentCoCurricularService from '../../../../services/Synergetic/Student/SynVStudentCoCurricularService';

describe('SynVStudentCoCurricularService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentCoCurricularService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentCoCurricular", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
