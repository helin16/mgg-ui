import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVDonorReceipt from '../../../types/Synergetic/Finance/iSynVDonorReceipt';


const endPoint = '/syn/vDonorReceipt';
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDonorReceipt>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynVDonorReceiptService = {
  getAll,
};

export default SynVDonorReceiptService;
