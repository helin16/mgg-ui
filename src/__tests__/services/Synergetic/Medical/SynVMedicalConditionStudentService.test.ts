import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVMedicalConditionStudentService from '../../../../services/Synergetic/Medical/SynVMedicalConditionStudentService';

describe('SynVMedicalConditionStudentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVMedicalConditionStudentService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vMedicalConditionStudent"),
  });
});
