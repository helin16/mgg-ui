import AcaraDataHelper from '../../../pages/dataSubmissions/components/ACARA/AcaraDataHelper';
import iAcaraData from '../../../pages/dataSubmissions/components/ACARA/iAcaraData';

const buildAcaraRecord = (
  overrides: Partial<iAcaraData> = {}
): iAcaraData => {
  return {
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
  };
};

describe('AcaraDataHelper', () => {
  test.each([
    ['0000', true],
    ['0001', true],
    ['0002', true],
    ['1201', false],
  ])('hasLanguageWarning(%s) returns %s', (code, expected) => {
    expect(AcaraDataHelper.hasLanguageWarning(code)).toBe(expected);
  });

  test.each([
    ['0', true],
    ['4', false],
  ])('hasHighestSchoolEduWarning(%s) returns %s', (code, expected) => {
    expect(AcaraDataHelper.hasHighestSchoolEduWarning(code)).toBe(expected);
  });

  test.each([
    ['0', true],
    ['7', false],
  ])('hasQualificationLevelWarning(%s) returns %s', (code, expected) => {
    expect(AcaraDataHelper.hasQualificationLevelWarning(code)).toBe(expected);
  });

  test.each([
    ['9', true],
    ['1', false],
  ])('hasOccupGroupWarning(%s) returns %s', (code, expected) => {
    expect(AcaraDataHelper.hasOccupGroupWarning(code)).toBe(expected);
  });

  test('hasInvalidRecord stays false for a fully valid row', () => {
    expect(AcaraDataHelper.hasInvalidRecord(buildAcaraRecord())).toBe(false);
  });

  test('hasInvalidRecord detects invalid student language code', () => {
    expect(
      AcaraDataHelper.hasInvalidRecord(
        buildAcaraRecord({studentMainSLGValidFlag: false})
      )
    ).toBe(true);
  });

  test('hasInvalidRecord detects invalid parent fields when a parent exists', () => {
    expect(
      AcaraDataHelper.hasInvalidRecord(
        buildAcaraRecord({
          parent1ID: 101,
          parent1HighestNonSchoolEducationValidFlag: false,
        })
      )
    ).toBe(true);
  });

  test('hasWarningRecord stays false when no warning flags are set', () => {
    expect(AcaraDataHelper.hasWarningRecord(buildAcaraRecord())).toBe(false);
  });

  test('hasWarningRecord detects a student warning flag', () => {
    expect(
      AcaraDataHelper.hasWarningRecord(
        buildAcaraRecord({studentMainSLGWarningFlag: true})
      )
    ).toBe(true);
  });

  test('hasWarningRecord detects parent warning flags when a parent exists', () => {
    expect(
      AcaraDataHelper.hasWarningRecord(
        buildAcaraRecord({
          parent2ID: 202,
          parent2OccupationGroupWarningFlag: true,
        })
      )
    ).toBe(true);
  });

  test('countWarningOccurrences counts all warning fields on a row', () => {
    expect(
      AcaraDataHelper.countWarningOccurrences(
        buildAcaraRecord({
          studentMainSLGWarningFlag: true,
          parent1ID: 101,
          parent1MainSLGWarningFlag: true,
          parent1OccupationGroupWarningFlag: true,
          parent2ID: 202,
          parent2HighestSchoolEducationWarningFlag: true,
        })
      )
    ).toBe(4);
  });
});
