import Table, { iTableColumn } from "../common/Table";
import iSynVAttendance from "../../types/Synergetic/Attendance/iSynVAttendance";
import AttendanceHelper from './AttendanceHelper';

type iAttendanceTable = {
  attendances: iSynVAttendance[];
  showStudentID?: boolean;
};

const AttendanceTable = ({
  attendances,
  showStudentID = true
}: iAttendanceTable) => {
  const getColumns = <T extends {}>() => [
    ...(showStudentID === true
      ? [
          {
            key: "id",
            header: "ID",
            cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
              return <td key={col.key}>{data.ID}</td>;
            }
          }
        ]
      : []),
    {
      key: "date",
      header: "Date",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return (
          <td key={col.key}>
            {`${data.AttendanceDate || ""}`.replace("T00:00:00.000Z", "")}
          </td>
        );
      }
    },
    {
      key: "period",
      header: "Period",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.AttendancePeriod}</td>;
      }
    },
    {
      key: "class",
      header: "Class",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.ClassCode}</td>;
      }
    },
    {
      key: "attended",
      header: "Attended",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.AttendedFlag === true ? 'Y' : ''}</td>;
      }
    },
    {
      key: "reason",
      header: "Absence Reason",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return (
          <td key={col.key}>
            {`${data.PossibleAbsenceType?.Code || ''}${data.PossibleDescription}`.trim() ===
            "" ? null : (
              <>
                {data.PossibleAbsenceType?.Code } - {data.PossibleAbsenceType?.Description || ''}
              </>
            )}
          </td>
        );
      }
    },
    {
      key: "class-canceled",
      header: "Class Canceled?",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.ClassCancelledFlag}</td>;
      }
    },
    {
      key: "approved",
      header: "Approved?",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{data.AttendedFlag === true ? "Y" : ""}</td>;
      }
    },
    {
      key: "countAsAbsence",
      header: "Count As Absence?",
      cell: (col: iTableColumn<T>, data: iSynVAttendance) => {
        return <td key={col.key}>{AttendanceHelper.isReportableAbsence(data) === true ? "Y" : ""}</td>;
      }
    }
  ];

  return (
    <Table
      rows={attendances.sort((att1, att2) => {
        return `${att1.AttendanceDate}_${att1.AttendancePeriod}` >
          `${att2.AttendanceDate}_${att2.AttendancePeriod}`
          ? 1
          : -1;
      })}
      columns={getColumns<iSynVAttendance>()}
      responsive
      hover
      striped
    />
  );
};

export default AttendanceTable;
