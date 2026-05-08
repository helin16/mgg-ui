import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuAppealService from '../../../../services/Synergetic/Lookup/SynLuAppealService';

describe('SynLuAppealService', () => {
  const endPoint = '/syn/luAppeal/';

  ServiceTestHelper.testGetAll(endPoint, SynLuAppealService.getAll);
});
