import ServiceTestHelper from '../helper/ServiceTestHelper';
import AlumniRequestService from '../../services/AlumniRequestService';

describe('AlumniRequestService', () => {
  const endPoint = '/alumniRequest';

  ServiceTestHelper.testGetAll(endPoint, AlumniRequestService.getAll);
  ServiceTestHelper.testCreate(endPoint, AlumniRequestService.create);
  ServiceTestHelper.testCustom({
    name: 'approve',
    serviceFn: AlumniRequestService.approve,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/alumniRequest/123/approve", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testDeactivate(endPoint, AlumniRequestService.deactivate);
});
