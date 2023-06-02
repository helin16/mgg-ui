import moment from 'moment-timezone';
import * as XLSX from 'sheetjs-style';
import {CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR} from '../../../../types/Synergetic/iLuCampus';
import iSchoolCensusStudentData from './iSchoolCensusStudentData';
import iSynVAttendance from '../../../../types/Synergetic/Attendance/iSynVAttendance';

const defaultCampusCodes = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR];
const getTitleRows = (extra: string[] = []) => [[
  'ID',
  'Student',
  'Year Lvl.',
  'Gender',
  'D.O.B.',
  'Age',
  'International?',
  'Indigenous?',
  'isPastStudent?',
  'Status',
  'Visa Code',
  'Visa Number',
  'Visa Expiry',
  'Entry Date',
  'Left Date',
  'NCCD Category',
  'NCCD Level',
  ...extra,
]];

const getAttendanceTitleRows = (extra: string[] = []) => [[
  'ID',
  'Student',
  'Year Lvl.',
  'Gender',
  'D.O.B.',
  'Age',
  'International?',
  'Indigenous?',
  'isPastStudent?',
  'Status',
  'Entry Date',
  'Left Date',
  'Attendance Date',
  'Class Code',
  ...extra,
]];

const getAttendanceCSVRow = (record: iSynVAttendance & {Student: iSchoolCensusStudentData}) => {
  return [
    record.Student.ID,
    `${record.Student.Surname}, ${record.Student.Given1}`,
    record.Student.yearLevelCode,
    record.Student.gender,
    moment(record.Student.dateOfBirth).format('YYYY-MM-DD'),
    record.Student.age,
    record.Student.isInternationalStudent === true ? 'Y' : '',
    record.Student.isIndigenous === true ? 'Y' : '',
    record.Student.isPastStudent === true ? 'Y' : '',
    `${record.Student.StudentStatusDescription}`,
    moment(record.Student.entryDate).format('YYYY-MM-DD'),
    `${record.Student.leavingDate || ''}`.trim() === '' ? '' : moment(record.Student.leavingDate).format('YYYY-MM-DD'),
    moment(record.AttendanceDate).format('YYYY-MM-DD'),
    record.ClassCode,
  ]
};

const getCSVRow = (record: iSchoolCensusStudentData) => {
  return [
    record.ID,
    `${record.Surname}, ${record.Given1}`,
    record.yearLevelCode,
    record.gender,
    moment(record.dateOfBirth).format('YYYY-MM-DD'),
    record.age,
    record.isInternationalStudent === true ? 'Y' : '',
    record.isIndigenous === true ? 'Y' : '',
    record.isPastStudent === true ? 'Y' : '',
    `${record.StudentStatusDescription}`,
    record.visaCode,
    record.visaNumber,
    `${record.visaExpiryDate || ''}`.trim() === '' ? '' : moment(record.visaExpiryDate).format('YYYY-MM-DD'),
    moment(record.entryDate).format('YYYY-MM-DD'),
    `${record.leavingDate || ''}`.trim() === '' ? '' : moment(record.leavingDate).format('YYYY-MM-DD'),
    `${record.nccdStatusCategory}`.trim() === '' ? '' : `${record.nccdStatusCategory}`,
    `${record.nccdStatusAdjustmentLevel}`.trim() === '' ? '' : `${record.nccdStatusAdjustmentLevel}`,
  ]
};

const genCSVFile = (data: iSchoolCensusStudentData[]) => {
  const rows = data.map(record => getCSVRow(record));
  // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
  const ws = XLSX.utils.aoa_to_sheet([...getTitleRows(), ...rows]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `School_Census_Export_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const SchoolCensusDataExportHelper = {
  getTitleRows,
  getAttendanceTitleRows,
  getCSVRow,
  getAttendanceCSVRow,
  genCSVFile,
  defaultCampusCodes,
};

export default SchoolCensusDataExportHelper;
