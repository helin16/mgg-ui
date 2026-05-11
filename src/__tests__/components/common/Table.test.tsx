import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Table from '../../../components/common/Table';

jest.mock('react-select');

describe('Table', () => {
  test('renders rows and pagination controls', () => {
    const onSetCurrentPage = jest.fn();
    const onPageSizeChanged = jest.fn();

    render(
      <Table
        columns={[{key: 'name', header: 'Name', cell: (col: any, row: any) => <td key={col.key}>{row.name}</td>} as any]}
        rows={[{name: 'Alice'}]}
        pagination={{
          currentPage: 1,
          totalPages: 3,
          onSetCurrentPage,
          perPage: 10,
          onPageSizeChanged,
        }}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: '2'}));
    expect(onSetCurrentPage).toHaveBeenCalledWith(2);
  });
});
