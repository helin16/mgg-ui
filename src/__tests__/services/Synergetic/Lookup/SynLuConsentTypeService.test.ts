import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuConsentTypeService from '../../../../services/Synergetic/Lookup/SynLuConsentTypeService';

describe('SynLuConsentTypeService', () => {
  const endPoint = '/syn/luConsentType';

  ServiceTestHelper.testGetAll(endPoint, SynLuConsentTypeService.getAll);
});
