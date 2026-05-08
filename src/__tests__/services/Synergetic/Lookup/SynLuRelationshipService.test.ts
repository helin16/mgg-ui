import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuRelationshipService from '../../../../services/Synergetic/Lookup/SynLuRelationshipService';

describe('SynLuRelationshipService', () => {
  const endPoint = '/syn/luRelationship';

  ServiceTestHelper.testGetAll(endPoint, SynLuRelationshipService.getAll);
});
