import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetRecordTypeService from '../../../services/Asset/AssetRecordTypeService';

describe('AssetRecordTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: AssetRecordTypeService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/assetRecordType", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: AssetRecordTypeService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/assetRecordType/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
