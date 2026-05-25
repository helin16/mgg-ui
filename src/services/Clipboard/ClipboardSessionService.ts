import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardSession from '../../types/Clipboard/iClipboardSession';

const endPoint = '/clipboard/session';

export type iClipboardSessionQueryParams = {
  activityIds?: number[];
  departmentIds?: number[];
  locationIds?: number[];
  sisIds?: string[];
  startDateTime?: string;
  endDateTime?: string;
  cancelled?: boolean;
  bye?: boolean;
  scored?: boolean;
  teamId?: number;
  includeTeams?: boolean;
  includeStaff?: boolean;
  includeRoundName?: boolean;
  includeSisIds?: boolean;
  includeCustomFieldsMetadata?: boolean;
  includeStatuses?: Array<'confirmed' | 'unconfirmed' | 'draft'>;
  excludeSessionsWithTeams?: boolean;
  updatedBefore?: string;
  updatedAfter?: string;
  perPage?: number;
  page?: number;
};

const buildQueryString = (params: iClipboardSessionQueryParams): iConfigParams => {
  const query: iConfigParams = {};

  if (params.activityIds && params.activityIds.length > 0) {
    query.activityIds = JSON.stringify(params.activityIds);
  }
  if (params.departmentIds && params.departmentIds.length > 0) {
    query.departmentIds = JSON.stringify(params.departmentIds);
  }
  if (params.locationIds && params.locationIds.length > 0) {
    query.locationIds = JSON.stringify(params.locationIds);
  }
  if (params.sisIds && params.sisIds.length > 0) {
    query.sisIds = JSON.stringify(params.sisIds);
  }
  if (params.startDateTime) {
    query.startDateTime = params.startDateTime;
  }
  if (params.endDateTime) {
    query.endDateTime = params.endDateTime;
  }
  if (params.cancelled !== undefined) {
    query.cancelled = params.cancelled;
  }
  if (params.bye !== undefined) {
    query.bye = params.bye;
  }
  if (params.scored !== undefined) {
    query.scored = params.scored;
  }
  if (params.teamId !== undefined) {
    query.teamId = params.teamId;
  }
  if (params.includeTeams !== undefined) {
    query.includeTeams = params.includeTeams;
  }
  if (params.includeStaff !== undefined) {
    query.includeStaff = params.includeStaff;
  }
  if (params.includeRoundName !== undefined) {
    query.includeRoundName = params.includeRoundName;
  }
  if (params.includeSisIds !== undefined) {
    query.includeSisIds = params.includeSisIds;
  }
  if (params.includeCustomFieldsMetadata !== undefined) {
    query.includeCustomFieldsMetadata = params.includeCustomFieldsMetadata;
  }
  if (params.includeStatuses && params.includeStatuses.length > 0) {
    query.includeStatuses = JSON.stringify(params.includeStatuses);
  }
  if (params.excludeSessionsWithTeams !== undefined) {
    query.excludeSessionsWithTeams = params.excludeSessionsWithTeams;
  }
  if (params.updatedBefore) {
    query.updatedBefore = params.updatedBefore;
  }
  if (params.updatedAfter) {
    query.updatedAfter = params.updatedAfter;
  }
  if (params.perPage !== undefined) {
    query.perPage = params.perPage;
  }
  if (params.page !== undefined) {
    query.page = params.page;
  }

  return query;
};

const getAll = (params?: iClipboardSessionQueryParams, config?: iConfigParams): Promise<iPaginatedResult<iClipboardSession>> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(endPoint, query, config).then(resp => resp.data);
};

const get = (id: string | number, params?: iClipboardSessionQueryParams, config?: iConfigParams): Promise<iClipboardSession> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(`${endPoint}/${id}`, query, config).then(resp => resp.data);
};

const ClipboardSessionService = {
  getAll,
  get,
};

export default ClipboardSessionService;
