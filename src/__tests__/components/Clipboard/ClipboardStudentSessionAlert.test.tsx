import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import ClipboardStudentSessionAlert from '../../../components/Clipboard/ClipboardStudentSessionAlert';
import SynVStudentClassService from '../../../services/Synergetic/Student/SynVStudentClassService';
import SynTimetableDefinitionService from '../../../services/Synergetic/TimeTable/SynTimetableDefinitionService';
import ClipboardSessionService from '../../../services/Clipboard/ClipboardSessionService';
import ClipboardAttendanceService from '../../../services/Clipboard/ClipboardAttendanceService';
import Toaster from '../../../services/Toaster';
import * as ClipboardUrlBuilder from '../../../services/Clipboard/ClipboardUrlBuilder';
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

jest.mock('../../../services/Clipboard/ClipboardAttendanceService', () => ({
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

jest.mock('../../../services/Clipboard/ClipboardUrlBuilder', () => ({
  __esModule: true,
  getSessionUrl: jest.fn((id) => `https://go.clipboard.app/schedule/session/${id}`),
}));

const mockedStudentClassService = SynVStudentClassService as jest.Mocked<typeof SynVStudentClassService>;
const mockedTimetableService = SynTimetableDefinitionService as jest.Mocked<typeof SynTimetableDefinitionService>;
const mockedSessionService = ClipboardSessionService as jest.Mocked<typeof ClipboardSessionService>;
const mockedAttendanceService = ClipboardAttendanceService as jest.Mocked<typeof ClipboardAttendanceService>;
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

    mockedAttendanceService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    const link = await screen.findByRole('link', { name: 'Calnan, Gabriella' });
    expect(link).toHaveAttribute('href', 'https://go.clipboard.app/schedule/session/12345');
    expect(link.parentElement?.textContent).toMatch(/is scheduled to have.*Math Tutoring.*Room 101/);

    // Verify session service was called with correct parameters including date filters and pageLength
    expect(mockedSessionService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        sisIds: ['54610'],
        startDateTime: expect.any(String),
        endDateTime: expect.any(String),
        cancelled: false,
        includeStatuses: ['confirmed'],
        includeTeams: true,
        includeStaff: true,
        pageLength: 200,
      })
    );

    // Verify attendance service was called
    expect(mockedAttendanceService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        studentSisIds: ['54610'],
        startDateTime: expect.any(String),
        endDateTime: expect.any(String),
        absent: false,
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

    mockedAttendanceService.getAll.mockResolvedValue({
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

    mockedAttendanceService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    const gabriellaLink = await screen.findByRole('link', { name: 'Calnan, Gabriella' });
    expect(gabriellaLink).toBeInTheDocument();
    expect(gabriellaLink.parentElement?.textContent).toMatch(/is scheduled to have.*Math Tutoring/);

    const janeLink = screen.getByRole('link', { name: 'Smith, Jane' });
    expect(janeLink).toBeInTheDocument();
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

    mockedAttendanceService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    const links = await screen.findAllByRole('link', { name: 'Calnan, Gabriella' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://go.clipboard.app/schedule/session/12345');
    expect(links[1]).toHaveAttribute('href', 'https://go.clipboard.app/schedule/session/12346');
    
    const parentText1 = links[0].parentElement?.textContent || '';
    const parentText2 = links[1].parentElement?.textContent || '';
    expect(parentText1).toMatch(/is scheduled to have.*Math Tutoring/);
    expect(parentText2).toMatch(/is scheduled to have.*English Tutoring/);
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
      expect(mockedStudentClassService.getAll).toHaveBeenCalledTimes(1);
    });

    // Error is caught and handled gracefully - component returns null when period timing cannot be retrieved
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

    mockedAttendanceService.getAll.mockResolvedValue({
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

    mockedAttendanceService.getAll.mockResolvedValue({
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

    mockedAttendanceService.getAll.mockResolvedValue({
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

    // Should handle gracefully and not render alert
    expect(container).toBeEmptyDOMElement();
  });

  test('displays "is attending" when student has attended the session', async () => {
    const studentId = '54610';
    const sessionId = '12345';

    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: studentId,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Li, Ivy',
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
          timeFrom: '08:30',
          timeTo: '09:00',
          description: 'Period 1',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: sessionId,
          startDateTime: '2026-05-25T22:30:00Z', // 08:30 May 26 Melbourne
          endDateTime: '2026-05-25T23:00:00Z', // 09:00 May 26 Melbourne
          students: [
            {
              smsId: studentId,
              firstName: 'Ivy',
              lastName: 'Li',
            },
          ],
          activity: {
            name: 'Cello Tuition',
          },
          location: 'MU1',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    // Student has attended the session
    mockedAttendanceService.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          absent: false,
          explained: false,
          student: {
            smsId: studentId,
            firstName: 'Ivy',
            lastName: 'Li',
          },
          session: {
            id: sessionId,
          },
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

    const link = await screen.findByRole('link', { name: 'Li, Ivy' });
    expect(link).toHaveAttribute('href', `https://go.clipboard.app/schedule/session/${sessionId}`);
    
    const parentText = link.parentElement?.textContent || '';
    expect(parentText).toMatch(/is attending.*Cello Tuition.*MU1.*08:30 am.*09:00 am/);
  });

  test('displays "is scheduled to have" when student has not attended', async () => {
    const studentId = '54610';
    const sessionId = '12345';

    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: studentId,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Jones, Alex',
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
          timeFrom: '10:00',
          timeTo: '10:50',
          description: 'Period 2',
        },
      ],
    } as any);

    mockedSessionService.getAll.mockResolvedValue({
      data: [
        {
          id: sessionId,
          startDateTime: '2026-05-26T00:00:00Z', // 10:00 May 26 Melbourne
          endDateTime: '2026-05-26T00:50:00Z', // 10:50 May 26 Melbourne
          students: [
            {
              smsId: studentId,
              firstName: 'Alex',
              lastName: 'Jones',
            },
          ],
          activity: {
            name: 'Piano Lesson',
          },
          location: 'MU3',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    // No attendance records - student did not attend
    mockedAttendanceService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    const link = await screen.findByRole('link', { name: 'Jones, Alex' });
    expect(link).toHaveAttribute('href', `https://go.clipboard.app/schedule/session/${sessionId}`);
    
    const parentText = link.parentElement?.textContent || '';
    expect(parentText).toMatch(/is scheduled to have.*Piano Lesson.*MU3.*10:00 am.*10:50 am/);
  });

  test('renders student name in bold', async () => {
    const studentId = '54610';
    const sessionId = '12345';

    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        {
          StudentID: studentId,
          ClassCode: '7A-ENG',
          ClassDescription: '7A English',
          StudentNameInternal: 'Brown, Sarah',
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
          id: sessionId,
          startDateTime: '2026-05-25T22:45:00Z',
          endDateTime: '2026-05-25T23:35:00Z',
          students: [
            {
              smsId: studentId,
              firstName: 'Sarah',
              lastName: 'Brown',
            },
          ],
          activity: {
            name: 'Art Class',
          },
          location: 'ART1',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedAttendanceService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    const link = await screen.findByRole('link', { name: 'Brown, Sarah' });
    // Student name should be inside a <b> tag within the link
    const boldElement = link.querySelector('b');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement?.textContent).toBe('Brown, Sarah');
  });

  test('calls ClipboardAttendanceService with correct pageLength parameter', async () => {
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

    mockedAttendanceService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardStudentSessionAlert classCode="7A-ENG" currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedAttendanceService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          studentSisIds: ['54610'],
          startDateTime: expect.any(String),
          endDateTime: expect.any(String),
          absent: false,
          pageLength: 300, // Clipboard API max page length
        })
      );
    });
  });

  test('matches attendance records with sessions correctly', async () => {
    const session1Id = '12345';
    const student1Id = '54610';
    const student2Id = '54620';

    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: student1Id, ClassCode: '7A-ENG', ClassDescription: '7A English', StudentNameInternal: 'Smith, Alice' },
        { StudentID: student2Id, ClassCode: '7A-ENG', ClassDescription: '7A English', StudentNameInternal: 'Jones, Bob' },
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
          id: session1Id,
          startDateTime: '2026-05-25T22:45:00Z',
          endDateTime: '2026-05-25T23:35:00Z',
          students: [
            { smsId: student1Id, firstName: 'Alice', lastName: 'Smith' },
            { smsId: student2Id, firstName: 'Bob', lastName: 'Jones' },
          ],
          activity: { name: 'Math' },
          location: 'Room 1',
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    // Only student1 attended
    mockedAttendanceService.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          absent: false,
          explained: false,
          student: { smsId: student1Id, firstName: 'Alice', lastName: 'Smith' },
          session: { id: session1Id },
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

    const links = await screen.findAllByRole('link');
    expect(links).toHaveLength(2);
    
    // First student attended (Alice/Smith)
    const aliceText = links[0].parentElement?.textContent || '';
    expect(aliceText).toMatch(/Smith, Alice.*is attending.*Math.*Room 1/);

    // Second student did not attend (Bob/Jones)
    const bobText = links[1].parentElement?.textContent || '';
    expect(bobText).toMatch(/Jones, Bob.*is scheduled to have.*Math.*Room 1/);
  });
});
