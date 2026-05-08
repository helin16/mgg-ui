import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynConstituencyService from '../../../../services/Synergetic/Community/SynConstituencyService';

describe('SynConstituencyService', () => {
  const endPoint = '/syn/constituency';

  ServiceTestHelper.testGetAll(endPoint, SynConstituencyService.getAll);
});
