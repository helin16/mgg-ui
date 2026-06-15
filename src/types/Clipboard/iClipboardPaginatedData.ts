/**
 * Paginated data response structure
 */
type iClipboardPaginatedData<T> = {
  data: T[];
  currentPage: number;
  pageLength: number;
  numRecords: number;
  lastPage: number;
};

export default iClipboardPaginatedData;
