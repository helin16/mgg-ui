import ServiceTestHelper from '../helper/ServiceTestHelper';
import TestHelper from '../helper/TestHelper';
import AlumniRequestService from '../../services/AlumniRequestService';

describe('AlumniRequestService', () => {
  const {fakeId, fakeParams, fakeConfig} = TestHelper.getFakeParams();

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: AlumniRequestService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/alumniRequest"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: AlumniRequestService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/alumniRequest"),
  });
  ServiceTestHelper.testCustom({
    name: 'approve',
    serviceFn: AlumniRequestService.approve,
    appMethod: 'put',
    callArgs: [fakeId, fakeParams, fakeConfig],
    expectedArgs: [`/alumniRequest/${fakeId}/approve`, fakeParams, fakeConfig],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: AlumniRequestService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/alumniRequest"),
  });
});
