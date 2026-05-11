import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentContactsCurrentPastFutureCombinedService from '../../../../services/Synergetic/Student/SynVStudentContactsCurrentPastFutureCombinedService';

describe('SynVStudentContactsCurrentPastFutureCombinedService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentContactsCurrentPastFutureCombinedService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudentContactsCurrentPastFutureCombined"),
  });
});
