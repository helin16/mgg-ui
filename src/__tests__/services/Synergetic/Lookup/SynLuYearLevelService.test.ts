import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuYearLevelService from '../../../../services/Synergetic/Lookup/SynLuYearLevelService';

describe('SynLuYearLevelService', () => {
  const endPoint = '/syn/luYearLevel';

  ServiceTestHelper.testGetAll(endPoint, SynLuYearLevelService.getAllYearLevels);
});
