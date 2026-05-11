import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {useSelector} from 'react-redux';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {PageTestId} from '../../../layouts/__mocks__/Page';
import {PageLoadingSpinnerTestId} from '../../../components/common/__mocks__/PageLoadingSpinner';
import {Page401Key, Page401TestId} from '../../../components/__mocks__/Page401';
import {PageNotFoundKey, PageNotFoundTestId} from '../../../components/__mocks__/PageNotFound';
import {StudentGridForAParentKey, StudentGridForAParentTestId} from '../../../components/student/__mocks__/StudentGridForAParent';
import {SearchPageKey, SearchPageTestId} from '../../../pages/studentReport/components/__mocks__/SearchPage';
import {StudentDetailsPageKey, StudentDetailsPageTestId} from '../../../pages/studentReport/components/__mocks__/StudentDetailsPage';
import StudentReport from '../../../pages/studentReport/StudentReport';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';
import AuthService from '../../../services/AuthService';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/studentReport/components/SearchPage');
jest.mock('../../../pages/studentReport/components/StudentDetailsPage');
jest.mock('../../../components/Page401');
jest.mock('../../../components/student/StudentGridForAParent');
jest.mock('../../../services/AuthService', () => ({
  __esModule: true,
  default: {
    canAccessModule: jest.fn(),
  },
}));
jest.mock('../../../services/Synergetic/Student/SynVStudentService', () => ({
  __esModule: true,
  default: {
    getVPastAndCurrentStudentAll: jest.fn(),
  },
}));
jest.mock('../../../components/PageNotFound');
jest.mock('../../../components/support/ContactSupportPopupBtn');
jest.mock('../../../components/common/PageLoadingSpinner');
jest.mock('../../../services/Synergetic/Community/SynCommunityService', () => ({
  __esModule: true,
  default: {
    getCommunityProfiles: jest.fn(),
  },
}));
jest.mock('../../../services/Synergetic/Student/StudentContactService', () => ({
  __esModule: true,
  default: {
    getStudentContacts: jest.fn(),
  },
}));

describe('StudentReport', () => {
  ComponentTestHelper.prepare();

  const mockedUseSelector = useSelector as jest.Mock;
  const mockedStudentService = SynVStudentService as jest.Mocked<typeof SynVStudentService>;
  const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    mockedStudentService.getVPastAndCurrentStudentAll.mockResolvedValue({
      data: [],
    } as any);
    mockedAuthService.canAccessModule.mockResolvedValue({} as any);
  });

  test('renders nothing when there is no authenticated user', () => {
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user: undefined}})
    );

    const {container} = render(<StudentReport />);

    expect(container).toBeEmptyDOMElement();
  });

  test('shows a loading spinner while resolving a student user record', () => {
    const user = {isStudent: true, synergyId: 10};
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user}})
    );
    mockedStudentService.getVPastAndCurrentStudentAll.mockReturnValue(
      new Promise(() => undefined) as any
    );

    render(<StudentReport />);

    expect(screen.getByTestId(PageLoadingSpinnerTestId)).toBeInTheDocument();
  });

  test('renders student details when a matching student record is found', async () => {
    const user = {isStudent: true, synergyId: 10};
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user}})
    );
    mockedStudentService.getVPastAndCurrentStudentAll.mockResolvedValue({
      data: [{StudentID: 10, Given1: 'Ada'}],
    } as any);

    render(<StudentReport />);

    await waitFor(() =>
      expect(screen.getByTestId(StudentDetailsPageTestId)).toBeInTheDocument()
    );

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(StudentDetailsPageKey)[0]?.student).toMatchObject({
      StudentID: 10,
      Given1: 'Ada',
    });
  });

  test('renders the parent student grid when the parent has not selected a student', async () => {
    const user = {isParent: true, synergyId: 55};
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user}})
    );

    render(<StudentReport />);

    await waitFor(() =>
      expect(screen.getByTestId(StudentGridForAParentTestId)).toBeInTheDocument()
    );
    expect(ComponentTestHelper.get(StudentGridForAParentKey)[0]).toMatchObject({
      parentSynId: 55,
    });
  });

  test('renders the search page for a teacher with module access', async () => {
    const user = {isStaff: true, isTeacher: true};
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user}})
    );
    mockedAuthService.canAccessModule.mockResolvedValue({
      teacher: {canAccess: true},
    } as any);

    render(<StudentReport />);

    await waitFor(() =>
      expect(screen.getByTestId(SearchPageTestId)).toBeInTheDocument()
    );
    expect(ComponentTestHelper.get(SearchPageKey).length).toBeGreaterThan(0);
  });

  test('renders page not found when a student has no matching report profile', async () => {
    const user = {isStudent: true, synergyId: 88};
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user}})
    );
    mockedStudentService.getVPastAndCurrentStudentAll.mockResolvedValue({
      data: [],
    } as any);

    render(<StudentReport />);

    await waitFor(() =>
      expect(screen.getByTestId(PageNotFoundTestId)).toBeInTheDocument()
    );
    expect(ComponentTestHelper.get(PageNotFoundKey).length).toBeGreaterThan(0);
  });

  test('renders page401 when the user has no eligible branch', async () => {
    const user = {isStaff: true};
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({auth: {user}})
    );
    mockedAuthService.canAccessModule.mockResolvedValue({
      staff: {canAccess: false},
    } as any);

    render(<StudentReport />);

    await waitFor(() =>
      expect(screen.getByTestId(Page401TestId)).toBeInTheDocument()
    );
    expect(ComponentTestHelper.get(Page401Key).length).toBeGreaterThan(0);
  });
});
