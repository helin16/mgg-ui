import AppService, {iConfigParams} from '../AppService';
import iSynCommunity from '../../types/community/iSynCommunity';
import iPaginatedResult from '../../types/iPaginatedResult';

const getCommunityProfiles = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynCommunity>> => {
  return AppService.get(`/community`, params).then(resp => resp.data);
};

const CommunityService = {
  getCommunityProfiles
}

export default CommunityService;
