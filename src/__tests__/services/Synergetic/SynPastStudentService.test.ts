import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynPastStudentService from '../../../services/Synergetic/SynPastStudentService';

describe('SynPastStudentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynPastStudentService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/pastStudent", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
