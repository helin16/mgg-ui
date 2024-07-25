import React, { useEffect, useState } from "react";
import {
  Pagination,
  Spinner,
  Table as Original,
  TableProps
} from "react-bootstrap";
import styled from "styled-components";
import MathHelper from "../../helper/MathHelper";
import * as _ from "lodash";
import { FlexContainer } from "../../styles";
import SelectBox from "./SelectBox";
import iPaginatedResult from "../../types/iPaginatedResult";

export const TABLE_COLUMN_FORMAT_DATE = "Date";
export const TABLE_COLUMN_FORMAT_BOOLEAN = "Boolean";
export const TABLE_COLUMN_FORMAT_CALCULATED = "Calculated";

export type iTableColumn<T> = {
  key: string;
  isDefault?: boolean;
  format?: string;
  group?: string;
  name?: string;
  isSelectable?: boolean;
  header: ((column: iTableColumn<T>) => any) | any;
  footer?: ((column: iTableColumn<T>) => any) | any;
  cell?:
    | ((column: iTableColumn<T>, data?: any, index?: number) => any)
    | string;
  sort?: number;
};

type iTablePaginationPageSize = {
  start?: number;
  end?: number;
  steps?: number;
};

export type iTablePagination = {
  totalPages: number;
  currentPage: number;
  onSetCurrentPage: (currentPage: number) => void;
  perPage?: number;
  onPageSizeChanged?: (pageSize: number) => void;
  pageSizeProps?: iTablePaginationPageSize;
};

export type iTable<T> = TableProps & {
  isLoading?: boolean;
  showPaginator?: boolean;
  showHeader?: boolean;
  columns: iTableColumn<T>[];
  rows?: T[] | iPaginatedResult<T>;
  pagination?: iTablePagination;
};

const Wrapper = styled.div`
  .table-wrapper {
    position: relative;
    .loading-mask {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      height: 100%;
      width: 100%;
      background-color: rgba(200, 200, 200, 0.75);
      color: #fff;
      .spinner-wrapper {
        width: 50%;
        margin: 3rem auto;
        text-align: center;
      }
    }
  }

  .pagination-wrapper {
    margin-top: 1rem;
    margin-left: 0px;
    .page-item {
      background-color: white;
      .page-link {
        padding: 0.375rem 0.75rem;
      }
    }
  }

  .page-size-selector-wrapper {
    .page-size-selector {
      [class$="-control"] {
        min-height: 33.5px;
        [class$="-ValueContainer"],
        [class$="-indicatorContainer"] {
          padding-top: 0px;
          padding-bottom: 0px;
        }
      }
    }
  }
`;
const Table = <T extends {}>({
  isLoading = false,
  showHeader = true,
  columns,
  pagination,
  rows = [],
  ...props
}: iTable<T>) => {
  const [cols, setCols] = useState<iTableColumn<T>[]>([]);
  const [hasFooter, setHasFooter] = useState(false);

  useEffect(() => {
    setCols(
      columns.sort((col1, col2) =>
        (col1.sort || 0) < (col2.sort || 0) ? -1 : 1
      )
    );
    setHasFooter(columns.filter(col => col.footer !== undefined).length > 0);
  }, [columns]);

  const getPaginationBtns = () => {
    if (!pagination || !pagination?.currentPage || !pagination?.currentPage) {
      return [];
    }

    const windowSize = 7;
    const maxPageNo = pagination?.totalPages || 0;

    if (maxPageNo <= windowSize) {
      return _.range(1, MathHelper.add(maxPageNo, 1));
    }

    if (
      pagination?.currentPage >=
      MathHelper.sub(maxPageNo, MathHelper.div(windowSize, 2))
    ) {
      return _.range(
        MathHelper.sub(MathHelper.add(maxPageNo, 1), windowSize),
        MathHelper.add(maxPageNo, 1)
      );
    }

    let start =
      MathHelper.sub(pagination?.currentPage, 2) < 1
        ? 1
        : MathHelper.sub(pagination?.currentPage, 2);
    let end =
      MathHelper.add(start, windowSize) > maxPageNo
        ? MathHelper.add(maxPageNo, 1)
        : MathHelper.add(start, windowSize);
    return _.range(start, end);
  };

  const getPageSizeSelector = () => {
    if (!pagination || !pagination.onPageSizeChanged) {
      return null;
    }

    const currentPerPage =
      pagination.perPage || pagination.pageSizeProps?.start || 10;
    const options = _.uniq([
      ..._.range(
        pagination.pageSizeProps?.start || 10,
        pagination.pageSizeProps?.end || 100,
        pagination.pageSizeProps?.steps || 10
      ),
      pagination.pageSizeProps?.end || 100,
      currentPerPage
    ])
      .sort((num1, num2) => (num1 > num2 ? 1 : -1))
      .map(number => ({ label: number, value: number }));
    return (
      <FlexContainer
        className={
          "page-size-selector-wrapper with-gap lg-gap align-items center"
        }
      >
        <div>Page:</div>
        <SelectBox
          options={options}
          className={"page-size-selector"}
          onChange={option =>
            pagination.onPageSizeChanged &&
            pagination.onPageSizeChanged(option === null ? null : option.value)
          }
          value={options.filter(option => option.value === currentPerPage)}
          showIndicatorSeparator={false}
        />
      </FlexContainer>
    );
  };

  const getPageSelector = () => {
    if (
      !pagination ||
      (pagination.totalPages || 0) <= 1 ||
      (pagination.currentPage || 0) > (pagination.totalPages || 0)
    ) {
      return <div />;
    }

    return (
      <Pagination className={"pagination-wrapper"}>
        {pagination.currentPage <= 1 ? null : (
          <>
            <Pagination.First onClick={() => pagination?.onSetCurrentPage(1)} />
            <Pagination.Prev
              onClick={() =>
                pagination?.onSetCurrentPage(
                  MathHelper.sub(pagination.currentPage, 1)
                )
              }
            />
          </>
        )}

        {getPaginationBtns().map(index => {
          return (
            <Pagination.Item
              active={index === pagination.currentPage}
              key={index}
              onClick={() => pagination?.onSetCurrentPage(index)}
            >
              {index}
            </Pagination.Item>
          );
        })}

        {pagination.currentPage >= pagination.totalPages ? null : (
          <>
            {/*<Pagination.Ellipsis disabled/>*/}
            <Pagination.Next
              onClick={() =>
                pagination?.onSetCurrentPage(
                  MathHelper.add(pagination.currentPage, 1)
                )
              }
            />
            <Pagination.Last
              onClick={() =>
                pagination?.onSetCurrentPage(pagination?.totalPages)
              }
            />
          </>
        )}
      </Pagination>
    );
  };

  const getPaginator = () => {
    if (!pagination) {
      return null;
    }

    return (
      <FlexContainer className={"justify-content-between"}>
        {getPageSelector()}
        {getPageSizeSelector()}
      </FlexContainer>
    );
  };

  const getCell = (column: iTableColumn<T>, data: any, index?: number) => {
    if (typeof column.cell !== "function") {
      return <td key={column.key}>{column.cell}</td>;
    }
    const result = column.cell(column, data, index);
    if (typeof result === "string") {
      return <td key={column.key}>{result}</td>;
    }

    return result;
  };

  const getLoadingMask = () => {
    if (!isLoading) {
      return null;
    }
    return (
      <div className={"loading-mask"}>
        <div className={"spinner-wrapper"}>
          <Spinner animation={"border"} />
          <p>Loading...</p>
        </div>
      </div>
    );
  };

  const dataRow = Array.isArray(rows) ? rows : "data" in rows ? rows.data : [];
  return (
    <Wrapper>
      <div className={"table-wrapper"}>
        {getLoadingMask()}
        <Original {...props}>
          {showHeader && (
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
          )}
          <tbody>
            {dataRow.map((row, index) => {
              return (
                <tr key={index}>
                  {cols.map(column => getCell(column, row, index))}
                </tr>
              );
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
      </div>
      {getPaginator()}
    </Wrapper>
  );
};

export default Table;
