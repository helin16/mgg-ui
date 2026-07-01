type iFinanceDebitorSearchCriteria = {
  searchText: string;
  selectedStudentId: number | null;
  selectedStudentDebtorId: number | null;
  currentPage: number;
  perPage: number;
};

export default iFinanceDebitorSearchCriteria;
