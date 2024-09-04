import styled from "styled-components";
import DateRangeSelector from "../common/DateRangeSelector";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import FormLabel from "../form/FormLabel";
import SelectBox from "../common/SelectBox";
import { FlexContainer } from "../../styles";
import FlagSelector from "../form/FlagSelector";
import LoadingBtn from "../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import iPaginatedResult from "../../types/iPaginatedResult";
import iSynVAttendance from "../../types/Synergetic/Attendance/iSynVAttendance";
import SynVAttendanceService from "../../services/Synergetic/Attendance/SynVAttendanceService";
import Toaster, {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS
} from "../../services/Toaster";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import { OP_BETWEEN } from "../../helper/ServiceHelper";
import Table, { iTableColumn } from "../common/Table";
import MathHelper from "../../helper/MathHelper";
import SynStudentProfileSelector from "../student/SynStudentProfileSelector";
import { iVPastAndCurrentStudent } from "../../types/Synergetic/Student/iVStudent";
import CheckBox from "../common/CheckBox";
import * as _ from "lodash";
import PopupModal from "../common/PopupModal";
import { Button, ButtonProps, FormControl } from "react-bootstrap";
import SectionDiv from "../common/SectionDiv";
import ExplanationPanel from "../ExplanationPanel";
import SynLuAbsenceReasonSelector from "../Absence/SynLuAbsenceReasonSelector";
import SynLuAbsenceTypeSelector from "../Absence/SynLuAbsenceTypeSelector";
import SynAttendanceService from "../../services/Synergetic/Attendance/SynAttendanceService";
import iSynAttendance from "../../types/Synergetic/Attendance/iSynAttendance";

const Wrapper = styled.div`
  .result-panel {
    margin-top: 1.2rem;
  }
  .date-range {
    input {
      height: 39px;
    }
  }
  .students-autocomplete {
    min-width: 520px;
    input {
      height: 24px;
      min-height: 19px;
    }
  }
`;

type iDateRange = { start?: string | Date; end?: string | Date };

type iSearchCriteria = {
  studentIds?: number[];
  periods?: number[];
  attendedFlag?: boolean;
  dateRange?: iDateRange;
};

type iSearchPanel = {
  isSearching?: boolean;
  onSearch: (criteria: iSearchCriteria) => void;
};
const SearchPanel = ({ onSearch, isSearching }: iSearchPanel) => {
  const [attendanceDate, setAttendanceDate] = useState<iDateRange>({});
  const [periods, setPeriods] = useState<number[]>([]);
  const [students, setStudents] = useState<iVPastAndCurrentStudent[]>([]);
  const [attendedFlag, setAttendedFlag] = useState<boolean | null>(null);
  return (
    <FlexContainer className={"gap gap-3 flex-wrap"}>
      <div>
        <DateRangeSelector
          isStartDateRequired
          isEndDateRequired
          startDateLabel={"Attendance Date"}
          endDateLabel={""}
          startDate={attendanceDate.start}
          endDate={attendanceDate.end}
          className={"date-range"}
          onStartDateSelected={selected =>
            setAttendanceDate({
              ...attendanceDate,
              start: `${moment(selected).format("YYYY-MM-DD")}T00:00:00Z`
            })
          }
          onEndDateSelected={selected =>
            setAttendanceDate({
              ...attendanceDate,
              end: `${moment(selected).format("YYYY-MM-DD")}T00:00:00Z`
            })
          }
        />
      </div>
      <div>
        <FormLabel label={"Period"} />
        <SelectBox
          options={[1, 2, 3, 4, 5, 6].map(value => ({
            value: value,
            label: value
          }))}
          value={periods.map(period => ({ value: period, label: period }))}
          onChange={option =>
            setPeriods((option || []).map((i: any) => Number(i.value)))
          }
          isMulti
        />
      </div>
      <div>
        <FormLabel label={"Attended?"} />
        <FlagSelector
          value={attendedFlag}
          onSelect={value => {
            setAttendedFlag(
              // @ts-ignore
              value?.value === "" ? null : value?.value === true ? true : false
            );
          }}
        />
      </div>
      <div>
        <FormLabel label={"Students"} />
        <SynStudentProfileSelector
          isMulti
          isClearable
          className={"students-autocomplete"}
          placeholder={"Search student by given name, surname or ID..."}
          value={students.map(student => ({
            value: student.ID,
            label: `[${student.StudentID}] ${student.StudentGiven1} ${student.StudentSurname}`,
            data: student
          }))}
          onChange={selected => {
            setStudents(!selected ? null : selected || []);
          }}
        />
      </div>
      <div>
        <div style={{ height: "19px" }} />
        <LoadingBtn
          isLoading={isSearching === true}
          onClick={() =>
            onSearch({
              dateRange: attendanceDate,
              periods: periods,
              ...(attendedFlag === null ? {} : { attendedFlag: attendedFlag }),
              ...(students.length <= 0
                ? {}
                : { studentIds: students.map(student => student.ID) })
            })
          }
        >
          <Icons.Search /> Search
        </LoadingBtn>
      </div>
    </FlexContainer>
  );
};

type iResultTable = {
  isSearching?: boolean;
  selectedSequences?: number[];
  data: iPaginatedResult<iSynVAttendance>;
  onRecordsSelected?: (seqs: number[]) => void;
  onLoadNextPage?: (newPageNo: number) => void;
};
const ResultTable = ({
  data,
  isSearching,
  selectedSequences,
  onRecordsSelected,
  onLoadNextPage
}: iResultTable) => {
  const selectedSeqs = selectedSequences || [];
  const getColumns = <T extends {}>() => [
    {
      key: "select-box",
      header: (col: iTableColumn<T>) => {
        const attendanceRecordSeqs = _.uniq(
          (data?.data || [])
            .filter(record => record.AttendedFlag === false)
            .map(record => record.AttendanceSeq)
        );
        const allChecked = attendanceRecordSeqs.length > 0 && _.isEqual(
          _.countBy(selectedSeqs),
          _.countBy(attendanceRecordSeqs)
        );

        if (attendanceRecordSeqs.length <= 0) {
          return <th key={col.key}></th>
        }

        return (
          <th key={col.key}>
            <CheckBox
              checked={allChecked}
              onChange={() => {
                onRecordsSelected &&
                onRecordsSelected(
                  allChecked === true ? [] : attendanceRecordSeqs
                );
              }}
            />
          </th>
        );
      },
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        if (data.AttendedFlag !== false) {
          return <td key={col.key}></td>;
        }
        return (
          <td key={col.key}>
            <CheckBox
              checked={selectedSeqs.indexOf(data.AttendanceSeq) >= 0}
              onChange={() => {
                onRecordsSelected &&
                onRecordsSelected(
                  _.uniq(
                    selectedSeqs.indexOf(data.AttendanceSeq) >= 0
                      ? selectedSeqs.filter(seq => data.AttendanceSeq !== seq)
                      : [...selectedSeqs, data.AttendanceSeq]
                  )
                );
              }}
            />
          </td>
        );
      },
      footer: (col: iTableColumn<T>) => {
        if (
          (data?.data || []).length <= 0 ||
          (data?.currentPage || 0) >= (data?.pages || 0)
        ) {
          return null;
        }
        return (
          <td key={col.key} className={"text-center"} colSpan={11}>
            <LoadingBtn
              isLoading={isSearching}
              variant={"outline-primary"}
              onClick={() =>
                onLoadNextPage &&
                onLoadNextPage(MathHelper.add(data.currentPage || 1, 1))
              }
            >
              <Icons.ArrowDown /> Load Next {data.perPage} record(s){" "}
              <Icons.ArrowDown />
            </LoadingBtn>
          </td>
        );
      }
    },
    {
      key: "Attendance Date",
      header: "Date",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return (
          <td key={col.key}>
            {`${data.AttendanceDate || ""}`.trim() === ""
              ? ""
              : moment(`${data.AttendanceDate || ""}`.trim()).format(
                "DD MMM YYYY"
              )}
          </td>
        );
      },
      footer: () => null
    },
    {
      key: "Period",
      header: "Period",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.AttendancePeriod}</td>;
      },
      footer: () => null
    },
    {
      key: "Class",
      header: "Class",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.ClassCode}</td>;
      },
      footer: () => null
    },
    {
      key: "Student",
      header: "Student",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return (
          <td key={col.key}>
            [{data.ID}] {data.SynCommunity?.Given1} {data.SynCommunity?.Surname}
          </td>
        );
      },
      footer: () => null
    },
    {
      key: "Attended",
      header: "Attended?",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return (
          <td
            key={col.key}
            className={data.AttendedFlag === true ? "" : "bg-danger text-white"}
          >
            {data.AttendedFlag === true ? "Y" : "N"}
          </td>
        );
      },
      footer: () => null
    },
    {
      key: "ClassCanceled",
      header: "Class Canceled?",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return (
          <td
            key={col.key}
            className={data.ClassCancelledFlag === true ? "bg-warning" : ""}
          >
            {data.ClassCancelledFlag === true ? "Y" : ""}
          </td>
        );
      },
      footer: () => null
    },
    {
      key: "PossibleAbsenceType",
      header: "Possible Absence Type",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.PossibleAbsenceType?.SynergyMeaning}</td>;
      },
      footer: () => null
    },
    {
      key: "PossibleAbsenceCode",
      header: "Possible Absence Code",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.PossibleAbsenceCode}</td>;
      },
      footer: () => null
    },
    {
      key: "PossibleReasonCode",
      header: "Possible Reason Code",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.PossibleReasonCode}</td>;
      },
      footer: () => null
    },
    {
      key: "PossibleDescription",
      header: "Possible Description",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.PossibleDescription}</td>;
      },
      footer: () => null
    }
  ];

  return <Table striped hover columns={getColumns<iSynVAttendance>()} rows={data?.data || []} />;
};

type iPopupPanel = ButtonProps & {
  selectedSeqs: number[];
  onSaved: (records: iSynAttendance[]) => void;
};

const PopupBtnPanel = ({ selectedSeqs, onSaved, ...props }: iPopupPanel) => {
  const [showingBulkEditPopup, setShowingBulkEditPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [possibleAbsenceCode, setPossibleAbsenceCode] = useState(null);
  const [possibleDescription, setPossibleDescription] = useState("");
  const [possibleReasonCode, setPossibleReasonCode] = useState(null);

  const handleClose = () => {
    setPossibleAbsenceCode(null);
    setPossibleDescription("");
    setPossibleReasonCode(null);
    setShowingBulkEditPopup(false);
    setIsSaving(false);
  };

  const update = async () => {
    const data = {
      ...(`${possibleAbsenceCode || ""}`.trim() === ""
        ? {}
        : { PossibleAbsenceCode: `${possibleAbsenceCode || ""}`.trim() }),
      ...(`${possibleDescription || ""}`.trim() === ""
        ? {}
        : { PossibleDescription: `${possibleDescription || ""}`.trim() }),
      ...(`${possibleReasonCode || ""}`.trim() === ""
        ? {}
        : { PossibleReasonCode: `${possibleReasonCode || ""}`.trim() })
    };

    if (Object.keys(data).length <= 0) {
      Toaster.showToast(
        "Need to change the fields that you want to change.",
        TOAST_TYPE_ERROR
      );
      return;
    }

    setIsSaving(true);
    const saved: iSynAttendance[] = [];
    for (const seq of selectedSeqs) {
      try {
        saved.push(await SynAttendanceService.update(seq, data));
      } catch (err) {
        Toaster.showApiError(err);
      }
    }
    handleClose();
    if (saved.length >= selectedSeqs.length) {
      Toaster.showToast(
        `${saved.length} record(s) updated successfully.`,
        TOAST_TYPE_SUCCESS
      );
    }
    onSaved(saved);
  };

  if (selectedSeqs.length <= 0) {
    return null;
  }

  return (
    <>
      <LoadingBtn
        {...props}
        isLoading={showingBulkEditPopup === true}
        onClick={() => setShowingBulkEditPopup(true)}
      >
        <Icons.Pencil /> edit {selectedSeqs.length} unattended record(s)
      </LoadingBtn>
      <PopupModal
        show={showingBulkEditPopup === true}
        title={`Editing ${selectedSeqs.length} record(s)`}
        footer={
          <FlexContainer className={"justify-content-end gap-3"}>
            <Button variant={"link"} onClick={() => handleClose()}>
              <Icons.XLg /> Cancel
            </Button>
            <LoadingBtn isLoading={isSaving === true} onClick={() => update()}>
              <Icons.Send /> update {selectedSeqs.length} record(s)
            </LoadingBtn>
          </FlexContainer>
        }
      >
        <ExplanationPanel
          text={"Anything left blank will remains as before."}
        />
        <SectionDiv>
          <FormLabel label={"Possible Absence Code"} />
          <SynLuAbsenceTypeSelector
            values={
              !possibleAbsenceCode ||
              `${possibleAbsenceCode || ""}`.trim() === ""
                ? []
                : [possibleAbsenceCode]
            }
            onSelect={value => {
              // @ts-ignore
              setPossibleAbsenceCode(value?.value || null);
            }}
          />
        </SectionDiv>
        <SectionDiv>
          <FormLabel label={"Possible Reason Code"} />
          <SynLuAbsenceReasonSelector
            values={
              !possibleReasonCode || `${possibleReasonCode || ""}`.trim() === ""
                ? []
                : [possibleReasonCode]
            }
            onSelect={value => {
              // @ts-ignore
              setPossibleReasonCode(value?.value || null);
            }}
          />
        </SectionDiv>
        <SectionDiv>
          <FormLabel label={"Possible Reason"} />
          <FormControl
            placeholder="Possible Reason Code"
            value={possibleDescription || ""}
            onChange={event => setPossibleDescription(event.target.value)}
          />
        </SectionDiv>
      </PopupModal>
    </>
  );
};

const AttendancesListWithSearchPanel = () => {
  const [count, setCount] = useState(0);
  const [selectedSeqs, setSelectedSeqs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(50);
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<iPaginatedResult<
    iSynVAttendance
  > | null>(null);

  useEffect(() => {
    if (Object.keys(searchCriteria || {}).length <= 0) {
      setResult(null);
      return;
    }

    if (`${searchCriteria?.dateRange?.start || ""}`.trim() === "") {
      Toaster.showToast(
        "Attendance date range is required for start date",
        TOAST_TYPE_ERROR
      );
      return;
    }
    if (`${searchCriteria?.dateRange?.end || ""}`.trim() === "") {
      Toaster.showToast(
        "Attendance date range is required for end date",
        TOAST_TYPE_ERROR
      );
      return;
    }

    let isCanceled = false;
    setIsSearching(true);
    SynVAttendanceService.getAll({
      where: JSON.stringify({
        AttendanceDate: {
          [OP_BETWEEN]: [
            `${searchCriteria?.dateRange?.start || ""}`.replace(
              "T00:00:00Z",
              ""
            ),
            `${searchCriteria?.dateRange?.end || ""}`.replace("T00:00:00Z", "")
          ]
        },
        ...((searchCriteria?.periods || []).length <= 0
          ? {}
          : { AttendancePeriod: searchCriteria?.periods || [] }),
        ...(searchCriteria?.attendedFlag === null
          ? {}
          : { AttendedFlag: searchCriteria?.attendedFlag }),
        ...((searchCriteria?.studentIds || []).length <= 0
          ? {}
          : { ID: searchCriteria?.studentIds || [] })
      }),
      sort: "AttendanceDate:ASC,AttendancePeriod:ASC",
      perPage,
      currentPage,
      include: "SynCommunity"
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        if (currentPage <= 1) {
          setResult(resp);
        } else {
          setResult(prev => ({
            ...resp,
            data: [...(prev?.data || []), ...(resp.data || [])]
          }));
        }
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
        setIsSearching(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [
    count,
    perPage,
    currentPage,
    searchCriteria,
    searchCriteria?.dateRange?.start,
    searchCriteria?.dateRange?.end,
    searchCriteria?.periods,
    searchCriteria?.studentIds,
    searchCriteria?.attendedFlag
  ]);

  const getResultTable = () => {
    if (searchCriteria === null) {
      return null;
    }

    if (isSearching === true && currentPage <= 1) {
      return <PageLoadingSpinner />;
    }

    if (Object.keys(result?.data || []).length <= 0 || result === null) {
      return <h4 className={"text-center"}>No result found.</h4>;
    }

    return (
      <ResultTable
        data={result}
        selectedSequences={selectedSeqs}
        onRecordsSelected={(seqs: number[]) => setSelectedSeqs(seqs)}
        onLoadNextPage={(newPageNo: number) => setCurrentPage(newPageNo)}
        isSearching={isSearching}
      />
    );
  };

  const getBulkActionBtnPanel = () => {
    return (
      <div>
        <PopupBtnPanel
          selectedSeqs={selectedSeqs}
          onSaved={() => {
            setCount(MathHelper.add(count, 1));
            setCurrentPage(1);
            setSelectedSeqs([]);
          }}
        >
          <Icons.Pencil /> edit {selectedSeqs.length} record(s)
        </PopupBtnPanel>
      </div>
    );
  };

  return (
    <Wrapper>
      <SearchPanel
        onSearch={(criteria: iSearchCriteria) => {
          setSearchCriteria(criteria);
          setCount(MathHelper.add(count, 1));
          setCurrentPage(1);
          setSelectedSeqs([]);
        }}
      />

      <div className={"result-panel"}>
        {getBulkActionBtnPanel()}
        {getResultTable()}
      </div>
    </Wrapper>
  );
};

export default AttendancesListWithSearchPanel;
