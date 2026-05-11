import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('useListCrudHook');

export const useListCrudHookKey = key;
export const useListCrudHookTestId = testId;

let mockValue: any = null;

const getDefaultValue = () => ({
  state: {
    isLoading: false,
    data: {
      data: [],
      currentPage: 1,
      pages: 1,
    },
  },
  onRefresh: jest.fn(),
  onRefreshOnCurrentPage: jest.fn(),
});

export const resetUseListCrudHookMock = () => {
  mockValue = getDefaultValue();
};

export const setUseListCrudHookMock = (value: any) => {
  mockValue = {
    ...getDefaultValue(),
    ...value,
    state: {
      ...getDefaultValue().state,
      ...(value?.state || {}),
      data: {
        ...getDefaultValue().state.data,
        ...(value?.state?.data || {}),
      },
    },
  };
};

resetUseListCrudHookMock();

const useListCrudHook = (config: any) => {
  ComponentTestHelper.mockComponent(useListCrudHookKey, useListCrudHookTestId)(config);
  const state = mockValue?.state || getDefaultValue().state;

  return {
    ...mockValue,
    renderDataTable: ({columns, rows}: any) => {
      const dataRows = rows || state?.data?.data || [];

      return (
        <table data-testid={useListCrudHookTestId}>
          <thead>
            <tr>
              {columns.map((column: any) =>
                typeof column.header === 'function'
                  ? column.header(column)
                  : <th key={column.key}>{column.header}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row: any, rowIndex: number) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column: any) => column.cell(column, row, rowIndex))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
  };
};

export default useListCrudHook;
