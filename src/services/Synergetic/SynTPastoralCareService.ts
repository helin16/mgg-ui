import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynTPastoralCare from '../../types/Synergetic/iSynTPastoralCare';

const endPoint = `/syn/tPastoralCare`;

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynTPastoralCare>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}
const SynTPastoralCareService = {
  getAll
}

export default SynTPastoralCareService;
