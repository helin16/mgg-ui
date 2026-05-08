import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const actual = jest.requireActual('../Table');
const {key, testId} = ComponentTestHelper.getKeyAndTestId('Table');

export const TableKey = key;
export const TableTestId = testId;

const BaseTable = ComponentTestHelper.mockComponent(
  TableKey,
  TableTestId
);

const Table = (props: any) => {
  BaseTable(props);

  const columns = props.columns || [];
  const rows = props.rows || [];

  return (
    <table data-testid={TableTestId}>
      <tbody>
        {rows.map((row: any, rowIndex: number) => (
          <tr key={row.ID || row.id || rowIndex}>
            {columns.map((column: any) => {
              if (typeof column.cell === 'function') {
                return column.cell(column, row, rowIndex);
              }

              return <td key={column.key}>{row[column.key]}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

module.exports = {
  ...actual,
  __esModule: true,
  default: Table,
  TableKey,
  TableTestId,
};
