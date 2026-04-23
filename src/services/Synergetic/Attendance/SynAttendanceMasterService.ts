import AppService, {iConfigParams} from '../../AppService';
import ISynAttendanceMaster from '../../../types/Synergetic/iSynAttendanceMaster';
import iPaginatedResult from '../../../types/iPaginatedResult';

const endPoint = '/syn/attendanceMaster';

const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<ISynAttendanceMaster>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynAttendanceMasterService = {
  getAll
}

export default SynAttendanceMasterService;
