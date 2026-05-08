import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVActivityService from '../../../services/Synergetic/SynVActivityService';

describe('SynVActivityService', () => {
  const endPoint = '/syn/vActivity';

  ServiceTestHelper.testGet(endPoint, SynVActivityService.getAllById);
});
