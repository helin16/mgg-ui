import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynRelationship from '../../../types/Synergetic/Community/iSynRelationship';

const endPoint = '/syn/relationship';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynRelationship>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynRelationshipService = {
  getAll,
};

export default SynRelationshipService;
