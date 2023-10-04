import AppService, {iConfigParams} from '../../AppService';
import iSynLuStaffCategory from '../../../types/Synergetic/Lookup/iSynLuStaffCategory';

const endPoint = '/syn/luStaffCategory';

const getAll = (params: iConfigParams = {}): Promise<iSynLuStaffCategory[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuStaffCategoryService = {
  getAll
}

export default SynLuStaffCategoryService;
