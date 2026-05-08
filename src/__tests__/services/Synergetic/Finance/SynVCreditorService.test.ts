import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVCreditorService from '../../../../services/Synergetic/Finance/SynVCreditorService';

describe('SynVCreditorService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVCreditorService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/vCreditor", {"fakeParams":"value"}],
  });
});
