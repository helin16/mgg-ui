import AppService, {iConfigParams} from '../../AppService';
import iSynLuNationality from '../../../types/Synergetic/Lookup/iSynLuNationality';

const endPoint = '/syn/luNationality';

const getAll = (params: iConfigParams = {}): Promise<iSynLuNationality[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuNationalityService = {
  getAll
}

export default SynLuNationalityService;
