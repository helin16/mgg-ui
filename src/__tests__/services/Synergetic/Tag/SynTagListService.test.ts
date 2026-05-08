import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynTagListService from '../../../../services/Synergetic/Tag/SynTagListService';

describe('SynTagListService', () => {
  const endPoint = '/syn/tagList';

  ServiceTestHelper.testGetAll(endPoint, SynTagListService.getAll);
});
