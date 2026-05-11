import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynLearningAreaService from '../../../services/Synergetic/SynLearningAreaService';

describe('SynLearningAreaService', () => {
  ServiceTestHelper.testCustom({
    name: 'getLearningAreas',
    serviceFn: SynLearningAreaService.getLearningAreas,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/learningArea"),
  });
});
