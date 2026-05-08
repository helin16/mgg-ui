import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVStudentAttendanceHistory from '../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory';

const endPoint = '/syn/vStudentAttendanceHistory';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynVStudentAttendanceHistory>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVStudentAttendanceHistoryService = {
  getAll,
};

export default SynVStudentAttendanceHistoryService;
