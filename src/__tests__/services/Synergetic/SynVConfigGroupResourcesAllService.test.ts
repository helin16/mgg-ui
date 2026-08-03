import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVConfigGroupResourcesAllService from '../../../services/Synergetic/SynVConfigGroupResourcesAllService';

describe('SynVConfigGroupResourcesAllService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVConfigGroupResourcesAllService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs('/syn/vConfigGroupResourcesAll'),
  });
});
