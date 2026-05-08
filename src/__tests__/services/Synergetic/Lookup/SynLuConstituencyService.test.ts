import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuConstituencyService from '../../../../services/Synergetic/Lookup/SynLuConstituencyService';

describe('SynLuConstituencyService', () => {
  const endPoint = '/syn/luConstituency';

  ServiceTestHelper.testGetAll(endPoint, SynLuConstituencyService.getAll);
});
