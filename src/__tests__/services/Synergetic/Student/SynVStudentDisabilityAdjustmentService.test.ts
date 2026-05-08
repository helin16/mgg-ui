import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentDisabilityAdjustmentService from '../../../../services/Synergetic/Student/SynVStudentDisabilityAdjustmentService';

describe('SynVStudentDisabilityAdjustmentService', () => {
  const endPoint = '/syn/vStudentDisabilityAdjustment';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentDisabilityAdjustmentService.getAll);
});
