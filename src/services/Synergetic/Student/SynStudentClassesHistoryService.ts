import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynStudentClassesHistory from '../../../types/Synergetic/Student/iSynStudentClassesHistory';

const endPoint = '/syn/studentClassesHistory';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynStudentClassesHistory>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynStudentClassesHistoryService = {
  getAll,
};

export default SynStudentClassesHistoryService;
