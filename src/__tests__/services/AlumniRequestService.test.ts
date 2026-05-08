import ServiceTestHelper from '../helper/ServiceTestHelper';
import AlumniRequestService from '../../services/AlumniRequestService';

describe('AlumniRequestService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: AlumniRequestService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/alumniRequest", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: AlumniRequestService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/alumniRequest", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'approve',
    serviceFn: AlumniRequestService.approve,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/alumniRequest/123/approve", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: AlumniRequestService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/alumniRequest/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
