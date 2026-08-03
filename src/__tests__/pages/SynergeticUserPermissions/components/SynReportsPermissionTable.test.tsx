import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import SynReportsPermissionTable
  from '../../../../pages/SynergeticUserPermissions/components/SynReportsPermissionTable';
import {OP_OR} from '../../../../helper/ServiceHelper';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';
import SynConfigUserGroupService from '../../../../services/Synergetic/SynConfigUserGroupService';
import SynConfigUserService from '../../../../services/Synergetic/SynConfigUserService';
import SynLuConfigGroupService from '../../../../services/Synergetic/SynLuConfigGroupService';
import SynVConfigGroupResourcesAllService
  from '../../../../services/Synergetic/SynVConfigGroupResourcesAllService';
import SynVStaffService from '../../../../services/Synergetic/SynVStaffService';
import SynConfigResourceTypes from '../../../../types/Synergetic/SynConfigResourceTypes';

jest.mock('../../../../services/Synergetic/Community/SynCommunityService');
jest.mock('../../../../services/Synergetic/SynConfigUserGroupService');
jest.mock('../../../../services/Synergetic/SynConfigUserService');
jest.mock('../../../../services/Synergetic/SynLuConfigGroupService');
jest.mock('../../../../services/Synergetic/SynVConfigGroupResourcesAllService');
jest.mock('../../../../services/Synergetic/SynVStaffService');
jest.mock('../../../../services/Toaster', () => ({showApiError: jest.fn()}));
jest.mock('../../../../components/common/PopupBtn', () => ({
  __esModule: true,
  default: ({children, popupProps}: any) => <button>{children}</button>,
}));

const paginated = (data: any[]) => ({
  currentPage: 1, perPage: 9999, from: data.length ? 1 : 0, to: data.length,
  total: data.length, pages: data.length ? 1 : 0, data,
});

describe('SynReportsPermissionTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SynVConfigGroupResourcesAllService.getAll as jest.Mock)
      .mockResolvedValueOnce(paginated([{
        ResourceType: SynConfigResourceTypes.Reports_CDA,
        Module: 'REP',
        ModuleDescription: 'Reports',
        Resource1: 'REPORT_A',
        Resource2: '',
        Resource3: '',
        GroupCode: 'REPORT_GROUP',
        Description: 'Test Report Description',
        SelectFlag: true,
      }]))
      .mockResolvedValueOnce(paginated([{
        ResourceType: SynConfigResourceTypes.Reports_CDA,
        Resource1: 'REPORT_A',
        Description: 'Test Report Description',
      }]));
    (SynConfigUserGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {GroupCode: 'REPORT_GROUP', LoginName: 'mgg\\alpha'},
      {GroupCode: 'REPORT_GROUP', LoginName: 'mgg\\beta'},
    ]));
    (SynLuConfigGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {Code: 'REPORT_GROUP', Description: 'Report access'},
    ]));
    (SynConfigUserService.getAll as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, LoginName: 'mgg\\alpha'},
      {ID: 2, LoginName: 'mgg\\beta'},
    ]));
    (SynCommunityService.getCommunityProfiles as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, NameInternal: 'Alpha, Anne'},
      {ID: 2, NameInternal: 'Beta, Bob'},
    ]));
    (SynVStaffService.getStaffList as jest.Mock).mockResolvedValue([
      {StaffID: 1, ActiveFlag: true},
      {StaffID: 2, ActiveFlag: false},
    ]);
  });

  test('lists report access by group, module, resources and users with description and popup', async () => {
    render(<SynReportsPermissionTable reportCode={'REPORT_A'} />);

    await waitFor(() => expect(screen.getByText('Alpha, Anne')).toBeInTheDocument());
    expect(screen.getByText('Test Report Description')).toBeInTheDocument();
    // Initially shows only active rows, so user count is 1 (Alpha is active)
    expect(screen.getByRole('button', {name: 'Total User: 1'})).toBeInTheDocument();
    expect(SynVConfigGroupResourcesAllService.getAll).toHaveBeenCalledWith({
      where: JSON.stringify({
        ResourceType: [
          SynConfigResourceTypes.Reports_Site,
          SynConfigResourceTypes.Reports_CDA,
        ],
        [OP_OR]: [
          {Resource1: 'REPORT_A'},
          {Resource2: 'REPORT_A'},
          {Resource3: 'REPORT_A'},
        ],
      }),
      perPage: 9999,
    });

    const rows = screen.getAllByRole('row').slice(1);
    // With "Active Only" default, should only show 1 row (Alpha)
    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText('REPORT_GROUP').closest('td')).toHaveAttribute('rowspan', '1');
    expect(within(rows[0]).getByText('REP').closest('td')).toHaveAttribute('rowspan', '1');
    expect(within(rows[0]).getByText('Reports CDA').closest('td')).toHaveAttribute('rowspan', '1');
    expect(within(rows[0]).getByText('REPORT_A').closest('td')).toHaveAttribute('rowspan', '1');
    expect(within(rows[0]).getByText('1').closest('td')).toHaveAttribute('rowspan', '1');
    expect(within(rows[0]).getByText('Alpha, Anne')).toBeInTheDocument();
    expect(screen.queryByText('Beta, Bob')).not.toBeInTheDocument();
  });

  test('filters table rows by Active/Inactive status when filter buttons are clicked', async () => {
    render(<SynReportsPermissionTable reportCode={'REPORT_A'} />);

    await waitFor(() => expect(screen.getByText('Alpha, Anne')).toBeInTheDocument());

    // Verify filter buttons are rendered
    const filterButtons = screen.getAllByRole('button').filter(btn =>
      ['Active Only', 'Inactive Only', 'All'].includes(btn.textContent?.trim() || '')
    );
    expect(filterButtons).toHaveLength(3);
    expect(filterButtons[0]).toHaveTextContent('Active Only');
    expect(filterButtons[1]).toHaveTextContent('Inactive Only');
    expect(filterButtons[2]).toHaveTextContent('All');

    // Initially shows only active rows (1 row - Alpha is active) because "Active Only" is default
    let bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);
    expect(within(bodyRows[0]).getByText('Alpha, Anne')).toBeInTheDocument();
    expect(screen.queryByText('Beta, Bob')).not.toBeInTheDocument();

    // Verify rowspans are correct for active filter (1 row spans all grouped cells)
    let userGroupCell = within(bodyRows[0]).getByText(/REPORT_GROUP/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '1');

    // Click "Inactive Only" button
    fireEvent.click(filterButtons[1]);

    // Should show only 1 row (Beta is inactive)
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);
    expect(within(bodyRows[0]).getByText('Beta, Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alpha, Anne')).not.toBeInTheDocument();

    // Verify rowspan updated for inactive filter
    userGroupCell = within(bodyRows[0]).getByText(/REPORT_GROUP/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '1');

    // Click "All" button
    fireEvent.click(filterButtons[2]);

    // Should show all 2 rows
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(2);
    expect(within(bodyRows[0]).getByText('Alpha, Anne')).toBeInTheDocument();
    expect(within(bodyRows[1]).getByText('Beta, Bob')).toBeInTheDocument();

    // Verify rowspan recalculated for "All" filter (should span 2 rows)
    userGroupCell = within(bodyRows[0]).getByText(/REPORT_GROUP/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '2');

    // Click "Active Only" again to verify toggle back
    fireEvent.click(filterButtons[0]);
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);
    expect(screen.queryByText('Beta, Bob')).not.toBeInTheDocument();

    // Verify user count in title updates based on filter
    expect(screen.getByRole('button', {name: 'Total User: 1'})).toBeInTheDocument();
  });

  test('recalculates rowspans correctly when switching between filters', async () => {
    // Create more complex scenario with multiple groups
    (SynVConfigGroupResourcesAllService.getAll as jest.Mock)
      .mockResolvedValueOnce(paginated([{
        ResourceType: SynConfigResourceTypes.Reports_CDA,
        Module: 'REP',
        ModuleDescription: 'Reports',
        Resource1: 'REPORT_A',
        Resource2: '',
        Resource3: '',
        GroupCode: 'REPORT_GROUP',
        Description: 'Test Report Description',
        SelectFlag: true,
      }]))
      .mockResolvedValueOnce(paginated([{
        ResourceType: SynConfigResourceTypes.Reports_CDA,
        Resource1: 'REPORT_A',
        Description: 'Test Report Description',
      }]));
    (SynConfigUserGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {GroupCode: 'REPORT_GROUP', LoginName: 'mgg\\alpha'},
      {GroupCode: 'REPORT_GROUP', LoginName: 'mgg\\beta'},
    ]));

    render(<SynReportsPermissionTable reportCode={'REPORT_A'} />);

    await waitFor(() => expect(screen.getByText('Alpha, Anne')).toBeInTheDocument());

    // With "Active Only" default, shows 1 row
    let bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);
    let resourceCell = within(bodyRows[0]).getByText(/REPORT_A/).closest('td');
    expect(resourceCell).toHaveAttribute('rowspan', '1');

    // Switch to "All"
    fireEvent.click(screen.getByRole('button', {name: 'All'}));
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(2);

    // Now resource should span 2 rows
    resourceCell = within(bodyRows[0]).getByText(/REPORT_A/).closest('td');
    expect(resourceCell).toHaveAttribute('rowspan', '2');

    // Back to "Inactive Only"
    fireEvent.click(screen.getByRole('button', {name: 'Inactive Only'}));
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);

    // Resource span back to 1
    resourceCell = within(bodyRows[0]).getByText(/REPORT_A/).closest('td');
    expect(resourceCell).toHaveAttribute('rowspan', '1');
  });
});
