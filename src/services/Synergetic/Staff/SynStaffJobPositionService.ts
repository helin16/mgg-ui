import AppService, {iConfigParams} from '../../AppService';
import iSynStaffJobPosition from '../../../types/Synergetic/Staff/iSynStaffJobPosition';
import iPaginatedResult from '../../../types/iPaginatedResult';

const endPoint = `/syn/staffJobPosition`;
const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynStaffJobPosition>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynStaffJobPositionService = {
  getAll
}

export default SynStaffJobPositionService;
