import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVDebtorStudentConcession from '../../../types/Synergetic/Finance/iSynVDebtorStudentConcession';


const endPoint = '/syn/vDebtorStudentConcession'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDebtorStudentConcession>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynDebtorPaymentMethodService = {
  getAll,
};

export default SynDebtorPaymentMethodService;
