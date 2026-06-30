import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardAttendance from '../../types/Clipboard/iClipboardAttendance';

const endPoint = '/clipboard/attendance';
const MAX_PAGE_SIZE = 200;

export type iClipboardAttendanceQueryParams = {
  activityIds?: number[];
  departmentIds?: number[];
  studentSisIds?: string[];
  includeSession?: boolean;
  includeStudent?: boolean;
  timePeriod?: 'today' | 'yesterday' | 'last-week' | 'last-30-days' | 'last-90-days' | 'last-6-months' | 'this-year' | 'last-year' | 'custom';
  startDateTime?: string;
  endDateTime?: string;
  absent?: boolean;
  explained?: boolean;
  updatedBefore?: string;
  updatedAfter?: string;
  page?: number;
  pageLength?: number;
};

const buildQueryString = (params: iClipboardAttendanceQueryParams): iConfigParams => {
  const query: iConfigParams = {};

  if (params.activityIds && params.activityIds.length > 0) {
    query.activityIds = JSON.stringify(params.activityIds);
  }
  if (params.departmentIds && params.departmentIds.length > 0) {
    query.departmentIds = JSON.stringify(params.departmentIds);
  }
  if (params.studentSisIds && params.studentSisIds.length > 0) {
    query.studentSisIds = JSON.stringify(params.studentSisIds);
  }
  if (params.includeSession !== undefined) {
    query.includeSession = params.includeSession;
  }
  if (params.includeStudent !== undefined) {
    query.includeStudent = params.includeStudent;
  }
  if (params.timePeriod) {
    query.timePeriod = params.timePeriod;
  }
  if (params.startDateTime) {
    query.startDateTime = params.startDateTime;
  }
  if (params.endDateTime) {
    query.endDateTime = params.endDateTime;
  }
  if (params.absent !== undefined) {
    query.absent = params.absent;
  }
  if (params.explained !== undefined) {
    query.explained = params.explained;
  }
  if (params.updatedBefore) {
    query.updatedBefore = params.updatedBefore;
  }
  if (params.updatedAfter) {
    query.updatedAfter = params.updatedAfter;
  }
  if (params.page !== undefined) {
    query.page = params.page;
  }
  if (params.pageLength !== undefined) {
    query.pageLength = params.pageLength;
  }

  return query;
};

const getAll = (params?: iClipboardAttendanceQueryParams, config?: iConfigParams): Promise<iPaginatedResult<iClipboardAttendance>> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(endPoint, query, config).then(resp => resp.data);
};

const get = (id: string | number, params?: iClipboardAttendanceQueryParams, config?: iConfigParams): Promise<iClipboardAttendance> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(`${endPoint}/${id}`, query, config).then(resp => resp.data);
};

const getAllRecords = async (
  params?: Omit<iClipboardAttendanceQueryParams, 'pageLength' | 'page'>,
  config?: iConfigParams
): Promise<iClipboardAttendance[]> => {
  const allRecords: iClipboardAttendance[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await getAll(
      {
        ...params,
        pageLength: MAX_PAGE_SIZE,
        page: currentPage,
      },
      config
    );

    if (result.data && result.data.length > 0) {
      allRecords.push(...result.data);
    }

    totalPages = (result as any).pagination?.lastPage || (result as any).pages || 1;
    currentPage++;
  }

  return allRecords;
};

const ClipboardAttendanceService = {
  getAll,
  get,
  getAllRecords,
};

export default ClipboardAttendanceService;
