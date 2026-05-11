import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuFormService from '../../../../services/Synergetic/Lookup/SynLuFormService';

describe('SynLuFormService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuFormService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luForm/"),
  });
});
