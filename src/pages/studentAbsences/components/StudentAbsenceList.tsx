import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-bootstrap";
import LoadingBtn from "../../../components/common/LoadingBtn";
import moment from "moment-timezone";
import * as Icons from "react-bootstrap-icons";

import DataTable, { iTableColumn } from "../../../components/common/Table";
import { FlexContainer } from "../../../styles";
import DateRangeSelector from "../../../components/common/DateRangeSelector";
import YearLevelSelector from "../../../components/student/YearLevelSelector";
import LuFormSelector from "../../../components/student/SynFormSelector";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import { OP_AND, OP_BETWEEN } from "../../../helper/ServiceHelper";
import StudentAbsenceDailySummaryService from "../../../services/StudentAbsences/StudentAbsenceDailySummaryService";
import SynVStudentAbsenceEventsService from "../../../services/Synergetic/Attendance/SynVStudentAbsenceEventsService";
import {
  iStudentAbsenceDailySummaryFilters,
  iStudentAbsenceDailySummaryLiveResult,
  iStudentAbsenceDailySummaryRow,
} from "../../../types/StudentAbsence/iStudentAbsenceDailySummary";
import iSynVStudentAbsenceEvents from "../../../types/Synergetic/Attendance/iSynVStudentAbsenceEvents";
import StudentAbsenceDailySummaryEmailModal from "./StudentAbsenceDailySummaryEmailModal";

const getUrlFilters = (): iStudentAbsenceDailySummaryFilters => {
  const params = new URLSearchParams(window.location.search);
  const today = moment().format("YYYY-MM-DD");
  return {
    yearLevelCode: `${params.get("yearLevelCode") || ""}`.trim(),
    formCode: `${params.get("formCode") || ""}`.trim(),
    dateRange: {
      from: `${params.get("dateFrom") || today}`.trim(),
      to: `${params.get("dateTo") || today}`.trim(),
    },
  };
};

const getStudentDisplayName = (row: iSynVStudentAbsenceEvents) => {
  const preferred = `${row.StudentPreferred || ""}`.trim();
  const given1 = `${row.StudentGiven1 || ""}`.trim();
  const given2 = `${row.StudentGiven2 || ""}`.trim();
  const surname = `${row.StudentSurname || ""}`.trim();
  const mailName = `${row.StudentMailName || ""}`.trim();

  if (mailName !== "") {
    return mailName;
  }

  return [preferred || given1, given2, surname].filter(Boolean).join(" ").trim();
};

const mapSourceRowToSummaryRow = (
  row: iSynVStudentAbsenceEvents
): iStudentAbsenceDailySummaryRow => {
  const absenceDate = `${row.AbsenceEventDate || ""}`.trim();
  const absenceDateTime = row.AbsenceEventDateTime || null;
  return {
    studentId: Number(row.StudentID || 0),
    studentName: getStudentDisplayName(row),
    yearLevelCode: `${row.StudentYearLevel || ""}`.trim(),
    formCode: `${row.StudentForm || ""}`.trim(),
    absenceDate,
    absenceDateTime: `${absenceDateTime || ""}`,
    absenceDateTimeLabel:
      `${absenceDateTime || ""}`.trim() !== ""
        ? moment(absenceDateTime).format("D MMM YYYY h:mm A")
        : `${absenceDate || ""}`.trim() !== ""
          ? moment(absenceDate).format("D MMM YYYY")
          : "",
    absencePeriod: `${row.AbsenceEventPeriodDescription || ""}`.trim(),
    absenceType: `${row.AbsenceEventAbsenceTypeDescription || ""}`.trim(),
    absenceReason: `${row.AbsenceEventAbsenceReasonDescription || row.AbsenceEventAbsenceReasonCode || ""}`.trim(),
    absenceComment: `${row.AbsenceEventComment || ""}`.trim(),
    studentCampus: `${row.StudentCampus || ""}`.trim(),
    subSchool: `${row.StudentSubSchool || row.SubSchool || ""}`.trim(),
  };
};

const getSourceQueryParams = (
  filters: iStudentAbsenceDailySummaryFilters,
  currentPage: number,
  perPage = 30
) => {
  const dateFrom = `${filters.dateRange?.from || ""}`.trim();
  const dateTo = `${filters.dateRange?.to || ""}`.trim();
  return {
    currentPage,
    perPage,
    sort: "AbsenceEventDate:ASC,StudentYearLevelSort:ASC,StudentSurname:ASC,StudentPreferred:ASC",
    where: JSON.stringify({
      [OP_AND]: [
        {
          AbsenceEventDate: {
            [OP_BETWEEN]: [dateFrom, dateTo],
          },
        },
        ...(`${filters.yearLevelCode || ""}`.trim() !== ""
          ? [{ StudentYearLevel: `${filters.yearLevelCode}`.trim() }]
          : []),
        ...(`${filters.formCode || ""}`.trim() !== ""
          ? [{ StudentForm: `${filters.formCode}`.trim() }]
          : []),
      ],
    }),
  };
};

const StudentAbsenceList = () => {
  const [filters, setFilters] = useState<iStudentAbsenceDailySummaryFilters>(getUrlFilters());
  const [searchedFilters, setSearchedFilters] = useState<iStudentAbsenceDailySummaryFilters>(getUrlFilters());
  const [currentPage, setCurrentPage] = useState(1);
  const [result, setResult] = useState<iStudentAbsenceDailySummaryLiveResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const normalizedFilters = useMemo(
    () => ({
      yearLevelCode: `${filters.yearLevelCode || ""}`.trim(),
      formCode: `${filters.formCode || ""}`.trim(),
      ...(filters.dateRange
        ? {
            dateRange: {
              from: `${filters.dateRange?.from || ""}`.trim(),
              to: `${filters.dateRange?.to || ""}`.trim(),
            },
          }
        : {}),
    }),
    [filters.yearLevelCode, filters.formCode, filters.dateRange]
  );
  const requestFilters = useMemo(
    () => ({
      yearLevelCode: `${searchedFilters.yearLevelCode || ""}`.trim(),
      formCode: `${searchedFilters.formCode || ""}`.trim(),
      ...(searchedFilters.dateRange
        ? {
            dateRange: {
              from: `${searchedFilters.dateRange?.from || ""}`.trim(),
              to: `${searchedFilters.dateRange?.to || ""}`.trim(),
            },
          }
        : {}),
    }),
    [
      searchedFilters.yearLevelCode,
      searchedFilters.formCode,
      searchedFilters.dateRange,
    ]
  );
  const hasCompleteDateRange =
    `${normalizedFilters.dateRange?.from || ""}`.trim() !== "" &&
    `${normalizedFilters.dateRange?.to || ""}`.trim() !== "";
  const hasAppliedDateRange =
    `${requestFilters.dateRange?.from || ""}`.trim() !== "" &&
    `${requestFilters.dateRange?.to || ""}`.trim() !== "";

  const syncUrl = (nextFilters: iStudentAbsenceDailySummaryFilters) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("yearLevelCode");
    params.delete("formCode");
    params.delete("dateFrom");
    params.delete("dateTo");
    if (`${nextFilters.yearLevelCode || ""}`.trim() !== "") {
      params.set("yearLevelCode", `${nextFilters.yearLevelCode}`.trim());
    }
    if (`${nextFilters.formCode || ""}`.trim() !== "") {
      params.set("formCode", `${nextFilters.formCode}`.trim());
    }
    if (`${nextFilters.dateRange?.from || ""}`.trim() !== "") {
      params.set("dateFrom", `${nextFilters.dateRange?.from}`.trim());
    }
    if (`${nextFilters.dateRange?.to || ""}`.trim() !== "") {
      params.set("dateTo", `${nextFilters.dateRange?.to}`.trim());
    }
    const search = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${search === "" ? "" : `?${search}`}`);
  };

  useEffect(() => {
    let isCancelled = false;
    syncUrl(requestFilters);
    if (!hasAppliedDateRange) {
      setIsLoading(false);
      setAccessDenied(false);
      setResult(null);
      return () => {
        isCancelled = true;
      };
    }
    setIsLoading(true);
    StudentAbsenceDailySummaryService.getLiveReport(requestFilters)
      .then(async resp => {
        if (isCancelled) {
          return;
        }
        const nextFilters = {
          yearLevelCode: resp.filters.yearLevelCode,
          formCode: resp.filters.formCode,
          dateRange: resp.filters.dateRange,
        };
        const sourceResp = await SynVStudentAbsenceEventsService.getAll(
          getSourceQueryParams(nextFilters, currentPage, 30)
        );
        const mappedRows = (sourceResp.data || []).map(mapSourceRowToSummaryRow);
        setTotalPages(sourceResp.pages || 1);
        setAccessDenied(false);
        setResult({
          ...resp,
          hasRecords: mappedRows.length > 0,
          rows: mappedRows,
        });
        if (
          nextFilters.yearLevelCode !== requestFilters.yearLevelCode ||
          nextFilters.formCode !== requestFilters.formCode ||
          nextFilters.dateRange.from !== `${requestFilters.dateRange?.from || ""}`.trim() ||
          nextFilters.dateRange.to !== `${requestFilters.dateRange?.to || ""}`.trim()
        ) {
          setFilters(nextFilters);
          setSearchedFilters(nextFilters);
          setCurrentPage(1);
        }
      })
      .catch(err => {
        if (isCancelled) {
          return;
        }
        if (err?.response?.status === 401) {
          setAccessDenied(true);
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
  }, [currentPage, hasAppliedDateRange, requestFilters, searchTrigger]);

  const viewerScope = result?.viewerScope;
  const canExport = (result?.rows || []).length > 0;
  const columns = useMemo<iTableColumn<iStudentAbsenceDailySummaryRow>[]>(
    () => [
      {
        key: "date",
        header: "Date",
        cell: (column, row) => (
          <td key={column.key}>
            {`${row.absenceDate || ""}`.trim() !== ""
              ? moment(row.absenceDate).format("D MMM YYYY")
              : ""}
          </td>
        ),
      },
      {
        key: "student",
        header: "Student",
        cell: (column, row) => <td key={column.key}>{row.studentName}</td>,
      },
      {
        key: "year",
        header: "Year",
        cell: (column, row) => <td key={column.key}>{row.yearLevelCode}</td>,
      },
      {
        key: "form",
        header: "luForm",
        cell: (column, row) => <td key={column.key}>{row.formCode}</td>,
      },
      {
        key: "period",
        header: "Period",
        cell: (column, row) => <td key={column.key}>{row.absencePeriod}</td>,
      },
      {
        key: "type",
        header: "Type",
        cell: (column, row) => <td key={column.key}>{row.absenceType}</td>,
      },
      {
        key: "reason",
        header: "Reason",
        cell: (column, row) => <td key={column.key}>{row.absenceReason}</td>,
      },
      {
        key: "comment",
        header: "Comment",
        cell: (column, row) => <td key={column.key}>{row.absenceComment}</td>,
      },
    ],
    []
  );

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchedFilters(normalizedFilters);
    setSearchTrigger(prev => prev + 1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const asset = await StudentAbsenceDailySummaryService.exportReport(requestFilters);
      const downloadUrl = `${asset.downloadUrl || ""}`.trim();
      if (downloadUrl !== "") {
        window.open(downloadUrl, "_blank");
      }
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSend = async (recipientEmails: string, emailBody: string) => {
    setIsSending(true);
    try {
      await StudentAbsenceDailySummaryService.emailReport(requestFilters, recipientEmails, emailBody);
      Toaster.showToast("Report queued", TOAST_TYPE_SUCCESS);
      setShowEmailModal(false);
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setIsSending(false);
    }
  };

  const selectedYearLevelValues = useMemo(
    () => (`${filters.yearLevelCode || ""}`.trim() === "" ? [] : [`${filters.yearLevelCode}`.trim()]),
    [filters.yearLevelCode]
  );
  const selectedFormValues = useMemo(
    () => (`${filters.formCode || ""}`.trim() === "" ? [] : [`${filters.formCode}`.trim()]),
    [filters.formCode]
  );

  if (accessDenied) {
    return <Alert variant={"danger"}>You do not have access to this report.</Alert>;
  }

  return (
    <div>
      <FlexContainer className={"with-gap lg-gap align-items end"}>
        <DateRangeSelector
          startDate={filters.dateRange?.from}
          endDate={filters.dateRange?.to}
          onStartDateSelected={selected =>
            setFilters({
              ...filters,
              dateRange: {
                from: moment(selected).format("YYYY-MM-DD"),
                to: `${filters.dateRange?.to || moment(selected).format("YYYY-MM-DD")}`.trim(),
              },
            })
          }
          onEndDateSelected={selected =>
            setFilters({
              ...filters,
              dateRange: {
                from: `${filters.dateRange?.from || moment(selected).format("YYYY-MM-DD")}`.trim(),
                to: moment(selected).format("YYYY-MM-DD"),
              },
            })
          }
        />

        <div>
          <div>Year Level</div>
          <YearLevelSelector
            values={selectedYearLevelValues}
            onSelect={selected => {
              const option = Array.isArray(selected) ? selected[0] : selected;
              setFilters({
                ...filters,
                yearLevelCode: `${option?.value || ""}`.trim(),
              });
            }}
            allowClear
            limitCodes={viewerScope?.isModuleUser ? [] : viewerScope?.allowedYearLevelCodes || []}
            isDisabled={viewerScope?.yearLevelSelectorDisabled}
          />
        </div>

        <div>
          <div>luForm</div>
          <LuFormSelector
            values={selectedFormValues}
            onSelect={selected => {
              const option = Array.isArray(selected) ? selected[0] : selected;
              setFilters({
                ...filters,
                formCode: `${option?.value || ""}`.trim(),
              });
            }}
            allowClear
            limitCodes={viewerScope?.isModuleUser ? [] : viewerScope?.allowedFormCodes || []}
            isDisabled={viewerScope?.formSelectorDisabled}
          />
        </div>

        <LoadingBtn
          variant={"primary"}
          size={"sm"}
          isLoading={isLoading}
          disabled={isLoading || isExporting || isSending}
          onClick={handleSearch}
        >
          <Icons.Search /> Search
        </LoadingBtn>

        {canExport ? (
          <>
            <LoadingBtn
              variant={"secondary"}
              size={"sm"}
              isLoading={isExporting || isLoading}
              disabled={isLoading || isExporting || isSending}
              onClick={handleExport}
            >
              <Icons.Download /> Export
            </LoadingBtn>
            <LoadingBtn
              variant={"primary"}
              size={"sm"}
              isLoading={isSending || isLoading}
              disabled={isLoading || isExporting || isSending}
              onClick={() => setShowEmailModal(true)}
            >
              <Icons.Envelope /> Email Report
            </LoadingBtn>
          </>
        ) : null}
      </FlexContainer>

      {!hasCompleteDateRange ? (
        <Alert variant={"info"} className={"space-above"}>
          Please select both a start date and an end date.
        </Alert>
      ) : (
        <>
          <DataTable
            isLoading={isLoading}
            striped
            hover
            responsive
            className={"space-above"}
            columns={columns}
            rows={result?.rows || []}
            pagination={{
              totalPages,
              currentPage,
              perPage: 30,
              onSetCurrentPage: setCurrentPage,
            }}
          />
          {(result?.rows || []).length <= 0 && !isLoading ? (
            <Alert variant={"light"} className={"space-above"}>
              No records found.
            </Alert>
          ) : null}
        </>
      )}

      <StudentAbsenceDailySummaryEmailModal
        show={showEmailModal}
        isSending={isSending}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSend}
      />
    </div>
  );
};

export default StudentAbsenceList;
