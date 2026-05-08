import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';

describe('SynConfigUserService', () => {
  const endPoint = '/syn/configUser';

  ServiceTestHelper.testGetAll(endPoint, SynConfigUserService.getAll);
});
