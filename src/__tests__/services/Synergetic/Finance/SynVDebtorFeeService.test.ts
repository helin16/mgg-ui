import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorFeeService from '../../../../services/Synergetic/Finance/SynVDebtorFeeService';

describe('SynVDebtorFeeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVDebtorFeeService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/vDebtorFee"),
  });
});
