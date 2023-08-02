import React, {useEffect, useState} from "react";
import { Table as Original, TableProps } from "react-bootstrap";
import styled from "styled-components";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import MathHelper from '../../helper/MathHelper';
import * as _ from 'lodash';

export type iTableColumn = {
  key: string;
  isDefault?: boolean;
  group?: string;
  name?: string;
  isSelectable?: boolean;
  header: ((column: iTableColumn) => any) | any;
  footer?: ((column: iTableColumn) => any) | any;
  cell?: ((column: iTableColumn, data?: any) => any) | string;
  sort?: number;
};

type iTable = TableProps & {
  showPaginator?: boolean;
  columns: iTableColumn[];
  rows?: any[];
  pagination?: iTablePagination;
};

type iTablePagination = {
  totalPages: number;
  currentPage: number;
  onSetCurrentPage: (currentPage: number) => void;
};

const Wrapper = styled.div``;
const Table = ({
  columns,
  pagination,
  rows = [],
  ...props
}: iTable) => {

  const [cols, setCols] = useState<iTableColumn[]>([]);
  const [hasFooter, setHasFooter] = useState(false);

  useEffect(() => {
    setCols(columns.sort((col1, col2) => (col1.sort || 0 ) < (col2.sort || 0) ? -1 : 1));
    setHasFooter(columns.filter(col => col.footer !== undefined).length > 0);
  }, [columns])

  const getPaginationBtns = () => {
    if (!pagination || !pagination?.currentPage || !pagination?.currentPage) {
      return [];
    }

    const windowSize = 7;
    const maxPageNo = (pagination?.totalPages || 0);

    if (maxPageNo <= windowSize) {
      return _.range(1, MathHelper.add(maxPageNo, 1));
    }

    if (pagination?.currentPage >= MathHelper.sub(maxPageNo, MathHelper.div(windowSize, 2))) {
      return _.range(MathHelper.sub(MathHelper.add(maxPageNo,  1), windowSize), MathHelper.add(maxPageNo,  1));
    }

    let start = MathHelper.sub(pagination?.currentPage, 2) < 1 ? 1 : MathHelper.sub(pagination?.currentPage, 2);
    let end = MathHelper.add(start, windowSize) > maxPageNo ? MathHelper.add(maxPageNo,  1) : MathHelper.add(start, windowSize);
    return _.range(start, end);
  }

  const getPaginator = () => {
    if (!pagination || (pagination.totalPages || 0) <= 0 || (pagination.currentPage || 0) >= (pagination.totalPages || 0)) {
      return null;
    }

    return (
      <ButtonToolbar className={'pagination-wrapper'}>
        {pagination.currentPage <= 1 ? null : (
          <ButtonGroup>
            <Button variant={'link'} onClick={() => pagination?.onSetCurrentPage(1)}>{'<<'}</Button>
            <Button variant={'link'} onClick={() => pagination?.onSetCurrentPage(MathHelper.sub(pagination.currentPage, 1))}>{'<'}</Button>
          </ButtonGroup>
        )}

        <ButtonGroup>
          {getPaginationBtns().map(index => {
            return (
              <Button
                key={index}
                variant={index === pagination.currentPage ? 'primary' : 'link'}
                onClick={() => pagination?.onSetCurrentPage(index)}>
                {index}
              </Button>
            );
          })}
        </ButtonGroup>

        {pagination.currentPage >= pagination.totalPages ? null : (
          <ButtonGroup>
            <Button variant={'link'} onClick={() => pagination?.onSetCurrentPage(MathHelper.add(pagination.currentPage, 1))}>{'>'}</Button>
            <Button variant={'link'} onClick={() => pagination?.onSetCurrentPage(pagination?.totalPages)}>{'>>'}</Button>
          </ButtonGroup>
        )}
      </ButtonToolbar>
    );
  };

  const getCell = (column: iTableColumn, data: any) => {
    if (typeof column.cell !== "function") {
      return <td key={column.key}>{column.cell}</td>
    }
    const result = column.cell(column, data);
    if (typeof result === 'string') {
      return <td key={column.key}>{result}</td>
    }

    return result;
  }

  return (
    <Wrapper>
      <Original {...props}>
        <thead>
          <tr>
            {cols.map(column => {
              return typeof column.header === "function" ? (
                column.header(column)
              ) : (
                <th key={column.key}>{column.header}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => {
              return (
                <tr key={index}>
                  {cols.map(column => getCell(column, row))}
                </tr>
              )
            })}
        </tbody>
        {hasFooter ? (
          <tfoot>
            <tr>
              {cols.map(column => {
                return typeof column.footer === "function" ? (
                  column.footer(column)
                ) : (
                  <td key={column.key}>{column.footer}</td>
                );
              })}
            </tr>
          </tfoot>
        ) : null}
      </Original>
      {getPaginator()}
    </Wrapper>
  );
};

export default Table;
