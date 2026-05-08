import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTPastoralCareService from '../../../services/Synergetic/SynTPastoralCareService';

describe('SynTPastoralCareService', () => {
  const endPoint = '/syn/tPastoralCare';

  ServiceTestHelper.testGetAll(endPoint, SynTPastoralCareService.getAll);
});
