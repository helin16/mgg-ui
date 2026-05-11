import ServiceTestHelper from '../../helper/ServiceTestHelper';
import FunnelService from '../../../services/Funnel/FunnelService';

describe('FunnelService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: FunnelService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/funnel"),
  });
  ServiceTestHelper.testCustom({
    name: 'download',
    serviceFn: FunnelService.download,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/funnel/download"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: FunnelService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/funnel"),
  });
});
