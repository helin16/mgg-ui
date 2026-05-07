import AcaraDataHelper from '../../../pages/dataSubmissions/components/ACARA/AcaraDataHelper';

const buildAcaraRecord = (overrides: Record<string, unknown> = {}) => {
  return {
    studentMainSLGValidFlag: true,
    studentMainSLGWarningFlag: false,
    parent1ID: null,
    parent1MainSLGValidFlag: true,
    parent1MainSLGWarningFlag: false,
    parent1HighestSchoolEducationValidFlag: true,
    parent1HighestSchoolEducationWarningFlag: false,
    parent1HighestNonSchoolEducationValidFlag: true,
    parent1HighestNonSchoolEducationWarningFlag: false,
    parent1OccupationGroupValidFlag: true,
    parent1OccupationGroupWarningFlag: false,
    parent2ID: null,
    parent2MainSLGValidFlag: true,
    parent2MainSLGWarningFlag: false,
    parent2HighestSchoolEducationValidFlag: true,
    parent2HighestSchoolEducationWarningFlag: false,
    parent2HighestNonSchoolEducationValidFlag: true,
    parent2HighestNonSchoolEducationWarningFlag: false,
    parent2OccupationGroupValidFlag: true,
    parent2OccupationGroupWarningFlag: false,
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
    expect(
      // @ts-ignore
      AcaraDataHelper.hasInvalidRecord(buildAcaraRecord())
    ).toBe(false);
  });

  test('hasInvalidRecord detects invalid student language code', () => {
    expect(
      // @ts-ignore
      AcaraDataHelper.hasInvalidRecord(
        buildAcaraRecord({studentMainSLGValidFlag: false})
      )
    ).toBe(true);
  });

  test('hasInvalidRecord detects invalid parent fields when a parent exists', () => {
    expect(
      // @ts-ignore
      AcaraDataHelper.hasInvalidRecord(
        buildAcaraRecord({
          parent1ID: 101,
          parent1HighestNonSchoolEducationValidFlag: false,
        })
      )
    ).toBe(true);
  });

  test('hasWarningRecord stays false when no warning flags are set', () => {
    expect(
      // @ts-ignore
      AcaraDataHelper.hasWarningRecord(buildAcaraRecord())
    ).toBe(false);
  });

  test('hasWarningRecord detects a student warning flag', () => {
    expect(
      // @ts-ignore
      AcaraDataHelper.hasWarningRecord(
        buildAcaraRecord({studentMainSLGWarningFlag: true})
      )
    ).toBe(true);
  });

  test('hasWarningRecord detects parent warning flags when a parent exists', () => {
    expect(
      // @ts-ignore
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
      // @ts-ignore
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
