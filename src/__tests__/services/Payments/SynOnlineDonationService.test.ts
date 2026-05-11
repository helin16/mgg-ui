import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynOnlineDonationService from '../../../services/Payments/SynOnlineDonationService';

describe('SynOnlineDonationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynOnlineDonationService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/onlineDonation"),
  });
});
