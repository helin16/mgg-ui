import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTagService from '../../../services/Synergetic/SynTagService';

describe('SynTagService', () => {
  const endPoint = '/syn/tag';

  ServiceTestHelper.testGetAll(endPoint, SynTagService.getAll);
});
