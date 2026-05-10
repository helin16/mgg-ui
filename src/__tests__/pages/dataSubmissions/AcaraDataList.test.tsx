import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AcaraDataList from '../../../pages/dataSubmissions/components/ACARA/AcaraDataList';
import { PageLoadingSpinnerTestId } from '../../../components/common/__mocks__/PageLoadingSpinner';
import iAcaraData from '../../../pages/dataSubmissions/components/ACARA/iAcaraData';

jest.mock('../../../components/common/PageLoadingSpinner');
jest.mock('../../../components/common/Table');

const buildRecord = (overrides: Partial<iAcaraData> = {}): iAcaraData => {
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
  };
};

describe('AcaraDataList', () => {
  test('renders loading spinner when loading', () => {
    const view = renderToStaticMarkup(
      <AcaraDataList isLoading={true} records={[buildRecord()]} />
    );

    expect(view).toContain(PageLoadingSpinnerTestId);
  });

  test('renders invalid and warning badges for changed ACARA statuses', () => {
    const view = renderToStaticMarkup(
      <AcaraDataList
        records={[
          buildRecord({
            studentMainSLGValidFlag: false,
            studentMainSLGWarningFlag: true,
            parent1HighestSchoolEducationWarningFlag: true,
          }),
        ]}
      />
    );

    expect(view).toContain('Invalid');
    expect(view).toContain('Warning');
    expect(view).toContain('badge bg-danger');
    expect(view).toContain('badge bg-warning');
  });

  test('does not render parent section when parent id is missing', () => {
    const view = renderToStaticMarkup(
      <AcaraDataList
        records={[
          buildRecord({
            parent1ID: null,
            parent1Name: null,
          }),
        ]}
      />
    );

    expect(view).not.toContain('Parent One [101]');
  });
});
