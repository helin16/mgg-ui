import AppService, {iConfigParams} from '../../AppService';
import iSynLuDepartment from '../../../types/Synergetic/Lookup/iSynLuDepartment';

const endPoint = '/syn/luDepartment';

const getAll = (params: iConfigParams = {}): Promise<iSynLuDepartment[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuDepartmentService = {
  getAll
}

export default SynLuDepartmentService;
