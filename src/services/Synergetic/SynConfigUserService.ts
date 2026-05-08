import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynConfigUser from '../../types/Synergetic/iSynConfigUser';

const endPoint = '/syn/configUser';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynConfigUser>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynConfigUserService = {
  getAll,
};

export default SynConfigUserService;
