import ServiceTestHelper from '../../helper/ServiceTestHelper';
import FunnelService from '../../../services/Funnel/FunnelService';

describe('FunnelService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: FunnelService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/funnel", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'download',
    serviceFn: FunnelService.download,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/funnel/download", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: FunnelService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/funnel/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
