import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorTransactionService from '../../../../services/Synergetic/Finance/SynDebtorTransactionService';

describe('SynDebtorTransactionService', () => {
  const endPoint = '/syn/debtorTransaction';

  ServiceTestHelper.testGetAll(endPoint, SynDebtorTransactionService.getAll);
});
