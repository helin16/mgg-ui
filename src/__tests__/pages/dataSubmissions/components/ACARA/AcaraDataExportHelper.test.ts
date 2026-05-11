import AcaraDataExportHelper from '../../../../../pages/dataSubmissions/components/ACARA/AcaraDataExportHelper';
import iAcaraData from '../../../../../pages/dataSubmissions/components/ACARA/iAcaraData';
import * as XLSX from 'sheetjs-style';

jest.mock('sheetjs-style', () => ({
  utils: {
    aoa_to_sheet: jest.fn((rows) => ({rows})),
    book_new: jest.fn(() => ({sheets: []})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

const buildRecord = (overrides: Partial<iAcaraData> = {}): iAcaraData => ({
  ID: 1,
  Given1: 'Ada',
  Surname: 'Lovelace',
  gender: 'F',
  sex: '2',
  fileYear: 2026,
  fileSemester: 1,
  campusCode: 'SEN',
  entryDate: '2026-01-01T00:00:00Z',
  leavingDate: '',
  yearLevelCode: '10',
  dateOfBirth: '2010-01-01T00:00:00Z',
  isInternationalStudent: false,
  isPastStudent: false,
  ATSIStatus: '4',
  isTorresStraitIslander: false,
  isAboriginal: false,
  studentHomeLanguageCode: 'ENG',
  studentHomeLanguageDescription: 'English',
  studentMainSLG: '1201',
  studentMainSLGValidFlag: true,
  studentMainSLGWarningFlag: false,
  parent1ID: 101,
  parent1Name: 'Parent One',
  parent1HighestSchoolEducation: '4',
  parent1HighestSchoolEducationCode: '12',
  parent1HighestSchoolEducationValidFlag: true,
  parent1HighestSchoolEducationWarningFlag: false,
  parent1HighestNonSchoolEducation: '7',
  parent1HighestNonSchoolEducationValidFlag: true,
  parent1HighestNonSchoolEducationWarningFlag: false,
  parent1HighestNonSchoolEducationCode: 'POSTGRAD',
  parent1HighestNonSchoolEducationDescription: 'Postgraduate',
  parent1MainSLG: '1201',
  parent1MainSLGValidFlag: true,
  parent1MainSLGWarningFlag: false,
  parent1HomeLanguageCode: 'ENG',
  parent1HomeLanguageDescription: 'English',
  parent1OccupationGroup: '1',
  parent1OccupationGroupValidFlag: true,
  parent1OccupationGroupWarningFlag: false,
  parent1OccupationGroupCode: 'EXEC',
  parent1OccupationGroupDescription: 'Executive',
  parent2ID: null,
  parent2Name: null,
  parent2HighestSchoolEducation: null,
  parent2HighestSchoolEducationCode: null,
  parent2HighestSchoolEducationValidFlag: true,
  parent2HighestSchoolEducationWarningFlag: false,
  parent2HighestNonSchoolEducation: null,
  parent2HighestNonSchoolEducationValidFlag: true,
  parent2HighestNonSchoolEducationWarningFlag: false,
  parent2HighestNonSchoolEducationCode: null,
  parent2HighestNonSchoolEducationDescription: null,
  parent2MainSLG: null,
  parent2MainSLGValidFlag: true,
  parent2MainSLGWarningFlag: false,
  parent2HomeLanguageCode: null,
  parent2HomeLanguageDescription: null,
  parent2OccupationGroup: null,
  parent2OccupationGroupValidFlag: true,
  parent2OccupationGroupWarningFlag: false,
  parent2OccupationGroupCode: null,
  parent2OccupationGroupDescription: null,
  ...overrides,
});

describe('AcaraDataExportHelper', () => {
  const mockedXlsx = XLSX as jest.Mocked<typeof XLSX>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates the ACARA workbook rows and writes the export file', () => {
    AcaraDataExportHelper.genAcaraExcel([buildRecord()], {
      schoolId: '46195',
      schoolName: 'Mentone Girls Grammar',
    });

    expect(mockedXlsx.utils.aoa_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining(['ACARA SML ID', 'School Name']),
        expect.arrayContaining(['46195', 'Mentone Girls Grammar', 2026, 1]),
      ])
    );
    expect(mockedXlsx.writeFile.mock.calls[0][1]).toMatch(/^Acara_Export_/);
  });

  test('creates both sheets for the total export and blanks missing parent 2 values', () => {
    AcaraDataExportHelper.genTotalExcel([buildRecord()], {
      schoolId: '46195',
      schoolName: 'Mentone Girls Grammar',
    });

    expect(mockedXlsx.utils.book_append_sheet).toHaveBeenCalledTimes(2);
    expect(mockedXlsx.utils.aoa_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining([
          1,
          'Ada',
          'Lovelace',
          2026,
          1,
          '01/01/2010',
          '10',
          'F',
          '2',
          '',
          '',
          '01/01/2026',
          '',
        ]),
      ])
    );
  });

  test('creates the SFOE workbook and writes the matching filename', () => {
    AcaraDataExportHelper.genSFOEExcel([buildRecord()]);

    expect(mockedXlsx.writeFile.mock.calls[0][1]).toMatch(/^SFOE_/);
  });
});
