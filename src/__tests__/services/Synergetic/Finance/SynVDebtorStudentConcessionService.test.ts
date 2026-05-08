import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorStudentConcessionService from '../../../../services/Synergetic/Finance/SynVDebtorStudentConcessionService';

describe('SynVDebtorStudentConcessionService', () => {
  const endPoint = '/syn/vDebtorStudentConcession';

  ServiceTestHelper.testGetAll(endPoint, SynVDebtorStudentConcessionService.getAll);
});
