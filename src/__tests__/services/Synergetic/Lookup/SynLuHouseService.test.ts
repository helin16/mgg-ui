import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuHouseService from '../../../../services/Synergetic/Lookup/SynLuHouseService';

describe('SynLuHouseService', () => {
  ServiceTestHelper.testCustom({
    name: 'getLuHouses',
    serviceFn: SynLuHouseService.getLuHouses,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luHouse/"),
  });
});
