import AppService, {iConfigParams} from '../../AppService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import iPaginatedResult from '../../../types/iPaginatedResult';

const endPoint = `/syn/community`;
const getCommunityProfiles = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynCommunity>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynCommunityService = {
  getCommunityProfiles
}

export default SynCommunityService;
