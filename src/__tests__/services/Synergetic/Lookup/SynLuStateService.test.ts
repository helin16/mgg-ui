import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuStateService from '../../../../services/Synergetic/Lookup/SynLuStateService';

describe('SynLuStateService', () => {
  const endPoint = '/syn/luState';

  ServiceTestHelper.testGetAll(endPoint, SynLuStateService.getAll);
});
