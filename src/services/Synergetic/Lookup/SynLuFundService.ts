import AppService, {iConfigParams} from '../../AppService';
import iSynLuFund from '../../../types/Synergetic/Lookup/iSynLuFund';

const endPoint = '/syn/luFund/';

const getAll = (params: iConfigParams = {}): Promise<iSynLuFund[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuFundService = {
  getAll
}

export default SynLuFundService;
