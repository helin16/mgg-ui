import AppService, {iConfigParams} from '../../AppService';
import iSynLuVisa from '../../../types/Synergetic/Lookup/iSynLuVisa';

const endPoint = '/syn/luVisa';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynLuVisa[]> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynLuVisaService = {
  getAll,
};

export default SynLuVisaService;
