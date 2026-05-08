import ServiceTestHelper from '../helper/ServiceTestHelper';
import DefaultService from '../../services/DefaultService';

describe('DefaultService', () => {
  const endPoint = '/';

  ServiceTestHelper.testGetAll(endPoint, DefaultService.getRoot);
});
