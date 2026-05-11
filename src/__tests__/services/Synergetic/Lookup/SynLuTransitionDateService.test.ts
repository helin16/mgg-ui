import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import TestHelper from '../../../helper/TestHelper';
import SynLuTransitionDateService from '../../../../services/Synergetic/Lookup/SynLuTransitionDateService';

describe('SynLuTransitionDateService', () => {
  const {fakeId, fakeParams} = TestHelper.getFakeParams();

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuTransitionDateService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luTransitionDate"),
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: SynLuTransitionDateService.getById,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgsWithId('/syn/luTransitionDate'),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: SynLuTransitionDateService.create,
    appMethod: 'post',
    callArgs: [fakeParams, fakeParams],
    expectedArgs: ['/syn/luTransitionDate', fakeParams, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'updateById',
    serviceFn: SynLuTransitionDateService.updateById,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgsWithId('/syn/luTransitionDate'),
  });
});
