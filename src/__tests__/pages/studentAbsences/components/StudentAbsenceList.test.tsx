import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StudentAbsenceList from '../../../../pages/studentAbsences/components/StudentAbsenceList';
import StudentAbsenceDailySummaryService from '../../../../services/StudentAbsences/StudentAbsenceDailySummaryService';
import SynVStudentAbsenceEventsService from '../../../../services/Synergetic/Attendance/SynVStudentAbsenceEventsService';
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
jest.mock('../../../../services/Synergetic/Attendance/SynVStudentAbsenceEventsService');
jest.mock('../../../../services/Toaster');

const mockedSummaryService = StudentAbsenceDailySummaryService as jest.Mocked<typeof StudentAbsenceDailySummaryService>;
const mockedEventsService = SynVStudentAbsenceEventsService as jest.Mocked<typeof SynVStudentAbsenceEventsService>;
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
      StudentForm: '10A',
      AbsenceEventDate: '2026-02-03',
      AbsenceEventDateTime: '2026-02-03T09:00:00.000Z',
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

const setupWithDates = async () => {
  render(<StudentAbsenceList />);

  // Trigger start + end date selection via the DateRangeSelector mock
  fireEvent.click(screen.getByRole('button', { name: 'Pick Start' }));
  fireEvent.click(screen.getByRole('button', { name: 'Pick End' }));
  fireEvent.click(screen.getByRole('button', { name: /Search/i }));

  await waitFor(() => expect(mockedEventsService.getAll).toHaveBeenCalledTimes(1));
  // Wait for loading to fully clear so buttons are no longer disabled
  await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled());
};

describe('StudentAbsenceList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/');
    // Safe default: getLiveReport resolves so the component doesn't crash on mount
    mockedSummaryService.getLiveReport.mockResolvedValue(fakeLiveResult as any);
    mockedEventsService.getAll.mockResolvedValue(fakeEventsResponse as any);
  });

  test('fetches data with sort AbsenceEventDate:ASC,StudentYearLevelSort:ASC,StudentID:ASC', async () => {
    await setupWithDates();
    expect(mockedEventsService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: 'AbsenceEventDate:ASC,StudentYearLevelSort:ASC,StudentID:ASC',
      })
    );
  });

  test('renders search button', () => {
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

  test('Search button is in loading/disabled state while data is fetching', async () => {
    // Make getLiveReport hang so we can inspect mid-flight state
    let resolveLoad!: (v: any) => void;
    mockedSummaryService.getLiveReport.mockReturnValue(new Promise(res => { resolveLoad = res; }) as any);

    render(<StudentAbsenceList />);
    fireEvent.click(screen.getByRole('button', { name: 'Pick Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pick End' }));
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    // While still loading the Search button should be disabled
    expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled();

    // Unblock and wait for idle
    resolveLoad(fakeLiveResult);
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

    resolveExport({ downloadUrl: '' });
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

    resolveEmail({});
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
