import AppService, {iConfigParams} from '../../AppService';
import IPaginatedResult from '../../../types/iPaginatedResult';
import iSynVStudentClass from '../../../types/Synergetic/iSynVStudentClass';



const endPoint = '/syn/vStudentClass';
const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<IPaginatedResult<iSynVStudentClass>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVStudentClassService = {
  getAll,
}

export default SynVStudentClassService;
