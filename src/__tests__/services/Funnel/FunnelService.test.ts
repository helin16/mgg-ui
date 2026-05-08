import ServiceTestHelper from '../../helper/ServiceTestHelper';
import FunnelService from '../../../services/Funnel/FunnelService';

describe('FunnelService', () => {
  const endPoint = '/funnel';

  ServiceTestHelper.testGetAll(endPoint, FunnelService.getAll);
  ServiceTestHelper.testCustom({
    name: 'download',
    serviceFn: FunnelService.download,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/funnel/download", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testUpdate(endPoint, FunnelService.update);
});
