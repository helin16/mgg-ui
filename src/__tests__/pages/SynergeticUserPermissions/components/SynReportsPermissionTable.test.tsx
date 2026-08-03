import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
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

const paginated = (data: any[]) => ({
  currentPage: 1, perPage: 9999, from: data.length ? 1 : 0, to: data.length,
  total: data.length, pages: data.length ? 1 : 0, data,
});

describe('SynReportsPermissionTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SynVConfigGroupResourcesAllService.getAll as jest.Mock).mockResolvedValue(paginated([{
      ResourceType: SynConfigResourceTypes.Report,
      Module: 'REP',
      ModuleDescription: 'Reports',
      Resource1: 'REPORT_A',
      Resource2: '',
      Resource3: '',
      GroupCode: 'REPORT_GROUP',
      SelectFlag: true,
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

  test('lists report access by group, module, resources and users', async () => {
    render(<SynReportsPermissionTable reportCode={'REPORT_A'} />);

    await waitFor(() => expect(screen.getByText('Alpha, Anne')).toBeInTheDocument());
    expect(screen.getByRole('heading', {name: 'Total User: 2'})).toBeInTheDocument();
    expect(SynVConfigGroupResourcesAllService.getAll).toHaveBeenCalledWith({
      where: JSON.stringify({
        ResourceType: [
          SynConfigResourceTypes.StandaloneReport,
          SynConfigResourceTypes.AssessmentReport,
          SynConfigResourceTypes.Report,
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
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText('REPORT_GROUP').closest('td')).toHaveAttribute('rowspan', '2');
    expect(within(rows[0]).getByText('REP').closest('td')).toHaveAttribute('rowspan', '2');
    expect(within(rows[0]).getByText('REPORT_A').closest('td')).toHaveAttribute('rowspan', '2');
    expect(within(rows[0]).getByText('2').closest('td')).toHaveAttribute('rowspan', '2');
    expect(within(rows[1]).getByText('Beta, Bob')).toBeInTheDocument();
    expect(rows[1].querySelector('td.bg-danger')).toHaveClass('bg-danger', 'text-white');
  });
});
