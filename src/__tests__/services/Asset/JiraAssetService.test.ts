import ServiceTestHelper from '../../helper/ServiceTestHelper';
import JiraAssetService from '../../../services/Asset/JiraAssetService';

describe('JiraAssetService', () => {
  ServiceTestHelper.testCustom({
    name: 'triggerDownload',
    serviceFn: JiraAssetService.triggerDownload,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/jiraAssets", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
