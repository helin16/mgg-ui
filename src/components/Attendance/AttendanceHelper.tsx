import iSynVAttendance from "../../types/Synergetic/Attendance/iSynVAttendance";
import MathHelper from "../../helper/MathHelper";
import { Alert } from "react-bootstrap";
import moment from 'moment-timezone';
import * as XLSX from 'sheetjs-style';

const getReportableAbsenceAlertPanel = () => {
  return (
    <Alert variant={"secondary"}>
      Reportable Absence: NOT attended any none-canceled class without Reason or
      the Reason is marked as count-as-absence.
    </Alert>
  );
};

const calculateAttendanceRate = (attendances: iSynVAttendance[]) => {
  if (attendances.length <= 0) {
    return "0.00";
  }
  const reportableAbsences = attendances.filter(att =>
    isReportableAbsence(att)
  );
  return MathHelper.mul(
    MathHelper.div(
      MathHelper.sub(attendances.length, reportableAbsences.length),
      attendances.length
    ),
    100
  ).toFixed(2);
};

const isReportableAbsence = (attendance: iSynVAttendance) => {
  if (
    attendance.AttendedFlag === true ||
    attendance.ClassCancelledFlag === true
  ) {
    return false;
  }

  if (`${attendance?.PossibleAbsenceCode || ""}`.trim() === "") {
    return true;
  }

  if (
    `${attendance?.PossibleAbsenceType?.Code || ""}`.trim() !== "" &&
    attendance?.PossibleAbsenceType?.CountAsAbsenceFlag === true
  ) {
    return true;
  }

  return false;
};


const getAttendanceTitleRows = (): string[][] => [
  [
    "Date",
    "Period",
    "Class",
    "Student ID",
    "Student Name",
    "Attended?",
    "Class Canceled?",
    "Possible Absence Type",
    "Possible Absence Code",
    "Possible Reason Code",
    "Possible Description",
  ]
];

const getAttendanceRow = (data: iSynVAttendance, index: number): string[] => [
  `${data.AttendanceDate || ""}`.trim() === ""
    ? ""
    : moment(`${data.AttendanceDate || ""}`.trim()).format(
      "DD MMM YYYY"
    ),
  `${data.AttendancePeriod || ''}`.trim(),
  `${data.ClassCode || ''}`.trim(),
  `${data.ID || ''}`.trim(),
  `${data.SynCommunity?.NameInternal || ''}`.trim(),
  data.AttendedFlag === true ? "Y" : "N",
  data.ClassCancelledFlag === true ? "Y" : "",
  `${data.PossibleAbsenceType?.SynergyMeaning || ''}`.trim(),
  `${data.PossibleAbsenceCode || ''}`.trim(),
  `${data.PossibleReasonCode || ''}`.trim(),
  `${data.PossibleDescription || ''}`.trim(),
]

const genAttendanceSheet = (data: iSynVAttendance[]) => {
  const rows = data.map((record, index) => getAttendanceRow(record, index));
  return XLSX.utils.aoa_to_sheet([...getAttendanceTitleRows(), ...rows]);
}

const genAttendanceExcel = (data: iSynVAttendance[]) => {
  const ws = genAttendanceSheet(data);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    ws,
    `Attendances`
  );
  XLSX.writeFile(wb, `Attendances_${moment().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`);
};

const AttendanceHelper = {
  isReportableAbsence,
  calculateAttendanceRate,
  getReportableAbsenceAlertPanel,
  genAttendanceExcel,
};

export default AttendanceHelper;
