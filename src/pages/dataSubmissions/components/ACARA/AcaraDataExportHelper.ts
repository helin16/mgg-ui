import iAcaraData from './iAcaraData';
import * as XLSX from 'sheetjs-style';
import moment from 'moment-timezone';


type iGenExcelExtra = {
  schoolId: string;
  schoolName: string;
}
const getAcaraSheetTitleRows = () => {
  return [[
    'ACARA SML ID',
    'School Name',
    'Calendar Year',
    'Jurisdiction Student ID',
    'Grade Of Student Enrolment',
    'Date Of Birth',
    'Sex',
    'ATSI Status',
    'Students Main SLG',
    'Parent Guardian 1 School Education',
    'Parent Guardian 1 Highest NonSchool Education',
    'Parent Guardian 1 Occupation Group',
    'Parent Guardian 1 Main SLG',
    'Parent Guardian 2 School Education',
    'Parent Guardian 2 Highest NonSchool Education',
    'Parent Guardian 2 Occupation Group',
    'Parent Guardian 2 Main SLG',
  ]];
}

const getAcaraCSVRow = (data: iAcaraData, {schoolId, schoolName}: iGenExcelExtra) => {
  const parent1Id = `${data.parent1ID || ''}`.trim();
  const parent2Id = `${data.parent2ID || ''}`.trim();
  return [
    schoolId,
    schoolName,
    data.fileYear,
    data.ID,
    data.yearLevelCode,
    `${data.dateOfBirth || ''}`.trim() === '' ? '' : moment(`${data.dateOfBirth || ''}`.trim()).format('DD/MM/YYYY'),
    data.sex,
    data.ATSIStatus,
    data.studentMainSLG,

    parent1Id === '' ? '' : data.parent1HighestSchoolEducation,
    parent1Id === '' ? '' : data.parent1HighestNonSchoolEducation,
    parent1Id === '' ? '' : data.parent1OccupationGroup,
    parent1Id === '' ? '' : data.parent1MainSLG,

    parent2Id === '' ? '' : data.parent2HighestSchoolEducation,
    parent2Id === '' ? '' : data.parent2HighestNonSchoolEducation,
    parent2Id === '' ? '' : data.parent2OccupationGroup,
    parent2Id === '' ? '' : data.parent2MainSLG,
  ]
}

const getRawDataTitleRows = () => {
  return [[
    'Student ID',
    'Student Given',
    'Student Surname',
    'File Year',
    'File Semester',
    'Date Of Birth',
    'Year Level',
    'Gender',
    'Acara Sex',

    'is International?',
    'is Past?',
    'Entry Date',
    'Leaving Date',

    'is Indigenous?',
    'is Torres Strait Islander?',
    'ATSI Status',

    'Home Language Code',
    'Home Language Description',
    'Home Language Acara',
    'Home Language Valid for Acara?',

    ...([1, 2].map(index => [
      `Parent ${index} ID`,
      `Parent ${index} Name`,
      `Parent ${index} HL Code`,
      `Parent ${index} HL Description`,
      `Parent ${index} HL Acara`,
      `Parent ${index} HL Valid for Acara?`,

      `Parent ${index} School EDU Code`,
      `Parent ${index} School EDU Description`,
      `Parent ${index} School EDU Acara`,
      `Parent ${index} School EDU Valid for Acara?`,

      `Parent ${index} NON School EDU Code`,
      `Parent ${index} NON School EDU Description`,
      `Parent ${index} NON School EDU Acara`,
      `Parent ${index} NON School EDU Valid for Acara?`,

      `Parent ${index} Occ Grp Code`,
      `Parent ${index} Occ Grp Description`,
      `Parent ${index} Occ Grp Acara`,
      `Parent ${index} Occ Grp Valid for Acara?`,
    ]).reduce((arr, row) => [...arr, ...row], []))

  ]];
}

const getRawDataCSVRow = (data: iAcaraData) => {
  return [
    data.ID,
    data.Given1,
    data.Surname,
    data.fileYear,
    data.fileSemester,
    `${data.dateOfBirth || ''}`.trim() === '' ? '' : moment(`${data.dateOfBirth || ''}`.trim()).format('DD/MM/YYYY'),
    data.yearLevelCode,
    data.gender,
    data.sex,

    data.isInternationalStudent === true ? 'Y' : '',
    data.isPastStudent === true ? 'Y' : '',
    `${data.entryDate || ''}`.trim() === '' ? '' : moment(`${data.entryDate || ''}`.trim()).format('DD/MM/YYYY'),
    `${data.leavingDate || ''}`.trim() === '' ? '' : moment(`${data.leavingDate || ''}`.trim()).format('DD/MM/YYYY'),

    data.isAboriginal === true ? 'Y' : '',
    data.isTorresStraitIslander === true ? 'Y' : '',
    data.ATSIStatus,

    data.studentHomeLanguageCode,
    data.studentHomeLanguageDescription,
    data.studentMainSLG,
    data.studentMainSLGValidFlag === true ? 'Y' : '',

    ...([1, 2].map(index => {
      // @ts-ignore
      const parentId = `${data[`parent${index}ID`] || ''}`.trim();
      return [
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}ID`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}Name`],

        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HomeLanguageCode`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HomeLanguageDescription`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}MainSLG`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}MainSLGValidFlag`] === true ? 'Y' : '',

        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestSchoolEducationCode`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestNonSchoolEducationDescription`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestSchoolEducation`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestSchoolEducationValidFlag`] === true ? 'Y' : '',

        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestNonSchoolEducationCode`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestNonSchoolEducationDescription`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestNonSchoolEducation`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}HighestNonSchoolEducationValidFlag`] === true ? 'Y' : '',

        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}OccupationGroupCode`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}OccupationGroupDescription`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}OccupationGroup`],
        // @ts-ignore
        parentId === '' ? '' : data[`parent${index}OccupationGroupValidFlag`] === true ? 'Y' : '',
      ]
    }).reduce((arr, row) => [...arr, ...row], []))
  ]
}


const genAcaraSheet = (data: iAcaraData[], {schoolId, schoolName}: iGenExcelExtra) => {
  const rowsAcara = data.map(record => getAcaraCSVRow(record, {schoolId, schoolName}));
  return XLSX.utils.aoa_to_sheet([...getAcaraSheetTitleRows(), ...rowsAcara]);
}

const genRawDataSheet = (data: iAcaraData[]) => {
  const rowsAcara = data.map(record => getRawDataCSVRow(record));
  return XLSX.utils.aoa_to_sheet([...getRawDataTitleRows(), ...rowsAcara]);
}

const genAcaraExcel = (data: iAcaraData[], extraData: iGenExcelExtra) => {
  const wsAcara = genAcaraSheet(data, extraData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsAcara, `Acara_${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `Acara_Export_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const genTotalExcel = (data: iAcaraData[], extraData: iGenExcelExtra) => {
  const wsAcara = genAcaraSheet(data, extraData);
  const wsRaw = genRawDataSheet(data);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsAcara, `Acara_${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.utils.book_append_sheet(wb, wsRaw, `Raw_${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `Acara_Total_Export_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const AcaraDataExportHelper = {
  genAcaraExcel,
  genTotalExcel,
}

export default AcaraDataExportHelper;
