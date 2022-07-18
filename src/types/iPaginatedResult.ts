type iPaginatedResult<T> = {
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  total: number;
  data: T[];
  pages: number;
}
export default iPaginatedResult;
