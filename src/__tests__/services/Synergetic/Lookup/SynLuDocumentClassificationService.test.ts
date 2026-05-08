import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDocumentClassificationService from '../../../../services/Synergetic/Lookup/SynLuDocumentClassificationService';

describe('SynLuDocumentClassificationService', () => {
  const endPoint = '/syn/luDocumentClassification';

  ServiceTestHelper.testGetAll(endPoint, SynLuDocumentClassificationService.getAll);
});
