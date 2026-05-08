import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuLearningPathwayService from '../../../../services/Synergetic/Lookup/SynLuLearningPathwayService';

describe('SynLuLearningPathwayService', () => {
  const endPoint = '/syn/luLearningPathway';

  ServiceTestHelper.testGetAll(endPoint, SynLuLearningPathwayService.getAll);
});
