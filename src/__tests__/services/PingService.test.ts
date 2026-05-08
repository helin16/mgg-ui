import ServiceTestHelper from '../helper/ServiceTestHelper';
import PingService from '../../services/PingService';

describe('PingService', () => {
  const endPoint = '/ping';

  ServiceTestHelper.testGetAll(endPoint, PingService.ping);
});
