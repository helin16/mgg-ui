import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDonorReceiptService from '../../../../services/Synergetic/Finance/SynDonorReceiptService';

describe('SynDonorReceiptService', () => {
  ServiceTestHelper.testCustom({
    name: 'genPDF',
    serviceFn: SynDonorReceiptService.genPDF,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/donationReceipt/genPDF"),
  });
  ServiceTestHelper.testCustom({
    name: 'sendEmail',
    serviceFn: SynDonorReceiptService.sendEmail,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/donationReceipt/email"),
  });
});
