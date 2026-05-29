import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import moment from 'moment-timezone';
import ClipboardConcussionAlert from '../../../components/Clipboard/ClipboardConcussionAlert';
import SynVStudentClassService from '../../../services/Synergetic/Student/SynVStudentClassService';
import ClipboardIncidentService from '../../../services/Clipboard/ClipboardIncidentService';

jest.mock('../../../services/Synergetic/Student/SynVStudentClassService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));

jest.mock('../../../services/Clipboard/ClipboardIncidentService', () => ({
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
const mockedClipboardIncidentService = ClipboardIncidentService as jest.Mocked<typeof ClipboardIncidentService>;

describe('ClipboardConcussionAlert', () => {
  const currentDate = '2026-05-25';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null when no active confirmed concussions are found', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    const {container} = render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={currentDate} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedStudentClassService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(mockedStudentClassService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: JSON.stringify({
          ClassCode: '7A-ENG',
          CurrentSemesterOnlyFlag: true,
        }),
      }),
      expect.any(Object)
    );

    expect(mockedClipboardIncidentService.getAll).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });

  test('queries incidents for the last 21 days', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: 54610, ClassCode: '7A-ENG', FileYear: 2026, FileSemester: 1 },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedClipboardIncidentService.getAll.mockResolvedValue({
      data: [],
      currentPage: 1,
      pageLength: 1,
      numRecords: 0,
      lastPage: 1,
    } as any);

    render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={currentDate} periodNumber={1} />
    );

    const startDateTime = moment(currentDate).subtract(21, 'days').startOf('day').toISOString();
    const endDateTime = moment(currentDate).endOf('day').toISOString();

    await waitFor(() => {
      expect(mockedClipboardIncidentService.getAll).toHaveBeenCalledWith({
        sisIds: ['54610'],
        concussionStatuses: ['confirmed'],
        startDateTime,
        endDateTime,
      });
    });
  });

  test('renders an alert for active confirmed concussion incidents', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: 54610, ClassCode: '7A-ENG', FileYear: 2026, FileSemester: 1 },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedClipboardIncidentService.getAll.mockResolvedValue({
      data: [
        {
          id: 45858,
          studentConcerned: { id: 54610, firstName: 'Gabriella', legalFirstName: null, lastName: 'Calnan', smsId: '54610' },
          staff: { id: 111, firstName: 'Charlotte', lastName: 'Ryan' },
          dateTime: '2026-05-11T10:00:00Z',
          returnToPlay: {
            date: '2026-05-28T00:00:00Z',
          },
          concussionStatus: 'confirmed',
          archived: false,
          Diagnosis: 'Concussion',
          IncidentTypeDescription: 'Concussion',
          RestrictedEndDate: '2026-05-28T00:00:00Z',
          ReviewDate: null,
          Comments: null,
          IncidentDescription: null,
          location: null,
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={currentDate} periodNumber={1} />
    );

    const returnToPlayMoment = moment.utc('2026-05-28T00:00:00Z').local();
    const expectedReturnToPlayDate = returnToPlayMoment.format('ddd Do MMMM YYYY');

    const startDateTime = moment(currentDate).subtract(21, 'days').startOf('day').toISOString();
    const endDateTime = moment(currentDate).endOf('day').toISOString();

    const studentLink = await screen.findByRole('link', {name: 'Gabriella Calnan'});
    expect(studentLink.closest('div')).toHaveTextContent(
      `Gabriella Calnan should not return to play until ${expectedReturnToPlayDate} due to "Concussion".`
    );
    expect(studentLink).toHaveAttribute(
      'href',
      'https://go.clipboard.app/incidents/45858'
    );
    expect(mockedStudentClassService.getAll).toHaveBeenCalledTimes(1);
    expect(mockedStudentClassService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: JSON.stringify({
          ClassCode: '7A-ENG',
          CurrentSemesterOnlyFlag: true,
        }),
      }),
      expect.any(Object)
    );
    expect(mockedClipboardIncidentService.getAll).toHaveBeenCalledWith({
      sisIds: ['54610'],
      concussionStatuses: ['confirmed'],
      startDateTime,
      endDateTime,
    });
  });

  test('renders alert without an until date when returnToPlay is missing', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: 54610, ClassCode: '7A-ENG' },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedClipboardIncidentService.getAll.mockResolvedValue({
      data: [
        {
          id: 45859,
          studentConcerned: { id: 54610, firstName: 'Gabriella', legalFirstName: null, lastName: 'Calnan', smsId: '54610' },
          staffMember: { id: 222, firstName: 'Brooke', lastName: 'Beekman' },
          dateTime: '2026-05-10T10:00:00Z',
          concussionStatus: 'confirmed',
          archived: false,
          Diagnosis: 'Concussion',
          IncidentTypeDescription: 'Concussion',
          RestrictedEndDate: null,
          ReviewDate: null,
          Comments: null,
          IncidentDescription: null,
          location: null,
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={'2026-05-25'} periodNumber={1} />
    );

    const startDateTime = moment('2026-05-25').subtract(21, 'days').startOf('day').toISOString();
    const endDateTime = moment('2026-05-25').endOf('day').toISOString();

    const studentLink = await screen.findByRole('link', {name: 'Gabriella Calnan'});
    expect(studentLink.closest('div')).toHaveTextContent(
      'Gabriella Calnan should not return to play due to "Concussion".'
    );
    expect(studentLink).toHaveAttribute(
      'href',
      'https://go.clipboard.app/incidents/45859'
    );
    expect(mockedClipboardIncidentService.getAll).toHaveBeenCalledWith({
      sisIds: ['54610'],
      concussionStatuses: ['confirmed'],
      startDateTime,
      endDateTime,
    });
  });

  test('uses returnToPlay.date for the displayed until date', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: 54610, ClassCode: '7A-ENG' },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedClipboardIncidentService.getAll.mockResolvedValue({
      data: [
        {
          id: 45858,
          studentConcerned: { id: 54610, firstName: 'Brooke', legalFirstName: null, lastName: 'Beekman', smsId: '54610' },
          staffMember: { id: 222, firstName: 'Charlotte', lastName: 'Ryan' },
          dateTime: '2026-05-10T18:24:00Z',
          returnToPlay: {
            date: '2026-06-01T14:00:00Z',
          },
          concussionStatus: 'confirmed',
          archived: false,
          Diagnosis: 'Concussion',
          IncidentTypeDescription: 'Concussion',
          RestrictedEndDate: null,
          ReviewDate: null,
          Comments: null,
          IncidentDescription: null,
          location: null,
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={'2026-06-01'} periodNumber={1} />
    );

    const returnToPlayMoment = moment.utc('2026-06-01T14:00:00Z').local();
    const expectedReturnToPlayDate = returnToPlayMoment.format('ddd Do MMMM YYYY');

    const studentLink = await screen.findByRole('link', {name: 'Brooke Beekman'});
    expect(studentLink.closest('div')).toHaveTextContent(
      `Brooke Beekman should not return to play until ${expectedReturnToPlayDate} due to "Concussion".`
    );
  });

  test('appends returnToPlay.reason after the diagnosis when provided', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: 54610, ClassCode: '7A-ENG' },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedClipboardIncidentService.getAll.mockResolvedValue({
      data: [
        {
          id: 45860,
          studentConcerned: { id: 54610, firstName: 'Brooke', legalFirstName: null, lastName: 'Beekman', smsId: '54610' },
          dateTime: '2026-05-10T18:24:00Z',
          returnToPlay: {
            date: '2026-06-01T14:00:00Z',
            reason: 'Potential concussion',
          },
          concussionStatus: 'confirmed',
          archived: false,
          Diagnosis: 'Concussion',
          IncidentTypeDescription: 'Concussion',
          RestrictedEndDate: null,
          ReviewDate: null,
          Comments: null,
          IncidentDescription: null,
          location: null,
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={'2026-06-01'} periodNumber={1} />
    );

    const returnToPlayMoment = moment.utc('2026-06-01T14:00:00Z').local();
    const expectedReturnToPlayDate = returnToPlayMoment.format('ddd Do MMMM YYYY');

    const studentLink = await screen.findByRole('link', {name: 'Brooke Beekman'});
    expect(studentLink.closest('div')).toHaveTextContent(
      `Brooke Beekman should not return to play until ${expectedReturnToPlayDate} due to "Concussion": Potential concussion.`
    );
  });

  test('does not render an alert after the local returnToPlay.date has passed', async () => {
    mockedStudentClassService.getAll.mockResolvedValue({
      data: [
        { StudentID: 54610, ClassCode: '7A-ENG' },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    mockedClipboardIncidentService.getAll.mockResolvedValue({
      data: [
        {
          id: 45861,
          studentConcerned: { id: 54610, firstName: 'Brooke', legalFirstName: null, lastName: 'Beekman', smsId: '54610' },
          dateTime: '2026-05-10T18:24:00Z',
          returnToPlay: {
            date: '2026-06-01T14:00:00Z',
          },
          concussionStatus: 'confirmed',
          archived: false,
          location: null,
        },
      ],
      currentPage: 1,
      pageLength: 1,
      numRecords: 1,
      lastPage: 1,
    } as any);

    const {container} = render(
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={'2026-06-03'} periodNumber={1} />
    );

    await waitFor(() => {
      expect(mockedClipboardIncidentService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
