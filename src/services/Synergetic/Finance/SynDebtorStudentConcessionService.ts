import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynDebtorStudentConcession from '../../../types/Synergetic/Finance/iSynDebtorStudentConcession';


const endPoint = '/syn/debtorStudentConcession'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynDebtorStudentConcession>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynDebtorStudentConcessionService = {
  getAll,
};

export default SynDebtorStudentConcessionService;
