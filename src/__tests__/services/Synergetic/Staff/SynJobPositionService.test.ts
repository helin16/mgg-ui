import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynJobPositionService from '../../../../services/Synergetic/Staff/SynJobPositionService';

describe('SynJobPositionService', () => {
  const endPoint = '/syn/jobPosition';

  ServiceTestHelper.testGetAll(endPoint, SynJobPositionService.getAll);
});
