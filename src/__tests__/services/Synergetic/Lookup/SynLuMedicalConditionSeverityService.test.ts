import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuMedicalConditionSeverityService from '../../../../services/Synergetic/Lookup/SynLuMedicalConditionSeverityService';

describe('SynLuMedicalConditionSeverityService', () => {
  const endPoint = '/syn/luMedicalConditionSeverity';

  ServiceTestHelper.testGetAll(endPoint, SynLuMedicalConditionSeverityService.getAllMedicalConditionSeverities);
});
