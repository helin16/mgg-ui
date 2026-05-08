import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuVisaService from '../../../../services/Synergetic/Lookup/SynLuVisaService';

describe('SynLuVisaService', () => {
  const endPoint = '/syn/luVisa';

  ServiceTestHelper.testGetAll(endPoint, SynLuVisaService.getAll);
});
