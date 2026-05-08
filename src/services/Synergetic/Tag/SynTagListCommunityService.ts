import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynTagListCommunity from '../../../types/Synergetic/iSynTagListCommunity';

const endPoint = '/syn/tagListCommunity';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynTagListCommunity>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynTagListCommunityService = {
  getAll,
};

export default SynTagListCommunityService;
