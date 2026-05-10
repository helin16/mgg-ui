import AcaraDataPanelHelper from '../../../pages/dataSubmissions/components/ACARA/AcaraDataPanelHelper';
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

describe('AcaraDataPanelHelper', () => {
  test('getInvalidRecordCount counts rows with at least one invalid field', () => {
    const records: iAcaraData[] = [
      buildAcaraRecord({ID: 1}),
      buildAcaraRecord({ID: 2, studentMainSLGValidFlag: false}),
      buildAcaraRecord({
        ID: 3,
        parent1ID: 101,
        parent1OccupationGroupValidFlag: false,
      }),
    ];

    expect(AcaraDataPanelHelper.getInvalidRecordCount(records)).toBe(2);
  });

  test('getWarningRowCount counts rows that contain at least one warning', () => {
    const records: iAcaraData[] = [
      buildAcaraRecord({ID: 1}),
      buildAcaraRecord({ID: 2, studentMainSLGWarningFlag: true}),
      buildAcaraRecord({
        ID: 3,
        parent2ID: 202,
        parent2HighestSchoolEducationWarningFlag: true,
      }),
    ];

    expect(AcaraDataPanelHelper.getWarningRowCount(records)).toBe(2);
  });

  test('getWarningOccurrenceCount totals every warning field occurrence', () => {
    const records: iAcaraData[] = [
      buildAcaraRecord({ID: 1, studentMainSLGWarningFlag: true}),
      buildAcaraRecord({
        ID: 2,
        parent1ID: 101,
        parent1MainSLGWarningFlag: true,
        parent1OccupationGroupWarningFlag: true,
      }),
    ];

    expect(AcaraDataPanelHelper.getWarningOccurrenceCount(records)).toBe(3);
  });

  test('getFilteredRecords returns all rows when no active filter is available', () => {
    const records: iAcaraData[] = [
      buildAcaraRecord({ID: 1}),
      buildAcaraRecord({ID: 2}),
    ];

    expect(
      AcaraDataPanelHelper.getFilteredRecords(records, false, false)
    ).toEqual(records);
    expect(
      AcaraDataPanelHelper.getFilteredRecords(records, true, false)
    ).toEqual(records);
  });

  test('getFilteredRecords keeps invalid and warning rows with OR semantics', () => {
    const validRow = buildAcaraRecord({ID: 1});
    const invalidRow = buildAcaraRecord({ID: 2, studentMainSLGValidFlag: false});
    const warningRow = buildAcaraRecord({ID: 3, studentMainSLGWarningFlag: true});

    const records = [validRow, invalidRow, warningRow];

    expect(
      AcaraDataPanelHelper.getFilteredRecords(records, true, false)
    ).toEqual([invalidRow]);
    expect(
      AcaraDataPanelHelper.getFilteredRecords(records, false, true)
    ).toEqual([warningRow]);
    expect(
      AcaraDataPanelHelper.getFilteredRecords(records, true, true)
    ).toEqual([invalidRow, warningRow]);
  });
});
