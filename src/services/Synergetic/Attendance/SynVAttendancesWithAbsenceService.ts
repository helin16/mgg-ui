import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVAttendancesWithAbsence from '../../../types/Synergetic/Attendance/iSynVAttendancesWithAbsence';

const endPoint = '/syn/vAttendancesWithAbsence';
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynVAttendancesWithAbsence>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVAttendancesWithAbsenceService = {
  getAll
}

export default SynVAttendancesWithAbsenceService;
