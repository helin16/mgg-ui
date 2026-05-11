import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuConsentTypeService from '../../../../services/Synergetic/Lookup/SynLuConsentTypeService';

describe('SynLuConsentTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuConsentTypeService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/luConsentType"),
  });
});
