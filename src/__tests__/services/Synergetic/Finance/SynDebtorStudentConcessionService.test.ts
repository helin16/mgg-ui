import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynDebtorStudentConcessionService from '../../../../services/Synergetic/Finance/SynDebtorStudentConcessionService';

describe('SynDebtorStudentConcessionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynDebtorStudentConcessionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/debtorStudentConcession", {"fakeParams":"value"}],
  });
});
