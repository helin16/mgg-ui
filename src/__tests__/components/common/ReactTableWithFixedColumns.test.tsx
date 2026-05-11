import React from 'react';
import {render, screen} from '@testing-library/react';
import ReactTableWithFixedColumns from '../../../components/common/ReactTableWithFixedColumns';

jest.mock('react-table', () => {
  const buildHeader = (column: any) => ({
    ...column,
    getHeaderProps: () => ({key: column.id || column.accessor || column.Header}),
    getResizerProps: () => ({}),
    render: (type: string) => (type === 'Header' ? column.Header : column.Footer),
  });

  return {
    __esModule: true,
    useBlockLayout: jest.fn(),
    useResizeColumns: jest.fn(),
    useTable: ({columns, data}: any) => {
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
            if (type !== 'Cell') return null;
            if (typeof column.accessor === 'function') return column.accessor(row, index);
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
    },
  };
});

jest.mock('react-table-sticky', () => ({
  __esModule: true,
  useSticky: jest.fn(),
}));

describe('ReactTableWithFixedColumns', () => {
  test('renders rows and the loading mask', () => {
    render(
      <ReactTableWithFixedColumns
        isLoading
        data={[{name: 'Alice'}]}
        columns={[{Header: 'Name', accessor: 'name'}]}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
