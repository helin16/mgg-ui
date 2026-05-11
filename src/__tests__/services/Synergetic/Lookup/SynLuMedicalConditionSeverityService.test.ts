import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuMedicalConditionSeverityService from '../../../../services/Synergetic/Lookup/SynLuMedicalConditionSeverityService';

describe('SynLuMedicalConditionSeverityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllMedicalConditionSeverities',
    serviceFn: SynLuMedicalConditionSeverityService.getAllMedicalConditionSeverities,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luMedicalConditionSeverity"),
  });
});
