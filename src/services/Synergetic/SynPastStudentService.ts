import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iPastStudent from '../../types/Synergetic/iPastStudent';

const endPoint = '/syn/pastStudent';
const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iPastStudent>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynPastStudentService = {
  getAll,
}

export default SynPastStudentService;
