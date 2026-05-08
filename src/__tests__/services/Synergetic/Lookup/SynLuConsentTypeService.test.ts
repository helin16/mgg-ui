import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuConsentTypeService from '../../../../services/Synergetic/Lookup/SynLuConsentTypeService';

describe('SynLuConsentTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuConsentTypeService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/luConsentType", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
