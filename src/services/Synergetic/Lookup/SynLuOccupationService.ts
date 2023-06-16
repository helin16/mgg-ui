import AppService, {iConfigParams} from '../../AppService';
import iSynOccupation from '../../../types/Synergetic/Lookup/iSynLuOccupation';

const getAll = (params: iConfigParams = {}): Promise<iSynOccupation[]> => {
  return AppService.get(`/syn/luOccupation`, params).then(resp => resp.data);
};

const SynLuOccupationService = {
  getAll
}

export default SynLuOccupationService;
