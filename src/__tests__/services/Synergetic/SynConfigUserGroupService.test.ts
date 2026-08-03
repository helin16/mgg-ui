import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynConfigUserGroupService from '../../../services/Synergetic/SynConfigUserGroupService';

describe('SynConfigUserGroupService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynConfigUserGroupService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs('/syn/configUserGroup'),
  });
});
