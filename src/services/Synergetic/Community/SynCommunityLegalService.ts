import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynCommunityLegal from '../../../types/Synergetic/Community/iSynCommunityLegal';

const endPoint = '/syn/communityLegal';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynCommunityLegal>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynCommunityLegalService = {
  getAll,
};

export default SynCommunityLegalService;
