import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import SynergeticUserPermissionsPanel
  from '../../../../pages/SynergeticUserPermissions/components/SynergeticUserPermissionsPanel';
import MggsModuleService from '../../../../services/Module/MggsModuleService';
import SynLuDocumentClassificationService
  from '../../../../services/Synergetic/Lookup/SynLuDocumentClassificationService';

jest.mock('../../../../components/common/SectionDiv', () => ({children}: any) => <section>{children}</section>);
jest.mock('../../../../services/Module/MggsModuleService');
jest.mock('../../../../services/Synergetic/Lookup/SynLuDocumentClassificationService');
jest.mock(
  '../../../../pages/SynergeticUserPermissions/components/DocumentClassificationPermissionsTable',
  () => (props: any) => <div data-testid={`permissions-table-${props.classificationCode}`} />
);
jest.mock(
  '../../../../pages/SynergeticUserPermissions/components/SynUserGroupsTable',
  () => () => <div data-testid={'empty-user-groups-table'} />
);
jest.mock(
  '../../../../pages/SynergeticUserPermissions/components/SynUsersTable',
  () => () => <div data-testid={'inactive-staff-table'} />
);
jest.mock(
  '../../../../pages/SynergeticUserPermissions/components/SynReportsPermissionTable',
  () => (props: any) => <div data-testid={`report-permissions-${props.reportCode}`} />
);

const mockedModuleService = MggsModuleService as jest.Mocked<typeof MggsModuleService>;
const mockedClassificationService = SynLuDocumentClassificationService as jest.Mocked<
  typeof SynLuDocumentClassificationService
>;

const classification = (Code: string, Description: string) => ({
  Code,
  Description,
  SynergyMeaning: '',
  SecurityMeaning: '',
  ActiveFlag: true,
  DescriptionStyle: '',
  CommPortalVisibleForStudentParentFlag: false,
  CommPortalVisibleForStudentLivesWithFlag: false,
  CommPortalVisibleForStudentReportsFlag: false,
  CommPortalVisibleForSelfFlag: false,
  CommPortalVisibleForSpouseFlag: false,
  ModifiedDate: '',
  ModifiedUser: '',
  SetCentrallyFlag: null,
});

describe('SynergeticUserPermissionsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates tabs for the document classifications selected in settings', async () => {
    mockedModuleService.getModule.mockResolvedValue({
      ModuleID: 25,
      Name: 'Synergetic User Permissions',
      Description: '',
      Active: true,
      CreatedAt: new Date(),
      CreatedById: 1,
      UpdatedAt: new Date(),
      UpdatedById: 1,
      settings: {
        documentClassificationCodes: ['MEDICAL', 'REPORTS'],
        reportCodes: ['REPORT_A', 'REPORT_B'],
      },
    });
    mockedClassificationService.getAll.mockResolvedValue({
      currentPage: 1,
      perPage: 1000,
      from: 1,
      to: 2,
      total: 2,
      pages: 1,
      data: [
        classification('REPORTS', 'Student Reports'),
        classification('MEDICAL', 'Medical Documents'),
      ],
    });

    render(<SynergeticUserPermissionsPanel />);

    await waitFor(() => {
      expect(screen.getByRole('tab', {name: 'DocMan - Documents'})).toBeInTheDocument();
      expect(screen.getByRole('tab', {name: 'Reports'})).toBeInTheDocument();
      expect(screen.getByRole('tab', {name: 'User Groups'})).toBeInTheDocument();
      expect(screen.getByRole('tab', {name: 'Users'})).toBeInTheDocument();
      expect(screen.getByRole('tab', {name: 'MEDICAL - Medical Documents'})).toBeInTheDocument();
      expect(screen.getByRole('tab', {name: 'REPORTS - Student Reports'})).toBeInTheDocument();
      expect(screen.getByTestId('permissions-table-MEDICAL')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'This view supports the review of user permissions for DocMan access'
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Admin → Settings');
      expect(screen.getByRole('button', {name: 'Close alert'})).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', {name: 'Reports'}));
    expect(screen.getByRole('tab', {name: 'REPORT_A'})).toBeInTheDocument();
    expect(screen.getByRole('tab', {name: 'REPORT_B'})).toBeInTheDocument();
    expect(screen.getByTestId('report-permissions-REPORT_A')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', {name: 'User Groups'}));

    const emptyGroupsMessage = screen.getByText(
      /This view lists all Synergetic user groups and their assigned users\./
    );
    const emptyGroupsAlert = emptyGroupsMessage.closest('[role="alert"]');
    expect(emptyGroupsAlert).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', {name: 'Close alert'});
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    await waitFor(() => expect(emptyGroupsMessage).not.toBeInTheDocument());
    expect(screen.getByTestId('empty-user-groups-table')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', {name: 'Users'}));
    const usersMessage = screen.getByText(
      /This view lists all Synergetic users, their active staff status, and assigned user groups\./
    );
    expect(usersMessage.closest('[role="alert"]')).toBeInTheDocument();
    expect(screen.getByTestId('inactive-staff-table')).toBeInTheDocument();
  });

  test('shows an empty state when no classifications are configured', async () => {
    mockedModuleService.getModule.mockResolvedValue({
      ModuleID: 25,
      Name: 'Synergetic User Permissions',
      Description: '',
      Active: true,
      CreatedAt: new Date(),
      CreatedById: 1,
      UpdatedAt: new Date(),
      UpdatedById: 1,
      settings: {},
    });

    render(<SynergeticUserPermissionsPanel />);

    expect(await screen.findByText('No document classifications have been configured.')).toBeInTheDocument();
    expect(mockedClassificationService.getAll).not.toHaveBeenCalled();
  });
});
