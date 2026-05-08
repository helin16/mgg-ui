import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuFundService from '../../../../services/Synergetic/Lookup/SynLuFundService';

describe('SynLuFundService', () => {
  const endPoint = '/syn/luFund/';

  ServiceTestHelper.testGetAll(endPoint, SynLuFundService.getAll);
});
