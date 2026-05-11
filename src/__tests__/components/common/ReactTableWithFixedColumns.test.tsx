import React from 'react';
import {render, screen} from '@testing-library/react';
import ReactTableWithFixedColumns from '../../../components/common/ReactTableWithFixedColumns';

jest.mock('react-table', () => require('../../../../__mocks__/react-table'));
jest.mock('react-table-sticky', () => require('../../../../__mocks__/react-table-sticky'));

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
