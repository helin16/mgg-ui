import AppService, {iConfigParams} from '../../AppService';
import iSynLuState from '../../../types/Synergetic/Lookup/iSynLuState';

const endPoint = '/syn/luState';

const getAll = (params: iConfigParams = {}): Promise<iSynLuState[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuStateService = {
  getAll
}

export default SynLuStateService;
