import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ConfirmationOfDetailsResponseService from '../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService';

describe('ConfirmationOfDetailsResponseService', () => {
  const endPoint = '/cod/response';

  ServiceTestHelper.testGetAll(endPoint, ConfirmationOfDetailsResponseService.getAll);
  ServiceTestHelper.testGet(endPoint, ConfirmationOfDetailsResponseService.get);
  ServiceTestHelper.testCreate(endPoint, ConfirmationOfDetailsResponseService.create);
  ServiceTestHelper.testUpdate(endPoint, ConfirmationOfDetailsResponseService.update);
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
  ServiceTestHelper.testDeactivate(endPoint, ConfirmationOfDetailsResponseService.deactivate);
});
