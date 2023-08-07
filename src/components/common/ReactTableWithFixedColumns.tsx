import {useTable, useBlockLayout, useResizeColumns} from 'react-table';
import { useSticky } from 'react-table-sticky';
import styled from 'styled-components';
import {useEffect, useMemo, useState} from 'react';

type iReactTableWithFixedColumns = {
  hover?: boolean;
  htmlId?: string;
  className?: string;
  data: any[];
  columns: any[];
  columnDefaultOptions?: any;
}

const Wrapper = styled.div`
  width: 100%;
  overflow: auto;
  .table {
    [data-sticky-td] {
      background-color: white;
    }
    
    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th {
      font-weight: bold;
      background-color: white;
      line-height: 1 !important;
      &[data-sticky-last-left-td] {
        position: sticky !important;
      }
    }
    
    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: #aaa;
        }
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
    
    &.hover {
      background-color: transparent;
      .tr:hover {
        background-color: #ececec;
        .td {
          background-color: transparent;
        }
      }
    }
  }
`

const ReactTableWithFixedColumns = ({
  hover,
  htmlId,
  data,
  columns,
  className,
  columnDefaultOptions = { minWidth: 40, width: 100, maxWidth: 250 },
}: iReactTableWithFixedColumns) => {

  const [hasFooter, setHasFooter] = useState(false);
  const defaultColumn = useMemo(() => columnDefaultOptions,[columnDefaultOptions]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useSticky,
    useResizeColumns,
  );

  useEffect(() => {
    setHasFooter(columns.filter(column => column.Footer).length > 0);
  }, [columns]);

  const getFooter = () => {
    if (hasFooter !== true) {
      return null;
    }
    return (
      <tfoot className="footer">
        {footerGroups.map((footerGroup) => (
          <tr {...footerGroup.getHeaderGroupProps()} className="tr">
            {footerGroup.headers.map((column) => (
              <td {...column.getHeaderProps()} className="td">
                {column.render('Footer')}
              </td>
            ))}
          </tr>
        ))}
      </tfoot>
    )
  }

  return (
    <Wrapper className={className}>
      <table {...getTableProps()} className={`table sticky ${hover ? 'hover' : ''}`} id={htmlId}>
        <thead className="header">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                  <div
                    // @ts-ignore
                    {...column.getResizerProps()}
                    // @ts-ignore
                    className={`resizer ${column.isResizing ? "isResizing" : "" }`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  // @ts-ignore
                  if (cell.column.CellRender) {
                    // @ts-ignore
                    return cell.column.CellRender(cell, {...cell.getCellProps(), className: 'td'});
                  }
                  return (
                    <td {...cell.getCellProps()} className={`td`}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            );
          })}
        </tbody>
        {getFooter()}
      </table>
    </Wrapper>
  )
}

export default ReactTableWithFixedColumns
