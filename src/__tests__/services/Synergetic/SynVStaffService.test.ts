import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';

describe('SynVStaffService', () => {
  const endPoint = '/syn/vStaff';

  ServiceTestHelper.testGetAll(endPoint, SynVStaffService.getStaffList);
});
