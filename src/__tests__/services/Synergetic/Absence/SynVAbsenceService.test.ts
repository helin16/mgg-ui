import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAbsenceService from '../../../../services/Synergetic/Absence/SynVAbsenceService';

describe('SynVAbsenceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVAbsenceService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vAbsence", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
