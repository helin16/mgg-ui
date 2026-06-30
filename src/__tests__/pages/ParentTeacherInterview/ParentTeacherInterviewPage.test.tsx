import React, {act} from 'react';
import {useSelector} from 'react-redux';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import {PageNotFoundKey, PageNotFoundTestId} from '../../../components/__mocks__/PageNotFound';
import {PageKey, PageTestId} from '../../../layouts/__mocks__/Page';
import ParentTeacherInterviewPage from '../../../pages/ParentTeacherInterview/ParentTeacherInterviewPage';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';
import SynLuStaffCategoryService from '../../../services/Synergetic/Lookup/SynLuStaffCategoryService';
import Toaster from '../../../services/Toaster';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import AuthService from '../../../services/AuthService';
import ParentTeacherInterviewCalendarService from '../../../services/ParentTeacherInterview/ParentTeacherInterviewCalendarService';

const flattenNodeText = (node: any): string => {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return `${node}`;
  }
  if (Array.isArray(node)) {
    return node.map(flattenNodeText).join('');
  }
  if (React.isValidElement(node)) {
    return flattenNodeText(node.props.children);
  }
  return '';
};

jest.mock('../../../layouts/Page');
jest.mock('../../../pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage');
jest.mock('../../../components/PageNotFound');
jest.mock('../../../services/Synergetic/SynVStaffService', () => ({
  __esModule: true,
  default: {
    getStaffList: jest.fn(),
  },
}));
jest.mock('../../../services/Synergetic/Lookup/SynLuStaffCategoryService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster', () => ({
  showApiError: jest.fn(),
}));
jest.mock('../../../services/Module/MggsModuleService', () => ({
  __esModule: true,
  default: {
    getModule: jest.fn(),
  },
}));
jest.mock('../../../services/AuthService', () => ({
  __esModule: true,
  default: {
    isModuleRole: jest.fn(),
  },
}));
jest.mock('../../../services/ParentTeacherInterview/ParentTeacherInterviewCalendarService', () => ({
  __esModule: true,
  default: {
    getCalendarEvents: jest.fn(),
    createCalendarEvent: jest.fn(),
  },
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('ParentTeacherInterviewPage', () => {
  mockComponentTestHelper.prepare();
  const mockedUseSelector = useSelector as jest.Mock;
  const mockedStaffService = SynVStaffService as jest.Mocked<typeof SynVStaffService>;
  const mockedCategoryService = SynLuStaffCategoryService as jest.Mocked<typeof SynLuStaffCategoryService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;
  const mockedModuleService = MggsModuleService as jest.Mocked<typeof MggsModuleService>;
  const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
  const mockedCalendarService = ParentTeacherInterviewCalendarService as jest.Mocked<typeof ParentTeacherInterviewCalendarService>;

  beforeEach(() => {
    mockedUseSelector.mockImplementation((selector: any) => selector({
      auth: {
        user: {
          synergyId: 12345,
        },
      },
    }));
    mockedStaffService.getStaffList.mockResolvedValue([
      {
        StaffID: 1001,
        StaffNameInternal: 'Ada Lovelace',
        StaffSurname: 'Lovelace',
        StaffPreferredName: 'Ada',
        SchoolStaffCode: 'AL',
        StaffOccupEmail: 'ada@example.com',
        StaffCategory: 'TEACH',
        StaffCategoryDescription: 'Teaching Staff',
      },
      {
        StaffID: 1002,
        StaffNameInternal: 'Grace Hopper',
        StaffSurname: 'Hopper',
        StaffPreferredName: 'Grace',
        SchoolStaffCode: 'GH',
        StaffOccupEmail: 'grace@example.com',
        StaffCategory: 'LEAD',
        StaffCategoryDescription: 'Leadership',
      },
    ] as any);
    mockedCategoryService.getAll.mockResolvedValue([
      {Code: 'TEACH', Description: 'Teaching Staff'},
      {Code: 'LEAD', Description: 'Leadership'},
    ] as any);
    mockedModuleService.getModule.mockResolvedValue({
      settings: {
        parentTeacherInterviewCalendar: {
          isAllDay: false,
          allowUserChange: true,
          startDateTime: '2099-07-01T09:00',
          endDateTime: '2099-07-01T10:00',
          subject: 'PTI Subject',
          bodyText: 'PTI Body',
        },
      },
    } as any);
    mockedAuthService.isModuleRole.mockResolvedValue(true as any);
    mockedCalendarService.getCalendarEvents.mockResolvedValue({
      events: [],
    } as any);
    mockedCalendarService.createCalendarEvent.mockResolvedValue({
      outcome: 'CREATED',
      message: 'Created successfully',
      event: {
        subject: 'PTI Subject',
        startDateTime: '2099-07-01T09:00:00+10:00',
        endDateTime: '2099-07-01T10:00:00+10:00',
        teamsJoinUrl: 'https://teams.example.com/created',
      },
    } as any);
  });

  test('renders page composition', async () => {
    const {container} = render(<ParentTeacherInterviewPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);
    await waitFor(() => expect(mockedStaffService.getStaffList).toHaveBeenCalled());
    expect(container).not.toBeEmptyDOMElement();
  });

  test('loads active teaching staff and category options on mount', async () => {
    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(mockedStaffService.getStaffList).toHaveBeenCalled());
    expect(mockedStaffService.getStaffList).toHaveBeenCalledWith({
      where: JSON.stringify({
        ActiveFlag: true,
        StaffDepartment: ['TS'],
      }),
    });
    expect(mockedCategoryService.getAll).toHaveBeenCalled();
    expect(mockedModuleService.getModule).toHaveBeenCalled();
  });

  test('filters by search/category and projects selected staff into step two', async () => {
    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search staff'), {target: {value: 'Grace'}});
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Select Grace Hopper'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));

    expect(screen.getByText('Schedule Parent Teacher Interview')).toBeInTheDocument();
    expect(screen.getByLabelText('Starting datetime for Grace Hopper')).toHaveValue('2099-07-01T09:00');
    expect(screen.getByLabelText('Ending datetime for Grace Hopper')).toHaveValue('2099-07-01T10:00');
    await waitFor(() => expect(mockedCalendarService.getCalendarEvents).toHaveBeenCalled());
  });

  test('clears selected staff after filter changes', async () => {
    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    expect(screen.getByRole('button', {name: 'Next'})).not.toBeDisabled();

    fireEvent.change(screen.getByLabelText('Search staff'), {target: {value: 'Grace'}});

    await waitFor(() => expect(screen.getByText('Grace Hopper')).toBeInTheDocument());
    expect(screen.getByRole('button', {name: 'Next'})).toBeDisabled();
  });

  test('shows failure state and toasts when load fails', async () => {
    mockedStaffService.getStaffList.mockRejectedValueOnce(new Error('load failed'));

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Unable to load teaching staff.')).toBeInTheDocument());
    expect(mockedToaster.showApiError).toHaveBeenCalled();
  });

  test('retrieves existing events automatically and submits create for admins', async () => {
    mockedCalendarService.getCalendarEvents.mockResolvedValueOnce({
      events: [
        {
          id: 'evt-1',
          subject: 'PTI Subject',
          startDateTime: '2099-07-01T09:15:00+10:00',
          endDateTime: '2099-07-01T09:45:00+10:00',
          organizer: {name: 'Ada Lovelace', address: 'ada@example.com'},
          isAllDay: false,
          isOnlineMeeting: true,
          teamsJoinUrl: 'https://teams.example.com/existing',
        },
      ],
    } as any);

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));

    fireEvent.change(screen.getByLabelText('Starting datetime for Ada Lovelace'), {target: {value: '2099-07-01T09:00'}});
    fireEvent.change(screen.getByLabelText('Ending datetime for Ada Lovelace'), {target: {value: '2099-07-01T10:00'}});

    await waitFor(() => expect(mockedCalendarService.getCalendarEvents).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('PTI Subject')).toBeInTheDocument());

    await waitFor(() => expect(screen.getByRole('button', {name: 'Create link(s) for 1 staff'})).not.toBeDisabled());
    fireEvent.click(screen.getByRole('button', {name: 'Create link(s) for 1 staff'}));
    fireEvent.change(screen.getByPlaceholderText('12345'), {target: {value: '12345'}});
    fireEvent.click(screen.getByRole('button', {name: 'Create event links'}));

    await waitFor(() => expect(mockedCalendarService.createCalendarEvent).toHaveBeenCalled());
    expect(mockedCalendarService.createCalendarEvent).toHaveBeenCalledWith(expect.objectContaining({
      isAllDay: false,
    }));
    expect(screen.getByText('Staff Email')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Interview Meeting')).toBeInTheDocument());
    expect(screen.queryByText('Interview Time')).not.toBeInTheDocument();
    expect(screen.getAllByText('PTI Subject').length).toBeGreaterThan(0);
    expect(screen.getByText('01/07/2099 09:00 - 10:00')).toBeInTheDocument();
    expect(screen.queryByText('Created successfully')).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Link'})).toHaveAttribute(
      'href',
      'https://teams.example.com/created'
    );
    expect(screen.getByRole('button', {name: 'Create link(s) for 1 staff'})).toBeDisabled();
  });

  test('supports all-day schedule rows and submits an all-day create payload', async () => {
    mockedModuleService.getModule.mockResolvedValueOnce({
      settings: {
        parentTeacherInterviewCalendar: {
          isAllDay: true,
          startDateTime: '2026-07-03',
          endDateTime: '2026-07-03',
          subject: 'PTI Subject',
          bodyText: 'PTI Body',
        },
      },
    } as any);

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));
    expect(screen.getByLabelText('All Day')).toBeChecked();
    fireEvent.change(screen.getByLabelText('Starting date for Ada Lovelace'), {target: {value: '2026-07-03'}});
    fireEvent.change(screen.getByLabelText('Ending date for Ada Lovelace'), {target: {value: '2026-07-03'}});

    await waitFor(() => expect(mockedCalendarService.getCalendarEvents).toHaveBeenCalledWith(expect.objectContaining({
      startDateTime: expect.stringContaining('2026-07-03T00:00:00'),
      endDateTime: expect.stringContaining('2026-07-03T23:59:59'),
    })));

    fireEvent.click(screen.getByRole('button', {name: 'Create link(s) for 1 staff'}));
    fireEvent.change(screen.getByPlaceholderText('12345'), {target: {value: '12345'}});
    fireEvent.click(screen.getByRole('button', {name: 'Create event links'}));

    await waitFor(() => expect(mockedCalendarService.createCalendarEvent).toHaveBeenCalledWith(expect.objectContaining({
      isAllDay: true,
      startDateTime: expect.stringContaining('2026-07-03T00:00:00'),
      endDateTime: expect.stringContaining('2026-07-04T00:00:00'),
    })));
  });

  test('restores timed defaults from selected all-day dates when all-day is unchecked', async () => {
    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));

    fireEvent.click(screen.getByLabelText('All Day'));
    fireEvent.change(screen.getByLabelText('Starting date for Ada Lovelace'), {target: {value: '2026-07-05'}});
    fireEvent.change(screen.getByLabelText('Ending date for Ada Lovelace'), {target: {value: '2026-07-06'}});
    fireEvent.click(screen.getByLabelText('All Day'));

    expect(screen.getByLabelText('Starting datetime for Ada Lovelace')).toHaveValue('2026-07-05T08:00');
    expect(screen.getByLabelText('Ending datetime for Ada Lovelace')).toHaveValue('2026-07-06T16:00');
  });

  test('uses default all-day settings to prepopulate schedule rows', async () => {
    mockedModuleService.getModule.mockResolvedValueOnce({
      settings: {
        parentTeacherInterviewCalendar: {
          isAllDay: true,
          allowUserChange: true,
          startDateTime: '2026-07-07',
          endDateTime: '2026-07-08',
          subject: 'PTI Subject',
          bodyText: 'PTI Body',
        },
      },
    } as any);

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));

    expect(screen.getByLabelText('All Day')).toBeChecked();
    expect(screen.getByLabelText('Starting date for Ada Lovelace')).toHaveValue('2026-07-07');
    expect(screen.getByLabelText('Ending date for Ada Lovelace')).toHaveValue('2026-07-08');
  });

  test('locks interview time to default settings when user changes are disabled', async () => {
    mockedModuleService.getModule.mockResolvedValueOnce({
      settings: {
        parentTeacherInterviewCalendar: {
          isAllDay: false,
          allowUserChange: false,
          startDateTime: '2099-07-09T11:00',
          endDateTime: '2099-07-09T12:00',
          subject: 'PTI Subject',
          bodyText: 'PTI Body',
        },
      },
    } as any);

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));

    expect(screen.queryByLabelText('All Day')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Starting datetime for Ada Lovelace')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Ending datetime for Ada Lovelace')).not.toBeInTheDocument();
    expect(screen.getByText('09/07/2099 11:00 - 12:00')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('button', {name: 'Create link(s) for 1 staff'})).not.toBeDisabled());
    fireEvent.click(screen.getByRole('button', {name: 'Create link(s) for 1 staff'}));
    fireEvent.change(screen.getByPlaceholderText('12345'), {target: {value: '12345'}});
    fireEvent.click(screen.getByRole('button', {name: 'Create event links'}));

    await waitFor(() => expect(mockedCalendarService.createCalendarEvent).toHaveBeenCalledWith(expect.objectContaining({
      isAllDay: false,
      startDateTime: expect.stringContaining('2099-07-09T11:00:00'),
      endDateTime: expect.stringContaining('2099-07-09T12:00:00'),
    })));
  });

  test('hides staff selection and shows empty state when required defaults are missing', async () => {
    mockedAuthService.isModuleRole.mockResolvedValueOnce(false as any);
    mockedModuleService.getModule.mockResolvedValueOnce({
      settings: {
        parentTeacherInterviewCalendar: {
          isAllDay: false,
          bodyText: 'PTI Body',
        },
      },
    } as any);

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByTestId(PageNotFoundTestId)).toBeInTheDocument());
    const pageNotFoundProps = mockComponentTestHelper.get(PageNotFoundKey)[0];
    expect(pageNotFoundProps).toMatchObject({
      title: 'Parent Teacher Interview defaults are incomplete',
    });
    const descriptionText = flattenNodeText(pageNotFoundProps.description);
    expect(descriptionText).toContain('Missing fields: Subject');
    expect(descriptionText).toContain('Default Interview Start Time');
    expect(descriptionText).toContain('Default Interview End Time');
    expect(descriptionText).not.toContain('Set these default values in module settings before selecting staff.');
    expect(screen.queryByLabelText('Search staff')).not.toBeInTheDocument();
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Next'})).not.toBeInTheDocument();
  });

  test('resets back to the initial staff-selection state and reloads settings when admin closes', async () => {
    mockedModuleService.getModule
      .mockResolvedValueOnce({
        settings: {
          parentTeacherInterviewCalendar: {
            isAllDay: false,
            allowUserChange: true,
            startDateTime: '2099-07-01T09:00',
            endDateTime: '2099-07-01T10:00',
            subject: 'PTI Subject',
            bodyText: 'PTI Body',
          },
        },
      } as any)
      .mockResolvedValueOnce({
        settings: {
          parentTeacherInterviewCalendar: {
            isAllDay: false,
            allowUserChange: false,
            startDateTime: '2099-07-10T11:00',
            endDateTime: '2099-07-10T12:00',
            subject: 'Updated PTI Subject',
            bodyText: 'Updated PTI Body',
          },
        },
      } as any);

    render(<ParentTeacherInterviewPage />);

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search staff'), {target: {value: 'Grace'}});
    fireEvent.click(screen.getByLabelText('Select Grace Hopper'));
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));
    expect(screen.getByText('Schedule Parent Teacher Interview')).toBeInTheDocument();

    const pageProps = mockComponentTestHelper.get(PageKey)[0];

    await act(async () => {
      await pageProps.onAdminPageClose();
    });

    await waitFor(() => expect(screen.getByLabelText('Search staff')).toHaveValue(''));
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Next'})).toBeDisabled();
    expect(screen.queryByText('Schedule Parent Teacher Interview')).not.toBeInTheDocument();
    expect(mockedModuleService.getModule).toHaveBeenCalledTimes(2);
  });
});
