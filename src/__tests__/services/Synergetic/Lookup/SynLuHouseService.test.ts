import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuHouseService from '../../../../services/Synergetic/Lookup/SynLuHouseService';

describe('SynLuHouseService', () => {
  const endPoint = '/syn/luHouse/';

  ServiceTestHelper.testGetAll(endPoint, SynLuHouseService.getLuHouses);
});
