import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuCourtOrderTypeService from '../../../../services/Synergetic/Lookup/SynLuCourtOrderTypeService';

describe('SynLuCourtOrderTypeService', () => {
  const endPoint = '/syn/luCourtOrderType';

  ServiceTestHelper.testGetAll(endPoint, SynLuCourtOrderTypeService.getAll);
});
