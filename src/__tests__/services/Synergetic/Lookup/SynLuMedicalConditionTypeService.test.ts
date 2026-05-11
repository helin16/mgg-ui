import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuMedicalConditionTypeService from '../../../../services/Synergetic/Lookup/SynLuMedicalConditionTypeService';

describe('SynLuMedicalConditionTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllMedicalConditionTypes',
    serviceFn: SynLuMedicalConditionTypeService.getAllMedicalConditionTypes,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luMedicalConditionType"),
  });
});
