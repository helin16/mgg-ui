import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentAwardService from '../../../../services/Synergetic/Student/SynVStudentAwardService';

describe('SynVStudentAwardService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentAwardService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentAward", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
