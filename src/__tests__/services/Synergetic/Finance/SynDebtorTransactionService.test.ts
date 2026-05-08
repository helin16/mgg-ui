import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorTransactionService from '../../../../services/Synergetic/Finance/SynDebtorTransactionService';

describe('SynDebtorTransactionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynDebtorTransactionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/debtorTransaction", {"fakeParams":"value"}],
  });
});
