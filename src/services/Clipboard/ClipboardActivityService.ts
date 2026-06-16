import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardActivity from '../../types/Clipboard/iClipboardActivity';

const endPoint = '/clipboard/activity';
const MAX_PAGE_SIZE = 200; // Clipboard API maximum page length

export type iClipboardActivityQueryParams = {
  pageLength?: number;
  page?: number;
  departmentIds?: number[];
};

const buildQueryString = (params: iClipboardActivityQueryParams): iConfigParams => {
  const query: iConfigParams = {};

  if (params.pageLength !== undefined) {
    query.pageLength = params.pageLength;
  }
  if (params.page !== undefined) {
    query.page = params.page;
  }
  if (params.departmentIds !== undefined && params.departmentIds.length > 0) {
    query.departmentIds = JSON.stringify(params.departmentIds);
  }

  return query;
};

const getAll = (
  params?: iClipboardActivityQueryParams,
  config?: iConfigParams
): Promise<iPaginatedResult<iClipboardActivity>> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(endPoint, query, config).then(resp => {
    const data = resp.data;
    
    // Transform API response to match iPaginatedResult format
    if (data.pagination) {
      return {
        data: data.data || [],
        total: data.pagination.numRecords || 0,
        pages: data.pagination.lastPage || 1,
        currentPage: data.pagination.currentPage || 1,
        perPage: data.pagination.pageLength || 10,
        from: ((data.pagination.currentPage || 1) - 1) * (data.pagination.pageLength || 10) + 1,
        to: (data.pagination.currentPage || 1) * (data.pagination.pageLength || 10),
      } as iPaginatedResult<iClipboardActivity>;
    }
    
    return data;
  });
};

/**
 * Fetch all activities by paginating through all pages
 * This bypasses the maximum page length limit by fetching in chunks of 200
 */
const getAllRecords = async (
  config?: iConfigParams
): Promise<iClipboardActivity[]> => {
  const allActivities: iClipboardActivity[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await getAll({ pageLength: MAX_PAGE_SIZE, page: currentPage }, config);
    
    if (result.data && result.data.length > 0) {
      allActivities.push(...result.data);
    }
    
    totalPages = result.pages || 1;
    currentPage++;
  }

  return allActivities;
};

const get = (
  id: string | number,
  params?: iClipboardActivityQueryParams,
  config?: iConfigParams
): Promise<iClipboardActivity> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(`${endPoint}/${id}`, query, config).then(resp => resp.data);
};

const ClipboardActivityService = {
  getAll,
  getAllRecords,
  get,
};

export default ClipboardActivityService;
