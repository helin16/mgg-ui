import AppService, {iConfigParams} from '../../AppService';
import iSynLuAppeal from '../../../types/Synergetic/Lookup/iSynLuAppeal';

const endPoint = '/syn/luAppeal/';

const getAll = (params: iConfigParams = {}): Promise<iSynLuAppeal[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuAppealService = {
  getAll
}

export default SynLuAppealService;
