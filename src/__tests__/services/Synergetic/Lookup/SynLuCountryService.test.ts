import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuCountryService from '../../../../services/Synergetic/Lookup/SynLuCountryService';

describe('SynLuCountryService', () => {
  const endPoint = '/syn/luCountry';

  ServiceTestHelper.testGetAll(endPoint, SynLuCountryService.getAll);
});
