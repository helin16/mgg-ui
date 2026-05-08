import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDebtorFeeCategoryService from '../../../../services/Synergetic/Finance/SynLuDebtorFeeCategoryService';

describe('SynLuDebtorFeeCategoryService', () => {
  const endPoint = '/syn/luDebtorFeeCategory';

  ServiceTestHelper.testGetAll(endPoint, SynLuDebtorFeeCategoryService.getAll);
});
