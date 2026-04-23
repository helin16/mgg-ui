import AppService, {iConfigParams} from '../../AppService';
import iSynLuConstituency from '../../../types/Synergetic/Lookup/iSynLuConstituency';

const endPoint = '/syn/luConstituency';

const getAll = (params: iConfigParams = {}): Promise<iSynLuConstituency[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuConstituencyService = {
  getAll
}

export default SynLuConstituencyService;
