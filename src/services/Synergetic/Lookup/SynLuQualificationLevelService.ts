import AppService, {iConfigParams} from '../../AppService';
import iSynLuQualificationLevel from '../../../types/Synergetic/Lookup/iSynLuQualificationLevel';

const getAll = (params: iConfigParams = {}): Promise<iSynLuQualificationLevel[]> => {
  return AppService.get(`/syn/luQualificationLevel`, params).then(resp => resp.data);
};

const SynLuQualificationLevelService = {
  getAll
}

export default SynLuQualificationLevelService;
