import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuTransitionDateService from '../../../../services/Synergetic/Lookup/SynLuTransitionDateService';

describe('SynLuTransitionDateService', () => {
  const endPoint = '/syn/luTransitionDate';

  ServiceTestHelper.testGetAll(endPoint, SynLuTransitionDateService.getAll);
  ServiceTestHelper.testGet(endPoint, SynLuTransitionDateService.getById);
  ServiceTestHelper.testCreate(endPoint, SynLuTransitionDateService.create);
  ServiceTestHelper.testUpdate(endPoint, SynLuTransitionDateService.updateById);
});
