import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynTag from '../../types/Synergetic/iSynTag';

const endPoint = '/syn/tag';
const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynTag>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
}

const SynTagService = {
  getAll,
};

export default SynTagService;

