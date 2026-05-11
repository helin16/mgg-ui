import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVConfigUserPermissionService from '../../../services/Synergetic/SynVConfigUserPermissionService';

describe('SynVConfigUserPermissionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVConfigUserPermissionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vConfigUserPermission"),
  });
});
