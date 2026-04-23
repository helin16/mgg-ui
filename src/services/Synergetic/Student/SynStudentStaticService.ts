import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynStudentStatics from '../../../types/Synergetic/Student/iSynStudentStatics';

const endPoint = '/syn/studentStatic';
const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynStudentStatics>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVStudentService = {
  getAll
}

export default SynVStudentService;
