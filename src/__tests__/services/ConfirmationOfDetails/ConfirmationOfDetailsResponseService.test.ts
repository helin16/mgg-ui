import ServiceTestHelper from '../../helper/ServiceTestHelper';
import TestHelper from '../../helper/TestHelper';
import ConfirmationOfDetailsResponseService from '../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService';

describe('ConfirmationOfDetailsResponseService', () => {
  const {fakeId, fakeParams, fakeConfig} = TestHelper.getFakeParams();
  const fakeTarget = TestHelper.faker.lorem.word();

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ConfirmationOfDetailsResponseService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/cod/response"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ConfirmationOfDetailsResponseService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/cod/response"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: ConfirmationOfDetailsResponseService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/cod/response"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: ConfirmationOfDetailsResponseService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/cod/response"),
  });
  ServiceTestHelper.testCustom({
    name: 'submit',
    serviceFn: ConfirmationOfDetailsResponseService.submit,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/cod/response/submit"),
  });
  ServiceTestHelper.testCustom({
    name: 'sync',
    serviceFn: ConfirmationOfDetailsResponseService.sync,
    appMethod: 'put',
    callArgs: [fakeId, fakeTarget, fakeParams, fakeConfig],
    expectedArgs: [`/cod/response/sync/${fakeId}/${fakeTarget}`, fakeParams, fakeConfig],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: ConfirmationOfDetailsResponseService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/cod/response"),
  });
});
