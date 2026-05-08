import ServiceTestHelper from '../../helper/ServiceTestHelper';
import JiraAssetService from '../../../services/Asset/JiraAssetService';

describe('JiraAssetService', () => {
  const endPoint = '/jiraAssets';

  ServiceTestHelper.testCreate(endPoint, JiraAssetService.triggerDownload);
});
