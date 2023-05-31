import moment from 'moment-timezone';
import * as XLSX from 'sheetjs-style';
import {CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR} from '../../../../types/Synergetic/iLuCampus';

const defaultCampusCodes = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR];
const genCSVFile = (data: any[]) => {
  const titleRows = [[
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
  ]]

  const rows = data.map(record => {
    return [
      record.ID,
      `${record.Given1} ${record.Surname}`,
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
  });
  // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
  const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `School_Census_Export_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const SchoolCensusDataExportHelper = {
  genCSVFile,
  defaultCampusCodes,
};

export default SchoolCensusDataExportHelper;
