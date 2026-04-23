import AppService, {iConfigParams} from '../../AppService';
import iSynLuRelationship from '../../../types/Synergetic/Lookup/iSynLuRelationship';

const endPoint = '/syn/luRelationship';

const getAll = (params: iConfigParams = {}): Promise<iSynLuRelationship[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuRelationshipService = {
  getAll
}

export default SynLuRelationshipService;
