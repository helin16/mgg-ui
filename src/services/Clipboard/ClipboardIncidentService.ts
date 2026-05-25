import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardIncident from '../../types/Clipboard/iClipboardIncident';

type iClipboardIncidentQueryParams = {
  sisIds?: string[];
  activityIds?: number[];
  startDateTime?: string;
  endDateTime?: string;
  concussionStatuses?: Array<'none' | 'potential' | 'confirmed' | 'any'>;
  updatedBefore?: string;
  updatedAfter?: string;
} & iConfigParams;

const endPoint = '/clipboard/incident';

const getAll = (
  params: iClipboardIncidentQueryParams = {},
  config?: iConfigParams
): Promise<iPaginatedResult<iClipboardIncident>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const get = (
  id: string | number,
  params: iConfigParams = {},
  config?: iConfigParams
): Promise<iClipboardIncident> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
};

const ClipboardIncidentService = {
  getAll,
  get,
};

export default ClipboardIncidentService;
