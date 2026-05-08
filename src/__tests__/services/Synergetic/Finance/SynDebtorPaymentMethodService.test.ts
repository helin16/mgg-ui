import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorPaymentMethodService from '../../../../services/Synergetic/Finance/SynDebtorPaymentMethodService';

describe('SynDebtorPaymentMethodService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynDebtorPaymentMethodService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/debtorPaymentMethod", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getAllCurrent',
    serviceFn: SynDebtorPaymentMethodService.getAllCurrent,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/debtorPaymentMethod/current", {"fakeParams":"value"}],
  });
});
