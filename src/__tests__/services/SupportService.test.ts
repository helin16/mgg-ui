import ServiceTestHelper from '../helper/ServiceTestHelper';
import SupportService from '../../services/SupportService';

describe('SupportService', () => {
  ServiceTestHelper.testCustom({
    name: 'reportIssue',
    serviceFn: SupportService.reportIssue,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/support/email", {"fakeParams":"value"}],
  });
});
