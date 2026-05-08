import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynCommunityConsent from '../../../types/Synergetic/Community/iSynCommunityConsent';

const endPoint = '/syn/communityConsent';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynCommunityConsent>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynCommunityConsentService = {
  getAll,
};

export default SynCommunityConsentService;
