import AppService, {iConfigParams} from '../../AppService';
import iSynLuLearningPathway from '../../../types/Synergetic/Lookup/iSynLuLearningPathway';

const endPoint = '/syn/luLearningPathway';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynLuLearningPathway[]> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynLuLearningPathwayService = {
  getAll,
};

export default SynLuLearningPathwayService;
