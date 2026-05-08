import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDebtorFeeCategoryService from '../../../../services/Synergetic/Finance/SynLuDebtorFeeCategoryService';

describe('SynLuDebtorFeeCategoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuDebtorFeeCategoryService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luDebtorFeeCategory", {"fakeParams":"value"}],
  });
});
