import AppService, {iConfigParams} from '../AppService';
import iSynLearningArea from '../../types/Synergetic/iSynLearningArea';

const getLearningAreas = (params: iConfigParams = {}): Promise<iSynLearningArea[]> => {
  return AppService.get(`/syn/learningArea`, params).then(resp => resp.data);
};

const SynLearningAreaService = {
  getLearningAreas,
}

export default SynLearningAreaService;
