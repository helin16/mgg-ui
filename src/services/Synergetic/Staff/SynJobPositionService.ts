import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynJobPosition from '../../../types/Synergetic/Staff/iSynJobPosition';

const endPoint = `/syn/jobPosition`;
const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynJobPosition>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynStaffJobPositionService = {
  getAll
}

export default SynStaffJobPositionService;
