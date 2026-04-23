import AppService, {iConfigParams} from '../../AppService';
import iSynOccupationPosition from '../../../types/Synergetic/Lookup/iSynLuOccupationPosition';

const getAll = (params: iConfigParams = {}): Promise<iSynOccupationPosition[]> => {
  return AppService.get(`/syn/luOccupationPosition`, params).then(resp => resp.data);
};

const SynLuOccupationPositionService = {
  getAll
}

export default SynLuOccupationPositionService;
