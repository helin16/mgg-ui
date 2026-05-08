import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynOnlineDonationService from '../../../services/Payments/SynOnlineDonationService';

describe('SynOnlineDonationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynOnlineDonationService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/onlineDonation", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
