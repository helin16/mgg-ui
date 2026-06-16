import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardDepartment from '../../types/Clipboard/iClipboardDepartment';

const endPoint = '/clipboard/department';

export type iClipboardDepartmentQueryParams = {
  pageLength?: number;
  page?: number;
};

const buildQueryString = (params: iClipboardDepartmentQueryParams): iConfigParams => {
  const query: iConfigParams = {};

  if (params.pageLength !== undefined) {
    query.pageLength = params.pageLength;
  }
  if (params.page !== undefined) {
    query.page = params.page;
  }

  return query;
};

const MAX_PAGE_SIZE = 200; // Clipboard API maximum page length

const getAll = (
  params?: iClipboardDepartmentQueryParams,
  config?: iConfigParams
): Promise<iPaginatedResult<iClipboardDepartment>> => {
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
      } as iPaginatedResult<iClipboardDepartment>;
    }
    
    return data;
  });
};

/**
 * Fetch all departments by paginating through all pages
 * This bypasses the maximum page length limit by fetching in chunks of 200
 */
const getAllRecords = async (
  config?: iConfigParams
): Promise<iClipboardDepartment[]> => {
  const allDepartments: iClipboardDepartment[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const result = await getAll({ pageLength: MAX_PAGE_SIZE, page: currentPage }, config);
    
    if (result.data && result.data.length > 0) {
      allDepartments.push(...result.data);
    }
    
    totalPages = result.pages || 1;
    currentPage++;
  }

  return allDepartments;
};

const get = (
  id: string | number,
  params?: iClipboardDepartmentQueryParams,
  config?: iConfigParams
): Promise<iClipboardDepartment> => {
  const query = params ? buildQueryString(params) : {};
  return AppService.get(`${endPoint}/${id}`, query, config).then(resp => resp.data);
};

const ClipboardDepartmentService = {
  getAll,
  getAllRecords,
  get,
};

export default ClipboardDepartmentService;
