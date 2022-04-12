import AppService, {iConfigParams} from '../AppService';
import iYearLevel from '../../types/Synergetic/iYearLevel';

const getAllYearLevels = (params: iConfigParams = {}): Promise<iYearLevel[]> => {
  return AppService.get(`/yearLevel`, params).then(resp => resp.data);
};

const YearLevelService = {
  getAllYearLevels
}

export default YearLevelService;
