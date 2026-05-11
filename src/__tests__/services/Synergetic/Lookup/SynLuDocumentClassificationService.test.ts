import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDocumentClassificationService from '../../../../services/Synergetic/Lookup/SynLuDocumentClassificationService';

describe('SynLuDocumentClassificationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuDocumentClassificationService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/luDocumentClassification"),
  });
});
