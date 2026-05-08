import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuFormService from '../../../../services/Synergetic/Lookup/SynLuFormService';

describe('SynLuFormService', () => {
  const endPoint = '/syn/luForm/';

  ServiceTestHelper.testGetAll(endPoint, SynLuFormService.getAll);
});
