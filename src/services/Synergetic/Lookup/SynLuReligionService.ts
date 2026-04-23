import AppService, {iConfigParams} from '../../AppService';
import iSynLuReligion from '../../../types/Synergetic/Lookup/iSynLuReligion';

const endPoint = '/syn/luReligion';

const getAll = (params: iConfigParams = {}): Promise<iSynLuReligion[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuReligionService = {
  getAll
}

export default SynLuReligionService;
