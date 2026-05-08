import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDonorReceiptService from '../../../../services/Synergetic/Finance/SynDonorReceiptService';

describe('SynDonorReceiptService', () => {
  const endPoint = '/syn/donationReceipt';

  ServiceTestHelper.testCustom({
    name: 'genPDF',
    serviceFn: SynDonorReceiptService.genPDF,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/donationReceipt/genPDF", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'sendEmail',
    serviceFn: SynDonorReceiptService.sendEmail,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/donationReceipt/email", {"fakeParams":"value"}],
  });
});
