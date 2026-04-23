import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynCommunityConsent from '../../../types/Synergetic/Community/iSynCommunityConsent';

const endPoint = `/syn/communityConsent`;
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynCommunityConsent>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynCommunityConsentService = {
  getAll
}

export default SynCommunityConsentService;
