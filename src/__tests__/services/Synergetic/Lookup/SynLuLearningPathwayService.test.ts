import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuLearningPathwayService from '../../../../services/Synergetic/Lookup/SynLuLearningPathwayService';

describe('SynLuLearningPathwayService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuLearningPathwayService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/luLearningPathway", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
