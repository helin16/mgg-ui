import AppService, {iConfigParams} from '../../AppService';
import iSynLuConsentType from '../../../types/Synergetic/Lookup/iSynLuConsentType';

const endPoint = '/syn/luConsentType';

const getAll = (params: iConfigParams = {}): Promise<iSynLuConsentType[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuConsentTypeService = {
  getAll
}

export default SynLuConsentTypeService;
