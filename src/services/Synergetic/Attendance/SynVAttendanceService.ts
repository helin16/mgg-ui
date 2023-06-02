import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVAttendance from '../../../types/Synergetic/Attendance/iSynVAttendance';

const endPoint = '/syn/vAttendance';
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynVAttendance>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVAttendanceService = {
  getAll
}

export default SynVAttendanceService;
