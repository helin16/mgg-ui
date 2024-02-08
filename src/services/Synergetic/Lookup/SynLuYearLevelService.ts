import AppService, {iConfigParams} from '../../AppService';
import ISynLuYearLevel from '../../../types/Synergetic/Lookup/iSynLuYearLevel';


const endPoint = `/syn/luYearLevel`;
const getAllYearLevels = (params: iConfigParams = {}): Promise<ISynLuYearLevel[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuYearLevelService = {
  getAllYearLevels
}

export default SynLuYearLevelService;
