import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorTransactionService from '../../../../services/Synergetic/Finance/SynDebtorTransactionService';

describe('SynDebtorTransactionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynDebtorTransactionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/debtorTransaction"),
  });
});
