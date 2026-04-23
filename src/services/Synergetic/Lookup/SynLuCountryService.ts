import AppService, {iConfigParams} from '../../AppService';
import iSynLuCountry from '../../../types/Synergetic/Lookup/iSynLuCountry';

const endPoint = '/syn/luCountry';

const getAll = (params: iConfigParams = {}): Promise<iSynLuCountry[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuCountryService = {
  getAll
}

export default SynLuCountryService;
