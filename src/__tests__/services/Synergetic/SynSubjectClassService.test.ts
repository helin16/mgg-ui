import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynSubjectClassService from '../../../services/Synergetic/SynSubjectClassService';

describe('SynSubjectClassService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynSubjectClassService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/subjectClass", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
