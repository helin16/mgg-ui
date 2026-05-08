import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynRelationshipService from '../../../../services/Synergetic/Community/SynRelationshipService';

describe('SynRelationshipService', () => {
  const endPoint = '/syn/relationship';

  ServiceTestHelper.testGetAll(endPoint, SynRelationshipService.getAll);
});
