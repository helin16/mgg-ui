import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardActivity from '../../types/Clipboard/iClipboardActivity';

const endPoint = '/clipboard/activity';
const MAX_PAGE_SIZE = 200; // Clipboard API maximum page length

export type iClipboardActivityQueryParams = {
  pageLength?: number;
  page?: number;
  departmentIds?: number[];
  search?: string;  // Search by activity name
  sortBy?: string;  // Sort field (e.g., 'name', 'code', 'archived')
  sortOrder?: 'asc' | 'desc';  // Sort order
  archived?: boolean | null;  // Filter by archived status (null = all, true = archived only, false = non-archived only)
};

const buildQueryString = (params: iClipboardActivityQueryParams): iConfigParams => {
  const query: iConfigParams = {};

  if (params.pageLength !== undefined) {
    query.pageLength = params.pageLength;
  }
  if (params.page !== undefined) {
    query.page = params.page;
  }
  // NOTE: departmentIds is NOT supported by the backend API
  // We will filter client-side instead
  if (params.search !== undefined && params.search.length > 0) {
    query.search = params.search;
  }
  if (params.sortBy !== undefined) {
    query.sortBy = params.sortBy;
  }
  if (params.sortOrder !== undefined) {
    query.sortOrder = params.sortOrder;
  }
  if (params.archived !== undefined && params.archived !== null) {
    query.archived = params.archived.toString();
  }

  return query;
};

/**
 * Client-side filters data based on departmentIds and archived status
 * Since the backend API doesn't support these filters
 */
const applyClientFilters = (
  data: iClipboardActivity[],
  params?: iClipboardActivityQueryParams
): iClipboardActivity[] => {
  let filtered = [...data];

  // Filter by department IDs (client-side since backend doesn't support)
  if (params?.departmentIds && params.departmentIds.length > 0) {
    filtered = filtered.filter((activity) =>
      params.departmentIds!.includes(activity.department?.id || -1)
    );
  }

  // Filter by archived status
  if (params?.archived !== undefined && params.archived !== null) {
    filtered = filtered.filter((activity) => activity.archived === params.archived);
  }

  return filtered;
};

const getAll = (
  params?: iClipboardActivityQueryParams,
  config?: iConfigParams
): Promise<iPaginatedResult<iClipboardActivity>> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(endPoint, query, config).then(resp => {
    const data = resp.data;
    
    // Apply client-side filters for departmentIds and archived
    const filteredData = applyClientFilters(data.data || [], params);
    
    // Transform API response to match iPaginatedResult format
    if (data.pagination) {
      return {
        data: filteredData,
        total: filteredData.length,  // Adjust total based on filtered results
        pages: data.pagination.lastPage || 1,  // Use actual lastPage from API
        currentPage: data.pagination.currentPage || 1,
        perPage: data.pagination.pageLength || 200,
        from: ((data.pagination.currentPage || 1) - 1) * (data.pagination.pageLength || 200) + 1,
        to: Math.min((data.pagination.currentPage || 1) * (data.pagination.pageLength || 200), filteredData.length),
      } as iPaginatedResult<iClipboardActivity>;
    }
    
    // Fallback for responses without pagination object
    return {
      data: filteredData,
      total: filteredData.length,
      pages: 1,
      currentPage: 1,
      perPage: params?.pageLength || 200,
      from: 1,
      to: filteredData.length,
    } as iPaginatedResult<iClipboardActivity>;
  });
};

/**
 * Fetch all activities by paginating through all pages
 * This bypasses the maximum page length limit by fetching in chunks of 200
 */
const getAllRecords = async (
  params?: iClipboardActivityQueryParams,
  config?: iConfigParams
): Promise<iClipboardActivity[]> => {
  const allActivities: iClipboardActivity[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await getAll(
      { ...params, pageLength: MAX_PAGE_SIZE, page: currentPage },
      config
    );
    
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
  params?: Omit<iClipboardActivityQueryParams, 'departmentIds' | 'page' | 'pageLength'>,
  config?: iConfigParams
): Promise<iClipboardActivity> => {
  const query = params ? buildQueryString(params as iClipboardActivityQueryParams) : {};
  return AppService.get(`${endPoint}/${id}`, query, config).then(resp => resp.data);
};

const ClipboardActivityService = {
  getAll,
  getAllRecords,
  get,
  applyClientFilters,
};

export default ClipboardActivityService;
