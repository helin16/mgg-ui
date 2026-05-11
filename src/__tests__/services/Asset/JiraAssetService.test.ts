import ServiceTestHelper from '../../helper/ServiceTestHelper';
import JiraAssetService from '../../../services/Asset/JiraAssetService';

describe('JiraAssetService', () => {
  ServiceTestHelper.testCustom({
    name: 'triggerDownload',
    serviceFn: JiraAssetService.triggerDownload,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/jiraAssets"),
  });
});
