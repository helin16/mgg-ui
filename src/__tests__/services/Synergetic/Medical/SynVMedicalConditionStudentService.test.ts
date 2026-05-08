import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVMedicalConditionStudentService from '../../../../services/Synergetic/Medical/SynVMedicalConditionStudentService';

describe('SynVMedicalConditionStudentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVMedicalConditionStudentService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vMedicalConditionStudent", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
