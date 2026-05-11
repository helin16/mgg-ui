import AcaraDataHelper from '../../../../../pages/dataSubmissions/components/ACARA/AcaraDataHelper';
import iAcaraData from '../../../../../pages/dataSubmissions/components/ACARA/iAcaraData';

const buildAcaraRecord = (overrides: Partial<iAcaraData> = {}): iAcaraData => ({
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
  parent1ID: null,
  parent1Name: null,
  parent1HighestSchoolEducation: null,
  parent1HighestSchoolEducationCode: null,
  parent1MainSLGValidFlag: true,
  parent1MainSLGWarningFlag: false,
  parent1HighestSchoolEducationValidFlag: true,
  parent1HighestSchoolEducationWarningFlag: false,
  parent1HighestNonSchoolEducation: null,
  parent1HighestNonSchoolEducationValidFlag: true,
  parent1HighestNonSchoolEducationWarningFlag: false,
  parent1HighestNonSchoolEducationCode: null,
  parent1HighestNonSchoolEducationDescription: null,
  parent1MainSLG: null,
  parent1HomeLanguageCode: null,
  parent1HomeLanguageDescription: null,
  parent1OccupationGroup: null,
  parent1OccupationGroupValidFlag: true,
  parent1OccupationGroupWarningFlag: false,
  parent1OccupationGroupCode: null,
  parent1OccupationGroupDescription: null,
  parent2ID: null,
  parent2Name: null,
  parent2HighestSchoolEducation: null,
  parent2HighestSchoolEducationCode: null,
  parent2MainSLGValidFlag: true,
  parent2MainSLGWarningFlag: false,
  parent2HighestSchoolEducationValidFlag: true,
  parent2HighestSchoolEducationWarningFlag: false,
  parent2HighestNonSchoolEducation: null,
  parent2HighestNonSchoolEducationValidFlag: true,
  parent2HighestNonSchoolEducationWarningFlag: false,
  parent2HighestNonSchoolEducationCode: null,
  parent2HighestNonSchoolEducationDescription: null,
  parent2MainSLG: null,
  parent2HomeLanguageCode: null,
  parent2HomeLanguageDescription: null,
  parent2OccupationGroup: null,
  parent2OccupationGroupValidFlag: true,
  parent2OccupationGroupWarningFlag: false,
  parent2OccupationGroupCode: null,
  parent2OccupationGroupDescription: null,
  ...overrides,
});

describe('AcaraDataHelper', () => {
  test('flags invalid and warning rows based on student and parent flags', () => {
    expect(AcaraDataHelper.hasInvalidRecord(buildAcaraRecord())).toBe(false);
    expect(
      AcaraDataHelper.hasInvalidRecord(
        buildAcaraRecord({parent1ID: 10, parent1OccupationGroupValidFlag: false})
      )
    ).toBe(true);

    expect(AcaraDataHelper.hasWarningRecord(buildAcaraRecord())).toBe(false);
    expect(
      AcaraDataHelper.hasWarningRecord(
        buildAcaraRecord({studentMainSLGWarningFlag: true})
      )
    ).toBe(true);
  });

  test('counts warning occurrences across student and parent fields', () => {
    expect(
      AcaraDataHelper.countWarningOccurrences(
        buildAcaraRecord({
          studentMainSLGWarningFlag: true,
          parent1ID: 10,
          parent1MainSLGWarningFlag: true,
          parent2ID: 20,
          parent2HighestSchoolEducationWarningFlag: true,
        })
      )
    ).toBe(3);
  });
});
