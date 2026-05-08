import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentParentService from '../../../../services/Synergetic/Student/SynVStudentParentService';

describe('SynVStudentParentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentParentService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentParent", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
