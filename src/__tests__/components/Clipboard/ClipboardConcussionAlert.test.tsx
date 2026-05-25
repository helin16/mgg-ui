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
          dateTime: '2026-05-25T10:00:00Z',
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

    const expectedDateTime = moment.utc('2026-05-25T10:00:00Z').local().format('ddd DD MMM YYYY h:mm A');

    const startDateTime = moment(currentDate).startOf('day').toISOString();
    const endDateTime = moment(currentDate).endOf('day').toISOString();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      `Gabriella Calnan is confirmed with "Concussion" in Clipboard by Charlotte Ryan at ${expectedDateTime}.`
    );
    expect(screen.getByRole('link', {name: 'Gabriella Calnan'})).toHaveAttribute(
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

  test('renders an alert when restriction dates are missing even if incident dateTime is in the past', async () => {
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
      <ClipboardConcussionAlert classCode={'7A-ENG'} currentDate={'2026-05-11'} periodNumber={1} />
    );

    const expectedDateTime = moment.utc('2026-05-10T10:00:00Z').local().format('ddd DD MMM YYYY h:mm A');

    const startDateTime = moment('2026-05-11').startOf('day').toISOString();
    const endDateTime = moment('2026-05-11').endOf('day').toISOString();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      `Gabriella Calnan is confirmed with "Concussion" in Clipboard by Brooke Beekman at ${expectedDateTime}.`
    );
    expect(screen.getByRole('link', {name: 'Gabriella Calnan'})).toHaveAttribute(
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
});
