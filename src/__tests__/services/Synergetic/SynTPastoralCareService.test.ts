import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTPastoralCareService from '../../../services/Synergetic/SynTPastoralCareService';

describe('SynTPastoralCareService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTPastoralCareService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/tPastoralCare"),
  });
});
