import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStaffJobPositionService from '../../../../services/Synergetic/Staff/SynStaffJobPositionService';

describe('SynStaffJobPositionService', () => {
  const endPoint = '/syn/staffJobPosition';

  ServiceTestHelper.testGetAll(endPoint, SynStaffJobPositionService.getAll);
});
