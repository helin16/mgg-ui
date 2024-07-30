import AppService from '../../AppService';
import iAsset from '../../../types/asset/iAsset';
import iMessage from '../../../types/Message/iMessage';

type iPDFParams = {
  fundCodes?: string[];
  donorId: number | string;
  fromDate: string;
  toDate: string;
  receiptNumbers: (number | string)[];
}

const endPoint = '/syn/donationReceipt';
const genPDF =  (params: iPDFParams): Promise<iAsset> => {
  return AppService.post(`${endPoint}/genPDF`, params).then(resp => resp.data);
};

const sendEmail =  (params: iPDFParams & {to: string}): Promise<iMessage> => {
  return AppService.post(`${endPoint}/email`, params).then(resp => resp.data);
};

const SynDonorReceiptService = {
  genPDF,
  sendEmail,
};

export default SynDonorReceiptService;
