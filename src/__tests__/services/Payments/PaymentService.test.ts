import ServiceTestHelper from '../../helper/ServiceTestHelper';
import PaymentService from '../../../services/Payments/PaymentService';

describe('PaymentService', () => {
  const endPoint = '/cp';

  ServiceTestHelper.testCustom({
    name: 'getWestpacSettings',
    serviceFn: PaymentService.getWestpacSettings,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cp/westpac", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'makeADonation',
    serviceFn: PaymentService.makeADonation,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cp/donation", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
