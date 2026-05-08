import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorService from '../../../../services/Synergetic/Finance/SynVDebtorService';

describe('SynVDebtorService', () => {
  const endPoint = '/syn/vDebtor';

  ServiceTestHelper.testGetAll(endPoint, SynVDebtorService.getAll);
});
