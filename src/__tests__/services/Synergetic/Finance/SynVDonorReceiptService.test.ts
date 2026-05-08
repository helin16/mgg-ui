import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDonorReceiptService from '../../../../services/Synergetic/Finance/SynVDonorReceiptService';

describe('SynVDonorReceiptService', () => {
  const endPoint = '/syn/vDonorReceipt';

  ServiceTestHelper.testGetAll(endPoint, SynVDonorReceiptService.getAll);
});
