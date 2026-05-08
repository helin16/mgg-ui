import AppService, {iConfigParams} from '../../AppService';
import iSynLuConsentType from '../../../types/Synergetic/Lookup/iSynLuConsentType';

const endPoint = '/syn/luConsentType';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynLuConsentType[]> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynLuConsentTypeService = {
  getAll,
};

export default SynLuConsentTypeService;
