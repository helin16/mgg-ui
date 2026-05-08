import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorService from '../../../../services/Synergetic/Finance/SynVDebtorService';

describe('SynVDebtorService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVDebtorService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/vDebtor", {"fakeParams":"value"}],
  });
});
