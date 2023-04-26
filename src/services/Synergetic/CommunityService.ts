import AppService, {iConfigParams} from '../AppService';
import iSynCommunity from '../../types/Synergetic/iSynCommunity';
import iPaginatedResult from '../../types/iPaginatedResult';

const getCommunityProfiles = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynCommunity>> => {
  return AppService.get(`/community`, params, options).then(resp => resp.data);
};

const CommunityService = {
  getCommunityProfiles
}

export default CommunityService;
