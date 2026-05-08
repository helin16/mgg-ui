import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentContactsCurrentPastFutureCombinedService from '../../../../services/Synergetic/Student/SynVStudentContactsCurrentPastFutureCombinedService';

describe('SynVStudentContactsCurrentPastFutureCombinedService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentContactsCurrentPastFutureCombinedService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentContactsCurrentPastFutureCombined", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
