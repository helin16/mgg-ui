import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVStudentParent from '../../../types/Synergetic/Community/iSynVStudentParent';


const endPoint = `/syn/vStudentParent`;
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynVStudentParent>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVStudentParentService = {
  getAll
}

export default SynVStudentParentService;
