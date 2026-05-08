import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynTagList from '../../../types/Synergetic/iSynTagList';

const endPoint = '/syn/tagList';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynTagList>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynTagListService = {
  getAll,
};

export default SynTagListService;
