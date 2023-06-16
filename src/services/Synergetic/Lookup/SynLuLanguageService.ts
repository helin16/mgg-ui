import AppService, {iConfigParams} from '../../AppService';
import iSynLuLanguage from '../../../types/Synergetic/Lookup/iSynLuLanguage';

const getAll = (params: iConfigParams = {}): Promise<iSynLuLanguage[]> => {
  return AppService.get(`/syn/luLanguage`, params).then(resp => resp.data);
};

const SynLuLanguageService = {
  getAll
}

export default SynLuLanguageService;
