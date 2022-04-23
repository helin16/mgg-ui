import AppService, {iConfigParams} from '../AppService';
import iVStaff from '../../types/Synergetic/iVStaff';

const endPoint = '/syn/vStaff';
const getStaffList = (params: iConfigParams = {}): Promise<iVStaff> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
}

const SynVStaffService = {
  getStaffList,
};

export default SynVStaffService;

