import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuMedicalConditionTypeService from '../../../../services/Synergetic/Lookup/SynLuMedicalConditionTypeService';

describe('SynLuMedicalConditionTypeService', () => {
  const endPoint = '/syn/luMedicalConditionType';

  ServiceTestHelper.testGetAll(endPoint, SynLuMedicalConditionTypeService.getAllMedicalConditionTypes);
});
