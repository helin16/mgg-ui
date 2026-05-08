import ServiceTestHelper from '../helper/ServiceTestHelper';
import DefaultService from '../../services/DefaultService';

describe('DefaultService', () => {
  ServiceTestHelper.testCustom({
    name: 'getRoot',
    serviceFn: DefaultService.getRoot,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
