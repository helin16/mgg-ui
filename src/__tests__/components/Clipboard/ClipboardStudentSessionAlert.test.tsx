import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import ClipboardStudentSessionAlert from '../../../components/Clipboard/ClipboardStudentSessionAlert';
import SynVStudentClassService from '../../../services/Synergetic/Student/SynVStudentClassService';
import SynTimetableDefinitionService from '../../../services/Synergetic/TimeTable/SynTimetableDefinitionService';
import ClipboardSessionService from '../../../services/Clipboard/ClipboardSessionService';
import Toaster from '../../../services/Toaster';
import { MAX_PAGE_SIZE } from '../../../services/AppService';

jest.mock('../../../services/Synergetic/Student/SynVStudentClassService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));

jest.mock('../../../services/Synergetic/TimeTable/SynTimetableDefinitionService', () => ({
  __esModule: true,
  default: {
    getCurrentSemesterPeriods: jest.fn(),
  },
}));

jest.mock('../../../services/Clipboard/ClipboardSessionService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));

jest.mock('../../../services/Toaster', () => ({
  __esModule: true,
  default: {
    showApiError: jest.fn(),
  },
}));

const mockedStudentClassService = SynVStudentClassService as jest.Mocked<typeof SynVStudentClassService>;
const mockedTimetableService = SynTimetableDefinitionService as jest.Mocked<typeof SynTimetableDefinitionService>;
const mockedSessionService = ClipboardSessionService as jest.Mocked<typeof ClipboardSessionService>;
const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

describe('ClipboardStudentSessionAlert', () => {
  const currentDate = '2026-05-26';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null when no class code is provided', async () => {
    const { container } = render(
      <ClipboardStudentSessionAlert classCode="" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedStudentClassService.getAll).not.toHaveBeenCalled();
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('returns null when class code is whitespace', async () => {
    const { container } = render(
      <ClipboardStudentSessionAlert classCode="   " currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedStudentClassService.getAll).not.toHaveBeenCalled();
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('returns null when no students are found in class', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedStudentClassService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('returns null when period timing cannot be retrieved', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [{ StudentID: 54610, ClassCode: '7A-ENG' }],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue(null);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedTimetableService.getCurrentSemesterPeriods).toHaveBeenCalledTimes(1);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('returns null when no sessions are found', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [{ StudentID: 54610, ClassCode: '7A-ENG' }],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedSessionService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('renders alert when session overlaps with period', async () => {
    // Period 1: 08:45 - 09:35 on May 26
    // Session from 22:45 UTC May 25 to 23:35 UTC May 25 = 08:45-09:35 May 26 Melbourne

    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: 54610,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Calnan, Gabriella',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: 12345,
          startDateTime: '2026-05-25T22:45:00Z', // 08:45 May 26 Melbourne
          endDateTime: '2026-05-25T23:35:00Z', // 09:35 May 26 Melbourne
          students: [
            {
              smsId: '54610',
              firstName: 'Gabriella',
              lastName: 'Calnan',
            },
          ],
          activity: {
            name: 'Math Tutoring',
          },
          location: 'Room 101',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    expect(await screen.findByText('Calnan, Gabriella is scheduled to have Math Tutoring at Room 101 for current period.')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Calnan, Gabriella' });
    expect(link).toHaveAttribute('href', 'https://go.clipboard.app/schedule/session/12345');

    // Verify session service was called with correct parameters including date filters and perPage
    expect(mockedSessionService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        sisIds: ['54610'],
        startDateTime: expect.any(String),
        endDateTime: expect.any(String),
        cancelled: false,
        includeStatuses: ['confirmed'],
        includeTeams: true,
        includeStaff: true,
        perPage: MAX_PAGE_SIZE,
      })
    );
  });

  test('does not render alert when session does not overlap with period', async () => {
    // Period 1: 08:45 - 09:35 on May 26
    // Session: 10:00 - 11:00 UTC on May 26 = 20:00 - 21:00 Melbourne (after converting)
    // This doesn't overlap with 08:45-09:35

    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: 54610,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Calnan, Gabriella',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: 12345,
          startDateTime: '2026-05-26T10:00:00Z', // 20:00 May 26 Melbourne
          endDateTime: '2026-05-26T11:00:00Z', // 21:00 May 26 Melbourne
          students: [
            {
              smsId: '54610',
              firstName: 'Gabriella',
              lastName: 'Calnan',
            },
          ],
          activity: {
            name: 'Math Tutoring',
          },
          location: 'Room 101',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedSessionService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('renders multiple students with sessions', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: 54610,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Calnan, Gabriella',
        },
        {
          StudentID: 54620,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Smith, Jane',
        },
      ],
      currentPage: 1,
      pageLength: 2,
      numRecords: 2,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: 12345,
          startDateTime: '2026-05-25T22:45:00Z',
          endDateTime: '2026-05-25T23:35:00Z',
          students: [
            {
              smsId: '54610',
              firstName: 'Gabriella',
              lastName: 'Calnan',
            },
            {
              smsId: '54620',
              firstName: 'Jane',
              lastName: 'Smith',
            },
          ],
          activity: {
            name: 'Math Tutoring',
          },
          location: 'Room 101',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    expect(await screen.findByText('Calnan, Gabriella is scheduled to have Math Tutoring')).toBeInTheDocument();
    expect(screen.getByText(/Smith, Jane/)).toBeInTheDocument();
  });

  test('renders multiple sessions for same student', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: 54610,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Calnan, Gabriella',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: 12345,
          startDateTime: '2026-05-25T22:45:00Z',
          endDateTime: '2026-05-25T23:35:00Z',
          students: [
            {
              smsId: '54610',
              firstName: 'Gabriella',
              lastName: 'Calnan',
            },
          ],
          activity: {
            name: 'Math Tutoring',
          },
          location: 'Room 101',
        },
        {
          id: 12346,
          startDateTime: '2026-05-25T22:45:00Z',
          endDateTime: '2026-05-25T23:35:00Z',
          students: [
            {
              smsId: '54610',
              firstName: 'Gabriella',
              lastName: 'Calnan',
            },
          ],
          activity: {
            name: 'English Tutoring',
          },
          location: 'Room 102',
        },
      ],
      currentPage: 1,
      pageLength: 2,
      numRecords: 2,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    expect(await screen.findByText('Calnan, Gabriella is scheduled to have Math Tutoring')).toBeInTheDocument();
    expect(screen.getByText('Calnan, Gabriella is scheduled to have English Tutoring')).toBeInTheDocument();
  });

  test('handles error from student service', async () => {
    const error = new Error('API Error');
    mockedStudentClassService.getAll.mockRejectedValue(error);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedToaster.showApiError).toHaveBeenCalledWith(error);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('handles error from timetable service', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [{ StudentID: 54610, ClassCode: '7A-ENG' }],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    const error = new Error('Timetable API Error');
    mockedTimetableService.getCurrentSemesterPeriods.mockRejectedValue(error);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedToaster.showApiError).toHaveBeenCalledWith(error);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('handles error from session service', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [{ StudentID: 54610, ClassCode: '7A-ENG' }],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    const error = new Error('Session API Error');
    mockedSessionService.getAll.mockRejectedValue(error);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedToaster.showApiError).toHaveBeenCalledWith(error);
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('uses custom className when provided', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    const { container } = render(
      <ClipboardStudentSessionAlert
        classCode="7A-ENG"
        currentDate={currentDate}
        periodNumber={1}
        className="custom-alert"
      />
    );

    // Component returns null for empty data, so just verify it doesn't error
    expect(container).toBeEmptyDOMElement();
  });

  test('filters sessions by activityIds when provided', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [{ StudentID: 54610, ClassCode: '7A-ENG' }],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert
        classCode="7A-ENG"
        currentDate={currentDate}
        periodNumber={1}
        activityIds={[123, 456]}
      />
    );

    await waitFor(() => {
      expect(mockedSessionService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          activityIds: [123, 456],
          startDateTime: expect.any(String),
          endDateTime: expect.any(String),
          cancelled: false,
          includeStatuses: ['confirmed'],
          includeTeams: true,
          includeStaff: true,
          perPage: MAX_PAGE_SIZE,
        })
      );
    });
  });

  test('handles undefined session students gracefully', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: 54610,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Calnan, Gabriella',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedTimetableService.getCurrentSemesterPeriods.mockResolvedValue({
      currentSemester: { fileYear: 2026, fileSemester: 1 },
      periods: [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: 12345,
          startDateTime: '2026-05-25T22:45:00Z',
          endDateTime: '2026-05-25T23:35:00Z',
          // Missing students property
          activity: {
            name: 'Math Tutoring',
          },
          location: 'Room 101',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    const { container } = render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedSessionService.getAll).toHaveBeenCalledTimes(1);
    });

    // Should handle gracefully and not render alert
    expect(container).toBeEmptyDOMElement();
  });
});
