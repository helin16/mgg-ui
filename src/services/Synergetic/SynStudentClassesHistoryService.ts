import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynStudentClassesHistory from '../../types/Synergetic/iSynStudentClassesHistory';

const endPoint = '/syn/studentClassesHistory';

const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynStudentClassesHistory>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynStudentClassesHistoryService = {
  getAll
}

export default SynStudentClassesHistoryService;
