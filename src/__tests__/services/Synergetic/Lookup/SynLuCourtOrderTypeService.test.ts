import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuCourtOrderTypeService from '../../../../services/Synergetic/Lookup/SynLuCourtOrderTypeService';

describe('SynLuCourtOrderTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuCourtOrderTypeService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luCourtOrderType"),
  });
});
