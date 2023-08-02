import AppService, {iConfigParams} from '../../AppService';
import iSynLuSkill from '../../../types/Synergetic/Lookup/iSynLuSkill';

const endPoint = '/syn/luSkill';

const getAll = (params: iConfigParams = {}): Promise<iSynLuSkill[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuSkillService = {
  getAll
}

export default SynLuSkillService;
