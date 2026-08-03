import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynLuConfigGroupService from '../../../services/Synergetic/SynLuConfigGroupService';

describe('SynLuConfigGroupService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuConfigGroupService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs('/syn/luConfigGroup'),
  });
});
