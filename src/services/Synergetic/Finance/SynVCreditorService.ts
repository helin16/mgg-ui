import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVCreditor from '../../../types/Synergetic/Finance/iSynVCreditor';


const endPoint = '/syn/vCreditor'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVCreditor>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynVCreditorService = {
  getAll,
};

export default SynVCreditorService;
