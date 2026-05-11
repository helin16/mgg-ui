import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynUStudentGiftedSummaryService from '../../../services/Synergetic/SynUStudentGiftedSummaryService';

describe('SynUStudentGiftedSummaryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynUStudentGiftedSummaryService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/uStudentGiftedSummary"),
  });
});
