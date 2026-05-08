import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorStudentConcessionService from '../../../../services/Synergetic/Finance/SynVDebtorStudentConcessionService';

describe('SynVDebtorStudentConcessionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVDebtorStudentConcessionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vDebtorStudentConcession", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
