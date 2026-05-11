import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentDisabilityAdjustmentService from '../../../../services/Synergetic/Student/SynVStudentDisabilityAdjustmentService';

describe('SynVStudentDisabilityAdjustmentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentDisabilityAdjustmentService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/vStudentDisabilityAdjustment"),
  });
});
