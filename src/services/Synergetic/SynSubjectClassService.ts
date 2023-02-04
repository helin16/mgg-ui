import AppService, {iConfigParams} from '../AppService';
import iSynSubjectClass from '../../types/Synergetic/iSynSubjectClass';
import IPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/syn/subjectClass';

const getAll = (params: iConfigParams = {}): Promise<IPaginatedResult<iSynSubjectClass>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynSubjectClassService = {
  getAll
}

export default SynSubjectClassService;
