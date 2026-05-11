import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDonorReceiptService from '../../../../services/Synergetic/Finance/SynVDonorReceiptService';

describe('SynVDonorReceiptService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVDonorReceiptService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/vDonorReceipt"),
  });
});
