import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVActivityService from '../../../services/Synergetic/SynVActivityService';

describe('SynVActivityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllById',
    serviceFn: SynVActivityService.getAllById,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vActivity/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
