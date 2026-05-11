import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorPaymentMethodService from '../../../../services/Synergetic/Finance/SynDebtorPaymentMethodService';

describe('SynDebtorPaymentMethodService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynDebtorPaymentMethodService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/debtorPaymentMethod"),
  });
  ServiceTestHelper.testCustom({
    name: 'getAllCurrent',
    serviceFn: SynDebtorPaymentMethodService.getAllCurrent,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/debtorPaymentMethod/current"),
  });
});
