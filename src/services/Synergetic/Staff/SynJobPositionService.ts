import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynJobPosition from '../../../types/Synergetic/Staff/iSynJobPosition';

const endPoint = '/syn/jobPosition';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynJobPosition>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynJobPositionService = {
  getAll,
};

export default SynJobPositionService;
