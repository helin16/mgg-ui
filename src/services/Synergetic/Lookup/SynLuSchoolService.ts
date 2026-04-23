import AppService, {iConfigParams} from '../../AppService';
import iSynLuSchool from '../../../types/Synergetic/Lookup/iSynLuSchool';

const endPoint = '/syn/luSchool';

const getAll = (params: iConfigParams = {}): Promise<iSynLuSchool[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuSchoolService = {
  getAll
}

export default SynLuSchoolService;
