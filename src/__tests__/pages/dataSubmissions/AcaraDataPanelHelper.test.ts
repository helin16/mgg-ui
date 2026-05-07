import AcaraDataPanelHelper from '../../../pages/dataSubmissions/components/ACARA/AcaraDataPanelHelper';

const buildAcaraRecord = (overrides: Record<string, unknown> = {}) => {
  return {
    ID: 1,
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

describe('AcaraDataPanelHelper', () => {
  test('getInvalidRecordCount counts rows with at least one invalid field', () => {
    const records = [
      // @ts-ignore
      buildAcaraRecord({ID: 1}),
      // @ts-ignore
      buildAcaraRecord({ID: 2, studentMainSLGValidFlag: false}),
      // @ts-ignore
      buildAcaraRecord({
        ID: 3,
        parent1ID: 101,
        parent1OccupationGroupValidFlag: false,
      }),
    ];

    expect(AcaraDataPanelHelper.getInvalidRecordCount(records as any)).toBe(2);
  });

  test('getWarningRowCount counts rows that contain at least one warning', () => {
    const records = [
      // @ts-ignore
      buildAcaraRecord({ID: 1}),
      // @ts-ignore
      buildAcaraRecord({ID: 2, studentMainSLGWarningFlag: true}),
      // @ts-ignore
      buildAcaraRecord({
        ID: 3,
        parent2ID: 202,
        parent2HighestSchoolEducationWarningFlag: true,
      }),
    ];

    expect(AcaraDataPanelHelper.getWarningRowCount(records as any)).toBe(2);
  });

  test('getWarningOccurrenceCount totals every warning field occurrence', () => {
    const records = [
      // @ts-ignore
      buildAcaraRecord({ID: 1, studentMainSLGWarningFlag: true}),
      // @ts-ignore
      buildAcaraRecord({
        ID: 2,
        parent1ID: 101,
        parent1MainSLGWarningFlag: true,
        parent1OccupationGroupWarningFlag: true,
      }),
    ];

    expect(AcaraDataPanelHelper.getWarningOccurrenceCount(records as any)).toBe(3);
  });

  test('getFilteredRecords returns all rows when no active filter is available', () => {
    const records = [
      // @ts-ignore
      buildAcaraRecord({ID: 1}),
      // @ts-ignore
      buildAcaraRecord({ID: 2}),
    ];

    expect(
      AcaraDataPanelHelper.getFilteredRecords(records as any, false, false)
    ).toEqual(records);
    expect(
      AcaraDataPanelHelper.getFilteredRecords(records as any, true, false)
    ).toEqual(records);
  });

  test('getFilteredRecords keeps invalid and warning rows with OR semantics', () => {
    const validRow =
      // @ts-ignore
      buildAcaraRecord({ID: 1});
    const invalidRow =
      // @ts-ignore
      buildAcaraRecord({ID: 2, studentMainSLGValidFlag: false});
    const warningRow =
      // @ts-ignore
      buildAcaraRecord({ID: 3, studentMainSLGWarningFlag: true});

    const records = [validRow, invalidRow, warningRow];

    expect(
      AcaraDataPanelHelper.getFilteredRecords(records as any, true, false)
    ).toEqual([invalidRow]);
    expect(
      AcaraDataPanelHelper.getFilteredRecords(records as any, false, true)
    ).toEqual([warningRow]);
    expect(
      AcaraDataPanelHelper.getFilteredRecords(records as any, true, true)
    ).toEqual([invalidRow, warningRow]);
  });
});
