import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVConfigUserPermissionService from '../../../services/Synergetic/SynVConfigUserPermissionService';

describe('SynVConfigUserPermissionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVConfigUserPermissionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vConfigUserPermission", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
