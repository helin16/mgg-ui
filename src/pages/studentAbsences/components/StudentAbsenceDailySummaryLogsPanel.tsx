import { useEffect, useMemo, useState } from "react";
import moment from "moment-timezone";

import Table, { iTableColumn } from "../../../components/common/Table";
import StudentAbsenceDailySummaryService from "../../../services/StudentAbsences/StudentAbsenceDailySummaryService";
import Toaster from "../../../services/Toaster";
import {
  iStudentAbsenceDailySummaryLog,
  iStudentAbsenceDailySummaryLogsResult,
} from "../../../types/StudentAbsence/iStudentAbsenceDailySummary";

const getDateRangeLabel = (log: iStudentAbsenceDailySummaryLog) => {
  const from = `${log.dateFrom || ""}`.trim();
  const to = `${log.dateTo || ""}`.trim();
  if (from === "" && to === "") {
    return "";
  }
  if (from !== "" && to !== "" && from === to) {
    return moment(from).format("ll");
  }
  return `${from !== "" ? moment(from).format("ll") : ""}${from !== "" || to !== "" ? " - " : ""}${to !== "" ? moment(to).format("ll") : ""}`.trim();
};

const DEFAULT_PAGE_SIZE = 20;

const getScopeLabel = (log: iStudentAbsenceDailySummaryLog) =>
  `${log.scopeType || ""} ${log.scopeValue || ""}`.trim();

const getTitleLabel = (log: iStudentAbsenceDailySummaryLog) =>
  log.headingTitle || log.subject || "";

const StudentAbsenceDailySummaryLogsPanel = () => {
  const [result, setResult] = useState<iStudentAbsenceDailySummaryLogsResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    StudentAbsenceDailySummaryService.getLogs({
      page: currentPage,
      pageSize,
    })
      .then(resp => {
        if (isCancelled) {
          return;
        }
        setResult({
          data: resp.data || [],
          total: resp.total || 0,
          page: resp.page || currentPage,
          pageSize: resp.pageSize || pageSize,
        });
      })
      .catch(err => {
        if (isCancelled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [currentPage, pageSize]);

  const columns = useMemo<iTableColumn<iStudentAbsenceDailySummaryLog>[]>(
    () => [
      {
        key: "createdAt",
        header: "Created",
        cell: (col, log) => (
          <td key={col.key}>{moment(log.createdAt).format("lll")}</td>
        ),
      },
      {
        key: "dateRange",
        header: "Date Range",
        cell: (col, log) => <td key={col.key}>{getDateRangeLabel(log)}</td>,
      },
      {
        key: "type",
        header: "Type",
        cell: (col, log) => <td key={col.key}>{log.type}</td>,
      },
      {
        key: "status",
        header: "Status",
        cell: (col, log) => <td key={col.key}>{log.status}</td>,
      },
      {
        key: "recipientEmail",
        header: "Recipient",
        cell: (col, log) => <td key={col.key}>{log.recipientEmail}</td>,
      },
      {
        key: "scope",
        header: "Scope",
        cell: (col, log) => <td key={col.key}>{getScopeLabel(log)}</td>,
      },
      {
        key: "title",
        header: "Title",
        cell: (col, log) => <td key={col.key}>{getTitleLabel(log)}</td>,
      },
    ],
    []
  );

  const totalPages = Math.max(1, Math.ceil((result.total || 0) / (pageSize || 1)));

  return (
    <Table
      striped
      hover
      responsive
      isLoading={isLoading}
      columns={columns}
      rows={result.data}
      pagination={{
        currentPage,
        totalPages,
        onSetCurrentPage: setCurrentPage,
        perPage: pageSize,
        onPageSizeChanged: nextPageSize => {
          setCurrentPage(1);
          setPageSize(nextPageSize);
        },
        pageSizeProps: {
          start: 20,
          end: 100,
          steps: 20,
        },
      }}
    />
  );
};

export default StudentAbsenceDailySummaryLogsPanel;
