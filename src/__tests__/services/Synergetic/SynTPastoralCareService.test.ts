import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTPastoralCareService from '../../../services/Synergetic/SynTPastoralCareService';

describe('SynTPastoralCareService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTPastoralCareService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/tPastoralCare", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
