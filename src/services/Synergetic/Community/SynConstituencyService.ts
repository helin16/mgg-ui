import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynConstituency from '../../../types/Synergetic/Community/iSynConstituency';

const endPoint = `/syn/constituency`;
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynConstituency>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynConstituencyService = {
  getAll,
}

export default SynConstituencyService;
