import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynConfigUserGroup from '../../types/Synergetic/iSynConfigUserGroup';

const endPoint = '/syn/configUserGroup';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynConfigUserGroup>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynConfigUserGroupService = {
  getAll,
};

export default SynConfigUserGroupService;
