import { useTable, useBlockLayout } from 'react-table';
import { useSticky } from 'react-table-sticky';
import styled from 'styled-components';
import {useMemo} from 'react';

type iReactTableWithFixedColumns = {
  data: any[];
  columns: any[];
  columnDefaultOptions?: any;
}

const Wrapper = styled.div`
  .table {
    width: 100%;
    //max-height: 100vh;
    margin-bottom: 0px;
    font-size: 11px;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;
      border-bottom: 1px solid #ddd;

      :last-child {
        border-right: 0;
      }
    }
    .th {
      font-weight: bold;
    }

    &.sticky {
      overflow: auto;
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
    }
  }
`

const ReactTableWithFixedColumns = ({
  data,
  columns,
  columnDefaultOptions = { minWidth: 40, width: 100, maxWidth: 250 },
}: iReactTableWithFixedColumns) => {

  const defaultColumn = useMemo(() => columnDefaultOptions,[columnDefaultOptions]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useBlockLayout,
    useSticky,
  );

  // // Workaround as react-table footerGroups doesn't provide the same internal data than headerGroups
  // const footerGroups = headerGroups.slice().reverse();

  return (
    <Wrapper>
      <div {...getTableProps()} className="table sticky">
        <div className="header">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => (
                  <div {...cell.getCellProps()} className={`td`}>
                    {cell.render('Cell')}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {/*<div className="footer">*/}
        {/*  {footerGroups.map((footerGroup) => (*/}
        {/*    <div {...footerGroup.getHeaderGroupProps()} className="tr">*/}
        {/*      {footerGroup.headers.map((column) => (*/}
        {/*        <div {...column.getHeaderProps()} className="td">*/}
        {/*          {column.render('Footer')}*/}
        {/*        </div>*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
    </Wrapper>
  )
}

export default ReactTableWithFixedColumns
