const buildHeader = (column: any) => ({
  ...column,
  getHeaderProps: () => ({key: column.id || column.accessor || column.Header}),
  getResizerProps: () => ({}),
  render: (type: string) => (type === 'Header' ? column.Header : column.Footer),
});

export const useBlockLayout = jest.fn();
export const useResizeColumns = jest.fn();

export const useTable = ({columns, data}: any) => {
  const headerGroup = {
    getHeaderGroupProps: () => ({key: 'header'}),
    headers: columns.map(buildHeader),
  };

  const footerGroup = {
    getHeaderGroupProps: () => ({key: 'footer'}),
    headers: columns.map(buildHeader),
  };

  const rows = (data || []).map((row: any, index: number) => ({
    original: row,
    getRowProps: () => ({key: row.id || index}),
    cells: columns.map((column: any) => ({
      column,
      getCellProps: () => ({key: `${column.id || column.accessor || column.Header}-${index}`}),
      render: (type: string) => {
        if (type !== 'Cell') {
          return null;
        }
        if (typeof column.accessor === 'function') {
          return column.accessor(row, index);
        }
        return row[column.accessor || column.id];
      },
    })),
  }));

  return {
    getTableProps: () => ({}),
    getTableBodyProps: () => ({}),
    headerGroups: [headerGroup],
    footerGroups: [footerGroup],
    rows,
    prepareRow: jest.fn(),
  };
};
