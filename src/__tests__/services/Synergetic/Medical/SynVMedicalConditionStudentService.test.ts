import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVMedicalConditionStudentService from '../../../../services/Synergetic/Medical/SynVMedicalConditionStudentService';

describe('SynVMedicalConditionStudentService', () => {
  const endPoint = '/syn/vMedicalConditionStudent';

  ServiceTestHelper.testGetAll(endPoint, SynVMedicalConditionStudentService.getAll);
});
