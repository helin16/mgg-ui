import AppService, {iConfigParams} from '../AppService';
import iSynLuHouse from '../../types/Synergetic/iSynLuHouse';

const endPoint = '/syn/luHouse/';

const getLuHouses = (params: iConfigParams = {}): Promise<iSynLuHouse[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuHouseService = {
  getLuHouses
}

export default SynLuHouseService;
