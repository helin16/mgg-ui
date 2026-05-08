import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDocumentClassificationService from '../../../../services/Synergetic/Lookup/SynLuDocumentClassificationService';

describe('SynLuDocumentClassificationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuDocumentClassificationService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/luDocumentClassification", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
