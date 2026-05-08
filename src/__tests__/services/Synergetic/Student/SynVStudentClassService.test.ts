import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentClassService from '../../../../services/Synergetic/Student/SynVStudentClassService';

describe('SynVStudentClassService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentClassService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentClass", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
