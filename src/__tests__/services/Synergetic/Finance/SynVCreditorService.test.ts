import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVCreditorService from '../../../../services/Synergetic/Finance/SynVCreditorService';

describe('SynVCreditorService', () => {
  const endPoint = '/syn/vCreditor';

  ServiceTestHelper.testGetAll(endPoint, SynVCreditorService.getAll);
});
