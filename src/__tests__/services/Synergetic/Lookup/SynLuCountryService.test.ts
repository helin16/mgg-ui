import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuCountryService from '../../../../services/Synergetic/Lookup/SynLuCountryService';

describe('SynLuCountryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuCountryService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luCountry", {"fakeParams":"value"}],
  });
});
