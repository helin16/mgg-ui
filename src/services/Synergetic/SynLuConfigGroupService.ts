import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynLuConfigGroup from '../../types/Synergetic/iSynLuConfigGroup';

const endPoint = '/syn/luConfigGroup';

const getAll = (
  params: iConfigParams = {},
  config?: iConfigParams
): Promise<iPaginatedResult<iSynLuConfigGroup>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynLuConfigGroupService = {getAll};

export default SynLuConfigGroupService;
