import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuTransitionDateService from '../../../../services/Synergetic/Lookup/SynLuTransitionDateService';

describe('SynLuTransitionDateService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuTransitionDateService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luTransitionDate", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: SynLuTransitionDateService.getById,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/syn/luTransitionDate/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: SynLuTransitionDateService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"fakeParams":"value"}],
    expectedArgs: ["/syn/luTransitionDate", {"fakeParams":"value"}, {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'updateById',
    serviceFn: SynLuTransitionDateService.updateById,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/syn/luTransitionDate/123", {"fakeParams":"value"}],
  });
});
