import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuVisaService from '../../../../services/Synergetic/Lookup/SynLuVisaService';

describe('SynLuVisaService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuVisaService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/luVisa"),
  });
});
