import iMessage from "../Message/iMessage";

export type iStudentAbsenceDailySummaryDateRange = {
  from: string;
  to: string;
};

export type iStudentAbsenceDailySummaryFilters = {
  yearLevelCode?: string;
  formCode?: string;
  dateRange?: iStudentAbsenceDailySummaryDateRange;
};

export type iStudentAbsenceDailySummaryViewerScope = {
  canAccess: boolean;
  isModuleUser: boolean;
  isHoy: boolean;
  isTutor: boolean;
  allowedYearLevelCodes: string[];
  allowedFormCodes: string[];
  yearLevelSelectorDisabled: boolean;
  formSelectorDisabled: boolean;
  selectedYearLevelCode: string;
  selectedFormCode: string;
  campus: string;
};

export type iStudentAbsenceDailySummaryRow = {
  studentId: number;
  studentName: string;
  yearLevelCode: string;
  yearLevelDescription: string;
  formCode: string;
  absenceDate: string;
  absenceDateTime: string;
  absenceDateTimeLabel: string;
  absencePeriod: string;
  absenceType: string;
  absenceReason: string;
  absenceComment: string;
  studentCampus: string;
  subSchool: string;
};

export type iStudentAbsenceDailySummaryLiveResult = {
  filters: {
    yearLevelCode: string;
    formCode: string;
    dateRange: iStudentAbsenceDailySummaryDateRange;
  };
  viewerScope: iStudentAbsenceDailySummaryViewerScope;
  schoolBoxAbsoluteUrl: string;
  hasRecords: boolean;
  rows: iStudentAbsenceDailySummaryRow[];
};

export type iStudentAbsenceDailySummaryLog = {
  id: string;
  type: string;
  status: string;
  dateFrom: string | null;
  dateTo: string | null;
  recipientEmail: string | null;
  scopeType: string | null;
  scopeValue: string | null;
  yearLevelCode: string | null;
  formCode: string | null;
  headingTitle: string | null;
  subject: string | null;
  absoluteReportUrl: string | null;
  recipientSource: string | null;
  campus: string | null;
  createdAt: string;
  updatedAt: string;
  error?: any;
  response?: any;
};

export type iStudentAbsenceDailySummaryLogsResult = {
  data: iStudentAbsenceDailySummaryLog[];
  total: number;
  page: number;
  pageSize: number;
};

export type iStudentAbsenceDailySummaryEmailResult = {
  assetId: string;
  invalidRecipients: string[];
  messages: iMessage[];
};
