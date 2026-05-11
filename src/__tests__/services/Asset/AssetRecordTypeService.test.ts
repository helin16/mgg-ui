import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetRecordTypeService from '../../../services/Asset/AssetRecordTypeService';

describe('AssetRecordTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: AssetRecordTypeService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/assetRecordType"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: AssetRecordTypeService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/assetRecordType"),
  });
});
