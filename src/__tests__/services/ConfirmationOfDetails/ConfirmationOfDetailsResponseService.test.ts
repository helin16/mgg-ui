import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ConfirmationOfDetailsResponseService from '../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService';

describe('ConfirmationOfDetailsResponseService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ConfirmationOfDetailsResponseService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ConfirmationOfDetailsResponseService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: ConfirmationOfDetailsResponseService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: ConfirmationOfDetailsResponseService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'submit',
    serviceFn: ConfirmationOfDetailsResponseService.submit,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response/submit/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'sync',
    serviceFn: ConfirmationOfDetailsResponseService.sync,
    appMethod: 'put',
    callArgs: ["123", "student", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response/sync/123/student", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: ConfirmationOfDetailsResponseService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/cod/response/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
