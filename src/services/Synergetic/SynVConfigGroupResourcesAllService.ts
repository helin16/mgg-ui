import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynVConfigGroupResourcesAll from '../../types/Synergetic/iSynVConfigGroupResourcesAll';

const endPoint = '/syn/vConfigGroupResourcesAll';

const getAll = (
  params: iConfigParams = {},
  config?: iConfigParams
): Promise<iPaginatedResult<iSynVConfigGroupResourcesAll>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVConfigGroupResourcesAllService = {
  getAll,
};

export default SynVConfigGroupResourcesAllService;
