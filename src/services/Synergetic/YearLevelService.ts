import AppService, {iConfigParams} from '../AppService';
import iVStudent from '../../types/student/iVStudent';
import iYearLevel from '../../types/community/iYearLevel';

const getAllYearLevels = (params: iConfigParams = {}): Promise<iYearLevel[]> => {
  return AppService.get(`/yearLevel`, params).then(resp => resp.data);
};

const YearLevelService = {
  getAllYearLevels
}

export default YearLevelService;
