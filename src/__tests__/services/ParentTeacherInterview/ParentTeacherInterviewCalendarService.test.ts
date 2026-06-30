import AppService from '../../../services/AppService';
import ParentTeacherInterviewCalendarService from '../../../services/ParentTeacherInterview/ParentTeacherInterviewCalendarService';
import iParentTeacherInterviewCalendarEventsResponse from '../../../types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventsResponse';
import iParentTeacherInterviewCreateCalendarEventResponse from '../../../types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventResponse';

jest.mock('../../../services/AppService');

describe('ParentTeacherInterviewCalendarService', () => {
  const mockEventsResponse: iParentTeacherInterviewCalendarEventsResponse = {
    staffId: 1001,
    staffOccupEmail: 'teacher@example.com',
    startDateTime: '2026-06-29T09:00:00+10:00',
    endDateTime: '2026-06-29T10:00:00+10:00',
    events: [
      {
        id: 'evt-1',
        subject: 'Existing PTI',
        startDateTime: '2026-06-29T09:30:00+10:00',
        endDateTime: '2026-06-29T09:45:00+10:00',
        organizer: {
          name: 'Teacher One',
          address: 'teacher@example.com',
        },
        isOnlineMeeting: true,
        teamsJoinUrl: 'https://teams.example.com/join',
      },
    ],
  };

  const mockCreateResponse: iParentTeacherInterviewCreateCalendarEventResponse = {
    staffId: 1001,
    staffOccupEmail: 'teacher@example.com',
    outcome: 'CREATED',
    auditMessageId: 'audit-1',
    event: mockEventsResponse.events[0],
    message: 'Created successfully',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('passes retrieval query params through AppService.get', async () => {
    (AppService.get as jest.Mock).mockResolvedValue({data: mockEventsResponse});

    const result = await ParentTeacherInterviewCalendarService.getCalendarEvents({
      staffId: 1001,
      startDateTime: '2026-06-29T09:00:00+10:00',
      endDateTime: '2026-06-29T10:00:00+10:00',
    });

    expect(AppService.get).toHaveBeenCalledWith(
      '/parentTeacherInterview/calendarEvents',
      {
        staffId: 1001,
        startDateTime: '2026-06-29T09:00:00+10:00',
        endDateTime: '2026-06-29T10:00:00+10:00',
      },
      undefined
    );
    expect(result).toEqual(mockEventsResponse);
  });

  test('passes create request body through AppService.post', async () => {
    (AppService.post as jest.Mock).mockResolvedValue({data: mockCreateResponse});

    const payload = {
      staffId: 1001,
      subject: 'PTI Subject',
      bodyText: 'PTI Body',
      startDateTime: '2026-06-29T09:00:00+10:00',
      endDateTime: '2026-06-29T10:00:00+10:00',
    };

    const result = await ParentTeacherInterviewCalendarService.createCalendarEvent(payload);

    expect(AppService.post).toHaveBeenCalledWith(
      '/parentTeacherInterview/calendarEvents',
      payload,
      undefined
    );
    expect(result).toEqual(mockCreateResponse);
  });

  test('returns EXISTS and FAILED outcomes without extra transformation', async () => {
    const existsResponse: iParentTeacherInterviewCreateCalendarEventResponse = {
      ...mockCreateResponse,
      outcome: 'EXISTS',
      message: 'Already exists',
    };
    const failedResponse: iParentTeacherInterviewCreateCalendarEventResponse = {
      ...mockCreateResponse,
      outcome: 'FAILED',
      event: null,
      failureCategory: 'VALIDATION',
      message: 'Validation failed',
    };

    (AppService.post as jest.Mock)
      .mockResolvedValueOnce({data: existsResponse})
      .mockResolvedValueOnce({data: failedResponse});

    await expect(
      ParentTeacherInterviewCalendarService.createCalendarEvent({
        staffId: 1001,
        subject: 'PTI Subject',
        bodyText: 'PTI Body',
        startDateTime: '2026-06-29T09:00:00+10:00',
        endDateTime: '2026-06-29T10:00:00+10:00',
      })
    ).resolves.toEqual(existsResponse);

    await expect(
      ParentTeacherInterviewCalendarService.createCalendarEvent({
        staffId: 1001,
        subject: 'PTI Subject',
        bodyText: 'PTI Body',
        startDateTime: '2026-06-29T09:00:00+10:00',
        endDateTime: '2026-06-29T10:00:00+10:00',
      })
    ).resolves.toEqual(failedResponse);
  });
});
