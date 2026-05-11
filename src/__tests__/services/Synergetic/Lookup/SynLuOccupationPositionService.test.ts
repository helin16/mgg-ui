import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuOccupationPositionService from '../../../../services/Synergetic/Lookup/SynLuOccupationPositionService';

describe('SynLuOccupationPositionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuOccupationPositionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luOccupationPosition"),
  });
});
