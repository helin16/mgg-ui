import AppService, {iConfigParams} from '../AppService';
import iSynSubjectClass from '../../types/Synergetic/iSynSubjectClass';
import IPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/syn/subjectClass';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<IPaginatedResult<iSynSubjectClass>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynSubjectClassService = {
  getAll
}

export default SynSubjectClassService;
