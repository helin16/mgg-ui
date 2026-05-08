import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuReligionService from '../../../../services/Synergetic/Lookup/SynLuReligionService';

describe('SynLuReligionService', () => {
  const endPoint = '/syn/luReligion';

  ServiceTestHelper.testGetAll(endPoint, SynLuReligionService.getAll);
});
