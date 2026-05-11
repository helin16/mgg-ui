import ServiceTestHelper from '../helper/ServiceTestHelper';
import SupportService from '../../services/SupportService';

describe('SupportService', () => {
  ServiceTestHelper.testCustom({
    name: 'reportIssue',
    serviceFn: SupportService.reportIssue,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/support/email"),
  });
});
