import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVStudentAttendanceHistory from '../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory';

const endPoint = '/syn/vStudentAttendanceHistory';
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynVStudentAttendanceHistory>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVStudentAttendanceHistoryService = {
  getAll
}

export default SynVStudentAttendanceHistoryService;
