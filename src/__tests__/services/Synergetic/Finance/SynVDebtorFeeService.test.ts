import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorFeeService from '../../../../services/Synergetic/Finance/SynVDebtorFeeService';

describe('SynVDebtorFeeService', () => {
  const endPoint = '/syn/vDebtorFee';

  ServiceTestHelper.testGetAll(endPoint, SynVDebtorFeeService.getAll);
});
