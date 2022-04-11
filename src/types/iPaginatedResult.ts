type iPaginatedResult<T> = {
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  total: number;
  data: T[];
}
export default iPaginatedResult;
