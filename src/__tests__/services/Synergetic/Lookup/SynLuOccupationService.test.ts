import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuOccupationService from '../../../../services/Synergetic/Lookup/SynLuOccupationService';

describe('SynLuOccupationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuOccupationService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luOccupation"),
  });
});
