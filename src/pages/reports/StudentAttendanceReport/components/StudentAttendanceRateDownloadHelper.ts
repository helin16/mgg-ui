import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';
import {iVPastAndCurrentStudent} from '../../../../types/Synergetic/Student/iVStudent';
import iSynVStudentAttendanceHistory from '../../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory';

const downloadStudentsWithRate = (data: any[]) => {
  const titleRow = [[
    'ID',
    'Student',
    'Year Lvl.',
    'Form',
    'Status',
    'Leaving / Left Date',
    'Is Past Student?',
    'Attendance Rate (%)',
  ]]
  const rows = data.map(record => {
    return [
      `${record.StudentID || ''}`,
      `${record.StudentNameExternal || ''}`,
      `${record.StudentYearLevel || ''}`,
      `${record.StudentForm || ''}`,
      `${record.StudentStatusDescription || ''}`,
      `${record.StudentLeavingDate || ''}`.trim() !== '' ? moment(`${record.StudentLeavingDate || ''}`.trim()).format('YYYY-MM-DD') : '',
      record.StudentIsPastFlag === true ? 'Y' : '',
      Number(record.attendanceRate || 0).toFixed(2),
    ]
  });
  // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
  const ws = XLSX.utils.aoa_to_sheet([...titleRow, ...rows]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `Student_Attendance_Rate_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const downloadStudentsAttendanceRecords = (students: iVPastAndCurrentStudent[], data: {[key: number]: iSynVStudentAttendanceHistory[]}) => {
  const titleRow = [[
    'ID',
    'Student',
    'Year Lvl.',
    'Form',
    'Status',
    'Leaving / Left Date',
    'Is Past Student?',
    'Attendance Date',
    'Attendance Period',
    'Attendance Class Code',
    'Attended ?',
    'Possible Absence Code',
    'Possible Reason Code',
    'Possible Reason',
  ]]
  const rows: any[][] = [];
  students.forEach(student => {
    const records = student.StudentID in data ? data[student.StudentID] : [];
    return records.forEach(record => {
      rows.push([
        `${student.StudentID || ''}`,
        `${student.StudentNameExternal || ''}`,
        `${student.StudentYearLevel || ''}`,
        `${student.StudentForm || ''}`,
        `${student.StudentStatusDescription || ''}`,
        `${student.StudentLeavingDate || ''}`.trim() !== '' ? moment(`${student.StudentLeavingDate || ''}`.trim()).format('YYYY-MM-DD') : '',
        student.StudentIsPastFlag === true ? 'Y' : '',
        `${record.AttendanceDate || ''}`.trim() !== '' ? moment(`${record.AttendanceDate || ''}`.trim()).format('YYYY-MM-DD') : '',
        `${record.AttendancePeriod || ''}`,
        `${record.ClassCode || ''}`,
        record.AttendedFlag === true ? 'Y' : '',
        `${record.PossibleAbsenceCode || ''}`,
        `${record.PossibleReasonCode || ''}`,
      ])
    })
  });
  // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
  const ws = XLSX.utils.aoa_to_sheet([...titleRow, ...rows]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `Student_Att_Records_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const StudentAttendanceRateDownloadHelper = {
  downloadStudentsWithRate,
  downloadStudentsAttendanceRecords,
};

export default StudentAttendanceRateDownloadHelper;
