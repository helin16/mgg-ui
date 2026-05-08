import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynOnlineDonationService from '../../../services/Payments/SynOnlineDonationService';

describe('SynOnlineDonationService', () => {
  const endPoint = '/syn/onlineDonation';

  ServiceTestHelper.testGetAll(endPoint, SynOnlineDonationService.getAll);
});
