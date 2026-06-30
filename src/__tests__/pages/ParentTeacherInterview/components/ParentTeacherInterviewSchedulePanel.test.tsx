import React from 'react';
import {useSelector} from 'react-redux';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ParentTeacherInterviewSchedulePanel, {
  getRowValidationMessage,
  isCreateEligible,
} from '../../../../pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';

jest.mock('../../../../services/Toaster', () => ({
  __esModule: true,
  TOAST_TYPE_SUCCESS: 'success',
  TOAST_TYPE_ERROR: 'error',
  default: {
    showToast: jest.fn(),
    showApiError: jest.fn(),
  },
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const baseRows = [
  {
    staffId: 1001,
    staffName: 'Ada Lovelace',
    staffCode: 'AL',
    staffEmail: 'ada@example.com',
    isAllDay: false,
    startDateTime: '2026-07-01T09:00',
    endDateTime: '2026-07-01T10:00',
    retrievalStatus: 'READY',
    retrievalMessage: null,
    retrievalRangeKey: 'timed|2026-07-01T09:00|2026-07-01T10:00',
    events: [
      {
        id: 'evt-1',
        subject: 'Existing meeting',
        startDateTime: '2026-07-01T09:15:00+10:00',
        endDateTime: '2026-07-01T09:45:00+10:00',
        organizer: {name: 'Ada Lovelace', address: 'ada@example.com'},
        isOnlineMeeting: true,
        isAllDay: false,
        teamsJoinUrl: 'https://teams.example.com/1',
      },
    ],
    createStatus: 'IDLE',
    createMessage: null,
    createResult: null,
  },
] as any[];

describe('ParentTeacherInterviewSchedulePanel', () => {
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;
  const mockedUseSelector = useSelector as jest.Mock;
  const createObjectURL = jest.fn(() => 'blob:test-url');
  const revokeObjectURL = jest.fn();

  beforeEach(() => {
    mockedUseSelector.mockImplementation((selector: any) => selector({
      auth: {
        user: {
          synergyId: 12345,
        },
      },
    }));
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    Object.assign(window.URL, {
      createObjectURL,
      revokeObjectURL,
    });
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
  });

  test('shows validation state and row editing handlers', () => {
    const onDateTimeChange = jest.fn();
    const onAllDayChange = jest.fn();

    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            endDateTime: '2026-07-01T08:00',
            retrievalStatus: 'IDLE',
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={onAllDayChange}
        onDateTimeChange={onDateTimeChange}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Interview Time')).toBeInTheDocument();
    expect(screen.getByText('End datetime must be later than or equal to start datetime.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Starting datetime for Ada Lovelace'), {target: {value: '2026-07-01T09:30'}});
    expect(onDateTimeChange).toHaveBeenCalledWith(1001, 'startDateTime', '2026-07-01T09:30');
    fireEvent.click(screen.getByLabelText('All Day'));
    expect(onAllDayChange).toHaveBeenCalledWith(1001, true);
  });

  test('renders existing events and supports retrieval retry', () => {
    const onRetryRetrieval = jest.fn();

    const {rerender} = render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={baseRows}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={onRetryRetrieval}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Existing Events')).toBeInTheDocument();
    expect(screen.getByText('Existing meeting')).toBeInTheDocument();
    expect(screen.getByText('01/07/2026 09:15 - 09:45')).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'Meeting link'})).not.toBeInTheDocument();

    rerender(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[{...baseRows[0], retrievalStatus: 'FAILED', retrievalMessage: 'Boom', events: []}]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={onRetryRetrieval}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Retry retrieval'}));
    expect(onRetryRetrieval).toHaveBeenCalledWith(1001);
  });

  test('gates create for non-admin users and missing settings', () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={false}
        isSubmitting={false}
        missingSettingsMessage={'Missing settings'}
        rows={baseRows}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('You can review existing events, but only module admins can create event links.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Create link(s) for 1 staff'})).toBeDisabled();
  });

  test('switches to meeting columns after a successful create', () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            createStatus: 'CREATED',
            createMessage: 'Created successfully',
            createResult: {
              event: {
                subject: 'PTI Subject',
                startDateTime: '2026-07-01T09:00:00+10:00',
                endDateTime: '2026-07-01T10:00:00+10:00',
                teamsJoinUrl: 'https://teams.example.com/created',
              },
            },
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByText('Interview Time')).not.toBeInTheDocument();
    expect(screen.getByText('Staff Email')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Existing Events')[0]).toBeInTheDocument();
    expect(screen.getByText('Interview Meeting')).toBeInTheDocument();
    expect(screen.getByText('PTI Subject')).toBeInTheDocument();
    expect(screen.getByText('01/07/2026 09:15 - 09:45')).toBeInTheDocument();
    expect(screen.queryByText('Created successfully')).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Link'})).toHaveAttribute(
      'href',
      'https://teams.example.com/created'
    );
    expect(screen.getByRole('button', {name: 'Export interview meetings'})).toBeInTheDocument();
  });

  test('copies created meeting link to clipboard', async () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            createStatus: 'CREATED',
            createMessage: 'Created successfully',
            createResult: {
              event: {
                subject: 'PTI Subject',
                startDateTime: '2026-07-01T09:00:00+10:00',
                endDateTime: '2026-07-01T10:00:00+10:00',
                teamsJoinUrl: 'https://teams.example.com/created',
              },
            },
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Copy link'}));

    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://teams.example.com/created'));
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Link copied successfully', TOAST_TYPE_SUCCESS);
  });

  test('exports created meeting rows to csv from the interview meeting header', () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            createStatus: 'CREATED',
            createResult: {
              event: {
                subject: 'PTI Subject',
                startDateTime: '2026-07-01T09:00:00+10:00',
                endDateTime: '2026-07-01T10:00:00+10:00',
                teamsJoinUrl: 'https://teams.example.com/created',
              },
            },
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    fireEvent.click(screen.getByRole('button', {name: 'Export interview meetings'}));

    expect(createObjectURL).toHaveBeenCalled();
    const blobArg = createObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();

    click.mockRestore();
  });

  test('confirms create event submission before calling submit', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={baseRows}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Create link(s) for 1 staff'}));
    fireEvent.change(screen.getByPlaceholderText('12345'), {target: {value: '12345'}});
    fireEvent.click(screen.getByRole('button', {name: 'Create event links'}));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  test('shows failed create message and retry action in the meeting url cell', () => {
    const onRetryCreate = jest.fn();

    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            createStatus: 'FAILED',
            createMessage: 'Microsoft Graph create failed.',
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={onRetryCreate}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Interview Meeting')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Graph create failed.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    expect(onRetryCreate).toHaveBeenCalledWith(1001);
  });

  test('shows existing-event create message at the top of the interview meeting cell', () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            createStatus: 'EXISTS',
            createMessage: 'Matching event already exists.',
            createResult: {
              event: {
                subject: 'PTI Subject',
                startDateTime: '2026-07-01T09:00:00+10:00',
                endDateTime: '2026-07-01T10:00:00+10:00',
                isAllDay: false,
                teamsJoinUrl: 'https://teams.example.com/existing-created',
              },
            },
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const meetingCellText = screen.getByText('Matching event already exists.').closest('td')?.textContent || '';
    expect(meetingCellText).toMatch(/^Matching event already exists\./);
    expect(screen.getAllByText('Matching event already exists.')).toHaveLength(1);
  });

  test('formats all-day events in existing events and interview meeting', () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            isAllDay: true,
            startDateTime: '2026-07-01',
            endDateTime: '2026-07-01',
            retrievalRangeKey: 'allDay|2026-07-01|2026-07-01',
            events: [
              {
                id: 'evt-2',
                subject: 'Existing all day',
                startDateTime: '2026-07-01T00:00:00+10:00',
                endDateTime: '2026-07-02T00:00:00+10:00',
                organizer: {name: 'Ada Lovelace', address: 'ada@example.com'},
                isAllDay: true,
                isOnlineMeeting: true,
                teamsJoinUrl: 'https://teams.example.com/allday-existing',
              },
            ],
            createStatus: 'CREATED',
            createResult: {
              event: {
                subject: 'PTI All Day',
                startDateTime: '2026-07-01T00:00:00+10:00',
                endDateTime: '2026-07-02T00:00:00+10:00',
                isAllDay: true,
                teamsJoinUrl: 'https://teams.example.com/allday-created',
              },
            },
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getAllByText('01/07/2026 All Day')).toHaveLength(2);
    expect(screen.getByText('PTI All Day')).toBeInTheDocument();
  });

  test('formats cross-day timed events with both dates', () => {
    render(
      <ParentTeacherInterviewSchedulePanel
        isAdmin={true}
        isSubmitting={false}
        missingSettingsMessage={null}
        rows={[
          {
            ...baseRows[0],
            createStatus: 'CREATED',
            createResult: {
              event: {
                subject: 'Overnight Event',
                startDateTime: '2026-07-02T14:00:00+10:00',
                endDateTime: '2026-07-03T14:30:00+10:00',
                isAllDay: false,
                teamsJoinUrl: 'https://teams.example.com/overnight',
              },
            },
          },
        ]}
        onBack={jest.fn()}
        onAllDayChange={jest.fn()}
        onDateTimeChange={jest.fn()}
        onRetryRetrieval={jest.fn()}
        onRetryCreate={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('02/07/2026 14:00 - 03/07/2026 14:30')).toBeInTheDocument();
  });

  test('exports validation helpers for create eligibility', () => {
    expect(getRowValidationMessage({...baseRows[0], endDateTime: '2026-07-01T08:00'} as any)).toBe(
      'End datetime must be later than or equal to start datetime.'
    );
    expect(getRowValidationMessage({
      ...baseRows[0],
      isAllDay: true,
      startDateTime: '2026-07-01',
      endDateTime: '2026-06-30',
    } as any)).toBe('End date must be the same as or later than start date.');
    expect(isCreateEligible(baseRows[0] as any)).toBe(true);
    expect(isCreateEligible({...baseRows[0], createStatus: 'CREATED'} as any)).toBe(false);
  });
});
