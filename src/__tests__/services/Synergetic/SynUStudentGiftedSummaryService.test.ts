import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynUStudentGiftedSummaryService from '../../../services/Synergetic/SynUStudentGiftedSummaryService';

describe('SynUStudentGiftedSummaryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynUStudentGiftedSummaryService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/uStudentGiftedSummary", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
