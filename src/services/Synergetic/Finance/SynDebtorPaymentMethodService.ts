import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynDebtorPaymentMethod from '../../../types/Synergetic/Finance/iSynDebtorPaymentMethod';


const endPoint = '/syn/debtorPaymentMethod'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynDebtorPaymentMethod>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};
const getAllCurrent =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynDebtorPaymentMethod>> => {
  return AppService.get(`${endPoint}/current`, params).then(resp => resp.data);
};

const SynDebtorPaymentMethodService = {
  getAll,
  getAllCurrent,
};

export default SynDebtorPaymentMethodService;
