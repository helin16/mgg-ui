import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import SynUserGroupsTable
  from '../../../../pages/SynergeticUserPermissions/components/SynUserGroupsTable';
import SynConfigUserGroupService from '../../../../services/Synergetic/SynConfigUserGroupService';
import SynConfigUserService from '../../../../services/Synergetic/SynConfigUserService';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';
import SynLuConfigGroupService from '../../../../services/Synergetic/SynLuConfigGroupService';
import SynVStaffService from '../../../../services/Synergetic/SynVStaffService';

jest.mock('../../../../services/Synergetic/SynConfigUserGroupService');
jest.mock('../../../../services/Synergetic/SynConfigUserService');
jest.mock('../../../../services/Synergetic/Community/SynCommunityService');
jest.mock('../../../../services/Synergetic/SynLuConfigGroupService');
jest.mock('../../../../services/Synergetic/SynVStaffService');

const mockedMembershipService = SynConfigUserGroupService as jest.Mocked<
  typeof SynConfigUserGroupService
>;
const mockedGroupService = SynLuConfigGroupService as jest.Mocked<typeof SynLuConfigGroupService>;
const mockedUserService = SynConfigUserService as jest.Mocked<typeof SynConfigUserService>;
const mockedCommunityService = SynCommunityService as jest.Mocked<typeof SynCommunityService>;
const mockedStaffService = SynVStaffService as jest.Mocked<typeof SynVStaffService>;

const result = (data: any[]) => ({
  currentPage: 1,
  perPage: 9999,
  from: data.length ? 1 : 0,
  to: data.length,
  total: data.length,
  pages: 1,
  data,
});

describe('SynUserGroupsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUserService.getAll.mockResolvedValue(result([]));
    mockedCommunityService.getCommunityProfiles.mockResolvedValue(result([]));
    mockedStaffService.getStaffList.mockResolvedValue([]);
  });

  test('sorts groups by active users, total users, then name ascending', async () => {
    mockedGroupService.getAll.mockResolvedValue(result([
      {Code: 'Z_EMPTY', Description: 'Last empty group'},
      {Code: 'IN_USE', Description: 'Populated group'},
      {Code: 'A_EMPTY', Description: 'First empty group'},
    ]));
    mockedMembershipService.getAll.mockResolvedValue(result([
      {GroupCode: 'in_use', LoginName: 'mgg\\z-user'},
      {GroupCode: 'IN_USE', LoginName: 'mgg\\a-user'},
    ]));
    mockedUserService.getAll.mockResolvedValue(result([
      {ID: 1, LoginName: 'mgg\\a-user'},
      {ID: 2, LoginName: 'mgg\\z-user'},
    ]));
    mockedStaffService.getStaffList.mockResolvedValue([
      {StaffID: 1, ActiveFlag: true},
      {StaffID: 2, ActiveFlag: false},
    ]);
    mockedCommunityService.getCommunityProfiles.mockResolvedValue(result([
      {ID: 1, NameInternal: 'Active, User', NetworkLogin: 'a-user'},
      {ID: 2, NameInternal: 'Inactive, User', NetworkLogin: 'z-user'},
    ]));

    render(<SynUserGroupsTable />);

    await waitFor(() => expect(screen.getByText('A_EMPTY')).toBeInTheDocument());
    expect(screen.getByText('Z_EMPTY')).toBeInTheDocument();
    expect(screen.getByText('IN_USE')).toBeInTheDocument();
    expect(screen.queryByText('mgg\\a-user')).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Description'})).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'No. Of Users'})).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'No. Of Active Users'})).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('A_EMPTY');
    expect(rows[1]).toHaveTextContent('0');
    expect(rows[1]).not.toHaveClass('table-danger');
    expect(rows[1].querySelectorAll('td.bg-danger.text-white')).toHaveLength(2);
    expect(within(rows[1]).queryByRole('button')).not.toBeInTheDocument();
    expect(rows[2]).toHaveTextContent('Z_EMPTY');
    expect(rows[2]).toHaveTextContent('0');
    expect(rows[2].querySelectorAll('td.bg-danger.text-white')).toHaveLength(2);
    expect(within(rows[2]).queryByRole('button')).not.toBeInTheDocument();
    expect(rows[3]).toHaveTextContent('IN_USE');
    expect(rows[3]).toHaveTextContent('21');

    const countButtons = within(rows[3]).getAllByRole('button');
    fireEvent.click(countButtons[0]);

    const usersDialog = await screen.findByRole('dialog');
    expect(within(usersDialog).getByText('IN_USE - Users')).toBeInTheDocument();
    expect(within(usersDialog).getByRole('columnheader', {name: 'ID'})).toBeInTheDocument();
    expect(within(usersDialog).getByRole('columnheader', {name: 'Name'})).toBeInTheDocument();
    expect(within(usersDialog).getByRole('columnheader', {name: 'NetworkLogin'})).toBeInTheDocument();
    expect(within(usersDialog).getByRole('columnheader', {name: 'ActiveFlag'})).toBeInTheDocument();
    expect(within(usersDialog).getByText('Active, User')).toBeInTheDocument();
    expect(within(usersDialog).getByText('Inactive, User')).toBeInTheDocument();
    expect(within(usersDialog).getByText('mgg\\a-user')).toBeInTheDocument();
    expect(within(usersDialog).getByText('mgg\\z-user')).toBeInTheDocument();
    expect(within(usersDialog).getByText('YES').closest('td')).not.toHaveClass('bg-danger');
    expect(within(usersDialog).getByText('NO').closest('td')).toHaveClass('bg-danger', 'text-white');
    expect(rows[3].querySelector('td.bg-danger')).not.toBeInTheDocument();
  });

  test('shows an empty state when no groups or memberships exist', async () => {
    mockedGroupService.getAll.mockResolvedValue(result([]));
    mockedMembershipService.getAll.mockResolvedValue(result([]));

    render(<SynUserGroupsTable />);

    expect(await screen.findByText('No user groups were found.')).toBeInTheDocument();
  });
});
