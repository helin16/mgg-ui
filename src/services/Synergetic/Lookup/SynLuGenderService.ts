import AppService, {iConfigParams} from '../../AppService';
import iSynLuGender from '../../../types/Synergetic/Lookup/iSynLuGender';

const getAll = (params: iConfigParams = {}): Promise<iSynLuGender[]> => {
  return AppService.get(`/syn/luGender`, params).then(resp => resp.data);
};

const SynLuGenderService = {
  getAll
}

export default SynLuGenderService;
