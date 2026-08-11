import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import SynUsersTable
  from '../../../../pages/SynergeticUserPermissions/components/SynUsersTable';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';
import SynConfigUserGroupService from '../../../../services/Synergetic/SynConfigUserGroupService';
import SynConfigUserService from '../../../../services/Synergetic/SynConfigUserService';
import SynVStaffService from '../../../../services/Synergetic/SynVStaffService';

jest.mock('../../../../services/Synergetic/Community/SynCommunityService');
jest.mock('../../../../services/Synergetic/SynConfigUserGroupService');
jest.mock('../../../../services/Synergetic/SynConfigUserService');
jest.mock('../../../../services/Synergetic/SynVStaffService');
jest.mock('../../../../services/Toaster', () => ({showApiError: jest.fn()}));

const paginated = (data: any[]) => ({
  currentPage: 1,
  perPage: 9999,
  from: data.length ? 1 : 0,
  to: data.length,
  total: data.length,
  pages: data.length ? 1 : 0,
  data,
});

describe('SynUsersTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SynVStaffService.getStaffList as jest.Mock).mockResolvedValue([
      {StaffID: 2, ActiveFlag: true},
      {StaffID: 1, ActiveFlag: false},
    ]);
    (SynConfigUserService.getAll as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, LoginName: 'mgg\\alpha'},
      {ID: 2, LoginName: 'mgg\\zulu'},
    ]));
    (SynConfigUserGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {LoginName: 'MGG\\ALPHA', GroupCode: 'Z_GROUP'},
      {LoginName: 'mgg\\alpha', GroupCode: 'A_GROUP'},
      {LoginName: 'mgg\\zulu', GroupCode: 'M_GROUP'},
    ]));
    (SynCommunityService.getCommunityProfiles as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, NameInternal: 'Alpha, Anne', NetworkLogin: 'alpha'},
      {ID: 2, NameInternal: 'Zulu, Zoe', NetworkLogin: 'zulu'},
    ]));
  });

  test('filters users by staff status with inactive selected by default', async () => {
    render(<SynUsersTable />);

    await waitFor(() => expect(screen.getByText('Alpha, Anne')).toBeInTheDocument());
    expect(SynConfigUserService.getAll).toHaveBeenCalledWith({perPage: 9999});
    expect(SynVStaffService.getStaffList).toHaveBeenCalledWith({
      where: JSON.stringify({StaffID: [1, 2]}),
    });

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Alpha, Anne');
    expect(rows[1]).toHaveTextContent('mgg\\alpha');
    expect(screen.queryByText('Zulu, Zoe')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Inactive'})).toHaveAttribute('aria-pressed', 'true');

    const alphaGroups = within(rows[1]).getByText('A_GROUP').closest('td');
    expect(alphaGroups?.querySelectorAll(':scope > div')).toHaveLength(2);
    expect(alphaGroups).toHaveTextContent('A_GROUPZ_GROUP');
    expect(within(rows[1]).getByText('NO').closest('td')).toHaveClass('bg-danger', 'text-white');

    fireEvent.click(screen.getByRole('button', {name: 'Active'}));
    expect(screen.queryByText('Alpha, Anne')).not.toBeInTheDocument();
    expect(screen.getByText('Zulu, Zoe')).toBeInTheDocument();
    expect(screen.getByText('YES').closest('td')).not.toHaveClass('bg-danger');

    fireEvent.click(screen.getByRole('button', {name: 'All'}));
    expect(screen.getByText('Alpha, Anne')).toBeInTheDocument();
    expect(screen.getByText('Zulu, Zoe')).toBeInTheDocument();
  });

  test('shows an empty state when no users exist', async () => {
    (SynConfigUserService.getAll as jest.Mock).mockResolvedValue(paginated([]));

    render(<SynUsersTable />);

    expect(await screen.findByText('No Synergetic users were found.')).toBeInTheDocument();
  });

  test('excludes users by ID when excludedUserIds prop is provided', async () => {
    render(<SynUsersTable excludedUserIds={[1]} />);

    await waitFor(() => expect(screen.getByText('Zulu, Zoe')).toBeInTheDocument());
    
    // Alpha should be excluded because ID=1 is in excludedUserIds
    expect(screen.queryByText('Alpha, Anne')).not.toBeInTheDocument();
    // Zulu should be shown because ID=2 is not in excludedUserIds
    expect(screen.getByText('Zulu, Zoe')).toBeInTheDocument();
  });

  test('reloads users when excludedUserIds changes', async () => {
    const {rerender} = render(<SynUsersTable excludedUserIds={[1]} />);
    await waitFor(() => expect(screen.getByText('Zulu, Zoe')).toBeInTheDocument());

    rerender(<SynUsersTable excludedUserIds={[2]} />);

    await waitFor(() => expect(SynConfigUserService.getAll).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('Alpha, Anne')).toBeInTheDocument();
    expect(screen.queryByText('Zulu, Zoe')).not.toBeInTheDocument();
  });
