
import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynOnlineDonation from '../../types/Synergetic/Finance/iSynOnlineDonation';

const endPoint = '/syn/onlineDonation';

const getAll = (params?: iConfigParams, options?: iConfigParams): Promise<iPaginatedResult<iSynOnlineDonation>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
}

const SynOnlineDonationService = {
  getAll,
}

export default SynOnlineDonationService;
