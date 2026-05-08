import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorStudentConcessionService from '../../../../services/Synergetic/Finance/SynDebtorStudentConcessionService';

describe('SynDebtorStudentConcessionService', () => {
  const endPoint = '/syn/debtorStudentConcession';

  ServiceTestHelper.testGetAll(endPoint, SynDebtorStudentConcessionService.getAll);
});
