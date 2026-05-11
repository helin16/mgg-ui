import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import AttendancesListWithSearchPanel from '../../../components/Attendance/AttendancesListWithSearchPanel';
import SynVAttendanceService from '../../../services/Synergetic/Attendance/SynVAttendanceService';
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import SynAttendanceService from '../../../services/Synergetic/Attendance/SynAttendanceService';
import AttendanceHelper from '../../../components/Attendance/AttendanceHelper';
import {PageLoadingSpinnerTestId} from '../../../components/common/__mocks__/PageLoadingSpinner';

jest.mock('../../../components/common/DateRangeSelector');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/common/SelectBox');
jest.mock('../../../components/form/FlagSelector');
jest.mock('../../../components/common/LoadingBtn');
jest.mock('../../../components/common/Table');
jest.mock('../../../components/student/SynStudentProfileSelector');
jest.mock('../../../components/common/CheckBox');
jest.mock('../../../components/common/PopupModal');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../components/ExplanationPanel');
jest.mock('../../../components/Absence/SynLuAbsenceReasonSelector');
jest.mock('../../../components/Absence/SynLuAbsenceTypeSelector');
jest.mock('../../../components/common/PageLoadingSpinner');
jest.mock('../../../services/Synergetic/Attendance/SynVAttendanceService');
jest.mock('../../../services/Synergetic/Attendance/SynAttendanceService');
jest.mock('../../../services/Toaster');
jest.mock('../../../components/Attendance/AttendanceHelper', () => {
  const actual = jest.requireActual('../../../components/Attendance/AttendanceHelper');
  return {
    __esModule: true,
    default: {
      ...actual.default,
      genAttendanceExcel: jest.fn(),
    },
  };
});

describe('AttendancesListWithSearchPanel', () => {
  const mockedListService = SynVAttendanceService as jest.Mocked<typeof SynVAttendanceService>;
  const mockedAttendanceService = SynAttendanceService as jest.Mocked<typeof SynAttendanceService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;
  const mockedAttendanceHelper = AttendanceHelper as jest.Mocked<typeof AttendanceHelper>;

  const buildResponse = (overrides: any = {}) => ({
    currentPage: 1,
    pages: 1,
    perPage: 50,
    total: 1,
    data: [
      {
        AttendanceSeq: 10,
        AttendanceDate: '2026-02-03T00:00:00.000Z',
        AttendancePeriod: 2,
        ClassCode: 'ENG1',
        ID: '123',
        AttendedFlag: false,
        ClassCancelledFlag: false,
        PossibleAbsenceType: null,
        PossibleAbsenceCode: '',
        PossibleReasonCode: '',
        PossibleDescription: '',
        SynCommunity: {Given1: 'Ada', Surname: 'Lovelace'},
      },
    ],
    ...overrides,
  });

  test('shows a validation toast when search is missing the start date', async () => {
    render(<AttendancesListWithSearchPanel />);

    fireEvent.click(screen.getByRole('button', {name: 'Pick End'}));
    fireEvent.click(screen.getByRole('button', {name: /Search/i}));

    await waitFor(() =>
      expect(mockedToaster.showToast).toHaveBeenCalledWith(
        'Attendance date range is required for start date',
        TOAST_TYPE_ERROR
      )
    );
  });

  test('loads and renders search results after valid search criteria', async () => {
    mockedListService.getAll.mockResolvedValue(buildResponse() as any);

    render(<AttendancesListWithSearchPanel />);

    fireEvent.click(screen.getByRole('button', {name: 'Pick Start'}));
    fireEvent.click(screen.getByRole('button', {name: 'Pick End'}));
    fireEvent.click(screen.getByRole('button', {name: /Search/i}));

    expect(screen.getByTestId(PageLoadingSpinnerTestId)).toBeInTheDocument();

    await waitFor(() => expect(mockedListService.getAll).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByRole('button', {name: 'Export'})).toBeInTheDocument());
    expect(screen.getByText(/\[123\]\s+Ada\s+Lovelace/)).toBeInTheDocument();
  });

  test('supports bulk edit mode and saves selected unattended records', async () => {
    mockedListService.getAll.mockResolvedValue(buildResponse() as any);
    mockedAttendanceService.update.mockResolvedValue({AttendanceSeq: 10} as any);

    render(<AttendancesListWithSearchPanel allowEdit />);

    fireEvent.click(screen.getByRole('button', {name: 'Pick Start'}));
    fireEvent.click(screen.getByRole('button', {name: 'Pick End'}));
    fireEvent.click(screen.getByRole('button', {name: /Search/i}));

    await waitFor(() => expect(screen.getAllByTestId('CheckBoxTestId').length).toBe(1));

    fireEvent.click(screen.getAllByTestId('CheckBoxTestId')[0]);
    fireEvent.click(screen.getByRole('button', {name: /edit 1 unattended record/i}));
    fireEvent.click(screen.getByRole('button', {name: 'Pick Type'}));
    fireEvent.click(screen.getByRole('button', {name: /update 1 record/i}));

    await waitFor(() => expect(mockedAttendanceService.update).toHaveBeenCalledWith(10, {PossibleAbsenceCode: 'ABS'}));
    expect(mockedToaster.showToast).toHaveBeenCalledWith('1 record(s) updated successfully.', TOAST_TYPE_SUCCESS);
  });

  test('exports the current result set', async () => {
    mockedListService.getAll.mockResolvedValue(buildResponse({total: 1}) as any);

    render(<AttendancesListWithSearchPanel />);

    fireEvent.click(screen.getByRole('button', {name: 'Pick Start'}));
    fireEvent.click(screen.getByRole('button', {name: 'Pick End'}));
    fireEvent.click(screen.getByRole('button', {name: /Search/i}));

    await waitFor(() => expect(screen.getByRole('button', {name: 'Export'})).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', {name: 'Export'}));
    await waitFor(() => expect(mockedListService.getAll).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByRole('button', {name: /Click here to Download/i})).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', {name: /Click here to Download/i}));

    await waitFor(() =>
      expect(mockedAttendanceHelper.genAttendanceExcel).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({AttendanceSeq: 10})])
      )
    );
  });
});
