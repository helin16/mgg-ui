import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';


const endPoint = '/syn/generalLedger'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynGeneralLedger>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynGeneralLedgerService = {
  getAll,
};

export default SynGeneralLedgerService;
