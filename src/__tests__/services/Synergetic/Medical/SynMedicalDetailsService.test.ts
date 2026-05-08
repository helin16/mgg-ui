import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynMedicalDetailsService from '../../../../services/Synergetic/Medical/SynMedicalDetailsService';

describe('SynMedicalDetailsService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynMedicalDetailsService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/medicalDetails", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
