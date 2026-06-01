import AppService, { iConfigParams } from "../AppService";
import iAsset from "../../types/asset/iAsset";
import {
  iStudentAbsenceDailySummaryEmailResult,
  iStudentAbsenceDailySummaryFilters,
  iStudentAbsenceDailySummaryLiveResult,
  iStudentAbsenceDailySummaryLogsResult,
} from "../../types/StudentAbsence/iStudentAbsenceDailySummary";

const endPoint = "/studentAbsence/dailySummary";

const getDateRangePayload = (filters: iStudentAbsenceDailySummaryFilters = {}) => {
  if (!filters.dateRange) {
    return {};
  }
  return {
    dateFrom: filters.dateRange.from,
    dateTo: filters.dateRange.to,
  };
};

const getLiveReport = (filters: iStudentAbsenceDailySummaryFilters = {}) => {
  return AppService.get(`${endPoint}/live`, {
    yearLevelCode: filters.yearLevelCode,
    formCode: filters.formCode,
    ...getDateRangePayload(filters),
  }).then(({ data }) => data as iStudentAbsenceDailySummaryLiveResult);
};

const exportReport = (filters: iStudentAbsenceDailySummaryFilters = {}) => {
  return AppService.post(`${endPoint}/export`, {
    yearLevelCode: filters.yearLevelCode,
    formCode: filters.formCode,
    ...getDateRangePayload(filters),
  }).then(({ data }) => data as iAsset);
};

const emailReport = (
  filters: iStudentAbsenceDailySummaryFilters = {},
  recipientEmails: string
) => {
  return AppService.post(`${endPoint}/email`, {
    yearLevelCode: filters.yearLevelCode,
    formCode: filters.formCode,
    recipientEmails,
    ...getDateRangePayload(filters),
  }).then(({ data }) => data as iStudentAbsenceDailySummaryEmailResult);
};

const getLogs = (params: iConfigParams = {}) => {
  return AppService.get(`${endPoint}/logs`, params).then(
    ({ data }) => data as iStudentAbsenceDailySummaryLogsResult
  );
};

const StudentAbsenceDailySummaryService = {
  getLiveReport,
  exportReport,
  emailReport,
  getLogs,
};

export default StudentAbsenceDailySummaryService;
