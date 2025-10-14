import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynPVCommunity from '../../../types/Synergetic/Community/iSynPVCommunity';

const endPoint = `/syn/pvCommunity`;
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynPVCommunity>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynPVCommunityService = {
  getAll
}

export default SynPVCommunityService;
