import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVConfigUserPermissionService from '../../../services/Synergetic/SynVConfigUserPermissionService';

describe('SynVConfigUserPermissionService', () => {
  const endPoint = '/syn/vConfigUserPermission';

  ServiceTestHelper.testGetAll(endPoint, SynVConfigUserPermissionService.getAll);
});
