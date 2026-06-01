import { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import moment from "moment-timezone";

import StudentAbsenceDailySummaryService from "../../../services/StudentAbsences/StudentAbsenceDailySummaryService";
import Toaster from "../../../services/Toaster";
import { iStudentAbsenceDailySummaryLog } from "../../../types/StudentAbsence/iStudentAbsenceDailySummary";

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

const StudentAbsenceDailySummaryLogsPanel = () => {
  const [logs, setLogs] = useState<iStudentAbsenceDailySummaryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    StudentAbsenceDailySummaryService.getLogs()
      .then(resp => {
        if (isCancelled) {
          return;
        }
        setLogs(resp.data || []);
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
  }, []);

  if (isLoading) {
    return <Spinner animation={"border"} />;
  }

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Created</th>
          <th>Date Range</th>
          <th>Type</th>
          <th>Status</th>
          <th>Recipient</th>
          <th>Scope</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{moment(log.createdAt).format("lll")}</td>
            <td>{getDateRangeLabel(log)}</td>
            <td>{log.type}</td>
            <td>{log.status}</td>
            <td>{log.recipientEmail}</td>
            <td>{`${log.scopeType || ""} ${log.scopeValue || ""}`.trim()}</td>
            <td>{log.headingTitle || log.subject}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StudentAbsenceDailySummaryLogsPanel;
