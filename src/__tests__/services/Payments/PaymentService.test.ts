import ServiceTestHelper from '../../helper/ServiceTestHelper';
import PaymentService from '../../../services/Payments/PaymentService';

describe('PaymentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getWestpacSettings',
    serviceFn: PaymentService.getWestpacSettings,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/cp/westpac"),
  });
  ServiceTestHelper.testCustom({
    name: 'makeADonation',
    serviceFn: PaymentService.makeADonation,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/cp/donation"),
  });
});
