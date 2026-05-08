import AppService, {iConfigParams} from '../AppService';

const endPoint = '/jiraAssets';

const triggerDownload = (params: iConfigParams = {}, config?: iConfigParams): Promise<Record<string, never>> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
};

const JiraAssetService = {
  triggerDownload,
};

export default JiraAssetService;
