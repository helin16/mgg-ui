import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynStudentYear from '../../../types/Synergetic/Student/iSynStudentYear';

const endPoint = '/syn/studentYear';
const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynStudentYear>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynStudentYearService = {
  getAll
}

export default SynStudentYearService;
