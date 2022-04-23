import AppService, {iConfigParams} from '../AppService';
import iLuYearLevel from '../../types/Synergetic/iLuYearLevel';

const getAllYearLevels = (params: iConfigParams = {}): Promise<iLuYearLevel[]> => {
  return AppService.get(`/syn/luYearLevel`, params).then(resp => resp.data);
};

const SynLuYearLevelService = {
  getAllYearLevels
}

export default SynLuYearLevelService;
