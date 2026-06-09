import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import StudentAbsenceList from '../../../../pages/studentAbsences/components/StudentAbsenceList';
import StudentAbsenceDailySummaryService from '../../../../services/StudentAbsences/StudentAbsenceDailySummaryService';
import SynLuYearLevelService from '../../../../services/Synergetic/Lookup/SynLuYearLevelService';
import SynVStudentAbsenceEventsService from '../../../../services/Synergetic/Attendance/SynVStudentAbsenceEventsService';
import SynTimetableDefinitionService from '../../../../services/Synergetic/TimeTable/SynTimetableDefinitionService';
import Toaster, { TOAST_TYPE_SUCCESS } from '../../../../services/Toaster';
import { DateRangeSelectorTestId } from '../../../../components/common/__mocks__/DateRangeSelector';

jest.mock('../../../../components/common/DateRangeSelector');
jest.mock('../../../../components/common/Table');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/student/YearLevelSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="YearLevelSelector" />,
}));
jest.mock('../../../../components/student/SynFormSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="LuFormSelector" />,
}));
jest.mock('../../../../pages/studentAbsences/components/StudentAbsenceDailySummaryEmailModal', () => ({
  __esModule: true,
  default: ({ show, onSend, onClose }: any) => {
    if (!show) return null;
    return (
      <div data-testid="EmailModal">
        <button
          data-testid="EmailModalSend"
          onClick={() => onSend('a@b.com', 'Custom body text')}
        >
          Send
        </button>
        <button data-testid="EmailModalClose" onClick={onClose}>Close</button>
      </div>
    );
  },
}));
jest.mock('../../../../services/StudentAbsences/StudentAbsenceDailySummaryService');
jest.mock('../../../../services/Synergetic/Lookup/SynLuYearLevelService');
jest.mock('../../../../services/Synergetic/Attendance/SynVStudentAbsenceEventsService');
jest.mock('../../../../services/Synergetic/TimeTable/SynTimetableDefinitionService');
jest.mock('../../../../services/Toaster');

const mockedSummaryService = StudentAbsenceDailySummaryService as jest.Mocked<typeof StudentAbsenceDailySummaryService>;
const mockedYearLevelService = SynLuYearLevelService as jest.Mocked<typeof SynLuYearLevelService>;
const mockedEventsService = SynVStudentAbsenceEventsService as jest.Mocked<typeof SynVStudentAbsenceEventsService>;
const mockedTimetableService = SynTimetableDefinitionService as jest.Mocked<typeof SynTimetableDefinitionService>;
const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

const fakeLiveResult = {
  filters: { yearLevelCode: '', formCode: '', dateRange: { from: '2026-02-03', to: '2026-02-10' } },
  viewerScope: {
    canAccess: true,
    isModuleUser: true,
    isHoy: false,
    isTutor: false,
    allowedYearLevelCodes: [],
    allowedFormCodes: [],
    yearLevelSelectorDisabled: false,
    formSelectorDisabled: false,
    selectedYearLevelCode: '',
    selectedFormCode: '',
    campus: 'Senior Campus' as const,
  },
  schoolBoxAbsoluteUrl: 'https://schoolbox.example.test',
  hasRecords: true,
  rows: [],
};

const fakeEventsResponse = {
  data: [
    {
      AbsenceEventSeq: 1,
      StudentID: 101,
      StudentSurname: 'Lovelace',
      StudentGiven1: 'Ada',
      StudentPreferred: 'Ada',
      StudentMailName: 'Ada Lovelace',
      StudentYearLevel: '10',
      StudentYearLevelDescription: 'Year 10',
      StudentForm: '10A',
      AbsenceEventDate: '2026-02-03',
      AbsenceEventDateTime: '2026-02-03T09:00:00.000Z',
      AbsenceEventPeriodCode: 'DAY',
      AbsenceEventPeriodNumber: null,
      AbsenceEventPeriodDescription: 'All Day',
      AbsenceEventAbsenceTypeDescription: 'Absent',
      AbsenceEventAbsenceReasonDescription: 'Illness',
      AbsenceEventComment: '',
      StudentCampus: 'Senior Campus',
      StudentSubSchool: 'Senior Campus',
    } as any,
  ],
  pages: 1,
  total: 1,
  currentPage: 1,
  perPage: 30,
};

const flushAsyncUpdates = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

const setupWithDates = async () => {
  await act(async () => {
    render(<StudentAbsenceList />);
  });

  await waitFor(() => expect(mockedEventsService.getAll).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled());

  mockedSummaryService.getLiveReport.mockClear();
  mockedEventsService.getAll.mockClear();

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Pick Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pick End' }));
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
  });

  await flushAsyncUpdates();

  await waitFor(() => expect(mockedEventsService.getAll).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled());
};

describe('StudentAbsenceList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/?dateFrom=2026-02-03&dateTo=2026-02-10');
    // Safe default: getLiveReport resolves so the component doesn't crash on mount
    mockedSummaryService.getLiveReport.mockResolvedValue(fakeLiveResult as any);
    mockedYearLevelService.getAllYearLevels.mockResolvedValue([
      {
        Code: '10',
        TimetableGroup: 'S',
      },
    ] as any);
    mockedEventsService.getAll.mockResolvedValue(fakeEventsResponse as any);
    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'S',
          periodNumber: 1,
          dayNumber: 0,
          timeFrom: '08:45',
          timeTo: '09:40',
          description: 'Period 1',
        },
      ],
    } as any);
  });

  test('fetches data with surname-first sort order', async () => {
    await setupWithDates();
    expect(mockedEventsService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: 'AbsenceEventDate:ASC,StudentYearLevelSort:ASC,StudentSurname:ASC,StudentPreferred:ASC',
      })
    );
  });

  test('renders search button', async () => {
    mockedSummaryService.getLiveReport.mockReturnValue(new Promise(() => {}) as any);

    render(<StudentAbsenceList />);
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('Search button is enabled after data loads', async () => {
    await setupWithDates();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled()
    );
  });

  test('renders student names as SURNAME, Preferred (ID)', async () => {
    await setupWithDates();

    expect(screen.getByText('LOVELACE, Ada (101)')).toBeInTheDocument();
  });

  test('renders year level description in the year column', async () => {
    await setupWithDates();

    expect(screen.getByText('Year 10')).toBeInTheDocument();
  });

  test('maps numeric period values through timetable group and period code', async () => {
    mockedEventsService.getAll.mockResolvedValue({
      ...fakeEventsResponse,
      data: [
        {
          ...fakeEventsResponse.data[0],
          StudentYearLevel: '10',
          AbsenceEventPeriodCode: '1',
          AbsenceEventPeriodNumber: 1,
          AbsenceEventPeriodDescription: '1',
        } as any,
      ],
    } as any);

    await setupWithDates();

    expect(screen.getByText('Period 1')).toBeInTheDocument();
    expect(screen.queryByText(/^1$/)).not.toBeInTheDocument();
  });

  test('leaves reason blank when the api reason code is blank', async () => {
    mockedEventsService.getAll.mockResolvedValue({
      ...fakeEventsResponse,
      data: [
        {
          ...fakeEventsResponse.data[0],
          AbsenceEventAbsenceReasonCode: '',
          AbsenceEventAbsenceReasonDescription: 'Not Selected',
        } as any,
      ],
    } as any);

    await setupWithDates();

    expect(screen.queryByText('Not Selected')).not.toBeInTheDocument();
  });

  test('Search button is in loading/disabled state while data is fetching', async () => {
    // Make getLiveReport hang so we can inspect mid-flight state
    let resolveLoad!: (v: any) => void;
    mockedSummaryService.getLiveReport.mockReturnValue(new Promise(res => { resolveLoad = res; }) as any);

    render(<StudentAbsenceList />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Pick Start' }));
      fireEvent.click(screen.getByRole('button', { name: 'Pick End' }));
      fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    });

    expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled();

    await act(async () => {
      resolveLoad(fakeLiveResult);
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled());
  });

  test('all three buttons are disabled while export is in progress', async () => {
    let resolveExport!: (v: any) => void;
    mockedSummaryService.exportReport.mockReturnValue(new Promise(res => { resolveExport = res; }) as any);

    await setupWithDates();

    fireEvent.click(screen.getByRole('button', { name: /Export/i }));

    expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Export/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Email Report/i })).toBeDisabled();

    await act(async () => {
      resolveExport({ downloadUrl: '' });
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByRole('button', { name: /Export/i })).not.toBeDisabled());
  });

  test('all three buttons are disabled while email send is in progress', async () => {
    let resolveEmail!: (v: any) => void;
    mockedSummaryService.emailReport.mockReturnValue(new Promise(res => { resolveEmail = res; }) as any);

    await setupWithDates();
    fireEvent.click(screen.getByRole('button', { name: /Email Report/i }));
    fireEvent.click(screen.getByTestId('EmailModalSend'));

    expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Export/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Email Report/i })).toBeDisabled();

    await act(async () => {
      resolveEmail({});
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled());
  });

  test('clicking Search again with the same filters re-fires the data fetch', async () => {
    await setupWithDates();

    // At this point 1 call was made; click Search again with same filters
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() =>
      expect(mockedEventsService.getAll).toHaveBeenCalledTimes(2)
    );
  });

  test('opens email modal when Email Report button is clicked', async () => {
    await setupWithDates();
    expect(screen.queryByTestId('EmailModal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Email Report/i }));
    expect(screen.getByTestId('EmailModal')).toBeInTheDocument();
  });

  test('calls emailReport with recipientEmails and emailBody when modal sends', async () => {
    mockedSummaryService.emailReport.mockResolvedValue({} as any);
    await setupWithDates();

    fireEvent.click(screen.getByRole('button', { name: /Email Report/i }));
    fireEvent.click(screen.getByTestId('EmailModalSend'));

    await waitFor(() =>
      expect(mockedSummaryService.emailReport).toHaveBeenCalledTimes(1)
    );
    expect(mockedSummaryService.emailReport).toHaveBeenCalledWith(
      expect.objectContaining({ dateRange: { from: '2026-02-03', to: '2026-02-10' } }),
      'a@b.com',
      'Custom body text'
    );
  });

  test('shows success toast and closes modal after successful send', async () => {
    mockedSummaryService.emailReport.mockResolvedValue({} as any);
    await setupWithDates();

    fireEvent.click(screen.getByRole('button', { name: /Email Report/i }));
    fireEvent.click(screen.getByTestId('EmailModalSend'));

    await waitFor(() =>
      expect(mockedToaster.showToast).toHaveBeenCalledWith('Report queued', TOAST_TYPE_SUCCESS)
    );
    expect(screen.queryByTestId('EmailModal')).not.toBeInTheDocument();
  });

  test('shows api error toast when emailReport fails', async () => {
    const fakeError = new Error('Server error');
    mockedSummaryService.emailReport.mockRejectedValue(fakeError);
    await setupWithDates();

    fireEvent.click(screen.getByRole('button', { name: /Email Report/i }));
    fireEvent.click(screen.getByTestId('EmailModalSend'));

    await waitFor(() =>
      expect(mockedToaster.showApiError).toHaveBeenCalledWith(fakeError)
    );
  });
});
