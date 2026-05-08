import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorPaymentMethodService from '../../../../services/Synergetic/Finance/SynDebtorPaymentMethodService';

describe('SynDebtorPaymentMethodService', () => {
  const endPoint = '/syn/debtorPaymentMethod';

  ServiceTestHelper.testGetAll(endPoint, SynDebtorPaymentMethodService.getAll);
  ServiceTestHelper.testCustom({
    name: 'getAllCurrent',
    serviceFn: SynDebtorPaymentMethodService.getAllCurrent,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/debtorPaymentMethod/current", {"fakeParams":"value"}],
  });
});
