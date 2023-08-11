import { useEffect, useState } from "react";
import iPaginatedResult from "../../../../types/iPaginatedResult";
import { iVPastAndCurrentStudent } from "../../../../types/Synergetic/iVStudent";
import SynVStudentService from "../../../../services/Synergetic/SynVStudentService";
import Toaster from "../../../../services/Toaster";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import styled from "styled-components";
import Table, { iTableColumn } from "../../../../components/common/Table";
import { FlexContainer } from "../../../../styles";
import ColumnPopupSelector, {
  getSelectedColumnsFromLocalStorage
} from "../../../../components/common/ColumnPopupSelector";
import { Spinner } from "react-bootstrap";
import { STORAGE_COLUMN_KEY_STUDENT_LIST } from "../../../../services/LocalStorageService";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import MathHelper from "../../../../helper/MathHelper";
import CSVExportBtn from "../../../../components/form/CSVExportBtn";
import StudentListHelper from './StudentListHelper';
import {iStudentListSearchCriteria} from './StudentListSearchPanel';
import UtilsService from '../../../../services/UtilsService';
import {OP_LIKE, OP_OR} from '../../../../helper/ServiceHelper';



type iStudentList = {
  className?: string;
  searchCriteria: iStudentListSearchCriteria;
  onSearching: (isSearching: boolean) => void;
  isSearching?: boolean;
};

const Wrapper = styled.div``;

const StudentList = ({ className, searchCriteria, isSearching, onSearching }: iStudentList) => {
  const [isLoading, setIsLoading] = useState(isSearching || false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [studentList, setStudentList] = useState<iPaginatedResult<
    iVPastAndCurrentStudent
  > | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [columns, setColumns] = useState<iTableColumn[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<iTableColumn[]>([]);
  const [count, setCount] = useState(0);

  const doSearch = (pageNo: Number) => {
    const {count, searchTxt, ...rest} = searchCriteria;
    let extra: {[key: string]: any} = {};
    if (`${searchTxt || ''}`.trim() !== '') {
      if (UtilsService.isNumeric(`${searchTxt || ''}`.trim())) {
        extra.StudentID = `${searchTxt || ''}`.trim();
      } else {
        extra[OP_OR] = [
          {StudentNameInternal: {[OP_LIKE]: `%${`${searchTxt || ''}`.trim()}%`}},
          {StudentNameExternal: {[OP_LIKE]: `%${`${searchTxt || ''}`.trim()}%`}},
        ]
      }
    }
    return SynVStudentService.getVPastAndCurrentStudentAll({
      where: JSON.stringify({...rest, ...extra}),
      currentPage: pageNo,
      perPage: pageSize
    });
  };

  useEffect(() => {
    if (!isFirstLoad) {
      return;
    }
    let isCanceled = false;
    setIsLoadingColumns(true);

    SynVStudentService.getVPastAndCurrentStudentAll({
      where: JSON.stringify({StudentActiveFlag: true}),
      currentPage: 1,
      perPage: 1
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const dataList = resp.data || [];
        if (dataList.length <= 0) {
          return;
        }
        const cols = Object.keys(dataList[0])
          .filter(name => ["profileUrl"].indexOf(name) < 0)
          .map((name, index) => {
            return {
              key: name,
              header: `${name}`,
              isDefault: index < 5,
              isSelectable: name !== "StudentID",
              cell: StudentListHelper.getCell(name),
            }
          });
        setColumns(cols);

        const selectedCols = getSelectedColumnsFromLocalStorage(
          STORAGE_COLUMN_KEY_STUDENT_LIST,
          cols
        );
        setSelectedColumns(
          selectedCols.length > 0
            ? selectedCols
            : cols.filter(column => column.isDefault === true)
        );
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoadingColumns(false);
        setIsFirstLoad(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [isFirstLoad]);

  useEffect(() => {
    if (Object.keys(searchCriteria).length <= 0) {
      return;
    }
    let isCanceled = false;
    if (onSearching) {
      onSearching(true);
    } else {
      setIsLoading(true);
    }

    doSearch(currentPage)
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setStudentList(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        if (onSearching) {
          onSearching(false);
        } else {
          setIsLoading(false);
        }
      });

    return () => {
      isCanceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCriteria, pageSize, currentPage, count]);

  const getColumnSelector = () => {
    if (isLoadingColumns) {
      return <Spinner animation={"border"} />;
    }

    if (columns.length <= 0) {
      return null;
    }

    return (
      <ColumnPopupSelector
        columns={columns}
        selectedColumns={selectedColumns}
        localStorageKey={STORAGE_COLUMN_KEY_STUDENT_LIST}
        size={"sm"}
        variant={"link"}
        onColumnSelected={selected => setSelectedColumns(selected)}
      />
    );
  };


  const getContent = () => {
    if (Object.keys(searchCriteria).length <= 0) {
      return null;
    }
    return (
      <>
        <FlexContainer className={"justify-content-between align-content-lg-end"}>
          <div>
            <b>Found ({studentList?.total}) student(s)</b>
            <LoadingBtn
              isLoading={isLoading}
              variant={"link"}
              size={"sm"}
              onClick={() => {
                setCount(MathHelper.add(count, 1));
                setCurrentPage(1);
              }}
            >
              <Icons.BootstrapReboot /> Refresh
            </LoadingBtn>
          </div>
          <FlexContainer className={'with-gap'}>
            <CSVExportBtn size={'sm'} variant={'link'} fetchingFnc={doSearch} downloadFnc={(data) => StudentListHelper.genStudentListExcel(selectedColumns, data)} />
            {getColumnSelector()}
          </FlexContainer>
        </FlexContainer>
        <Table
          pagination={{
            totalPages: studentList?.pages || 0,
            currentPage: currentPage,
            onSetCurrentPage: page => setCurrentPage(page),
            perPage: studentList?.perPage || 15,
            onPageSizeChanged: perPage => setPageSize(perPage),
            pageSizeProps: {
              start: 10,
              end: 100,
              steps: 5
            }
          }}
          isLoading={(isLoading === true || isSearching === true || isLoadingColumns === true)}
          columns={selectedColumns}
          rows={studentList?.data || []}
          striped
          hover
          responsive
        />
      </>
    )
  }

  if ((isLoading === true || isSearching === true) && isFirstLoad === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper className={`student-list-wrapper ${className || ''}`}>
      {getContent()}
    </Wrapper>
  );
};

export default StudentList;
