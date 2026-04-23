import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVDebtor from '../../../types/Synergetic/Finance/iSynVDebtor';


const endPoint = '/syn/vDebtor'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDebtor>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynVDebtorService = {
  getAll,
};

export default SynVDebtorService;
