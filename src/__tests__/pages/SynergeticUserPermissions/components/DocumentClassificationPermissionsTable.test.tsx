import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import DocumentClassificationPermissionsTable
  from '../../../../pages/SynergeticUserPermissions/components/DocumentClassificationPermissionsTable';
import SynVConfigGroupResourcesAllService
  from '../../../../services/Synergetic/SynVConfigGroupResourcesAllService';
import SynConfigUserGroupService from '../../../../services/Synergetic/SynConfigUserGroupService';
import SynConfigUserService from '../../../../services/Synergetic/SynConfigUserService';
import SynLuConfigGroupService from '../../../../services/Synergetic/SynLuConfigGroupService';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';
import SynVStaffService from '../../../../services/Synergetic/SynVStaffService';
import {OP_OR} from '../../../../helper/ServiceHelper';
import SynConfigResourceTypes from '../../../../types/Synergetic/SynConfigResourceTypes';

jest.mock('../../../../services/Synergetic/SynVConfigGroupResourcesAllService');
jest.mock('../../../../services/Synergetic/SynConfigUserGroupService');
jest.mock('../../../../services/Synergetic/SynConfigUserService');
jest.mock('../../../../services/Synergetic/SynLuConfigGroupService');
jest.mock('../../../../services/Synergetic/Community/SynCommunityService');
jest.mock('../../../../services/Synergetic/SynVStaffService');
jest.mock('../../../../services/Toaster', () => ({showApiError: jest.fn()}));
jest.mock('../../../../components/common/PopupBtn', () => ({
  __esModule: true,
  default: ({children, popupProps}: any) => <button>{children}</button>,
}));

const paginated = (data: any[]) => ({
  currentPage: 1,
  perPage: 9999,
  from: data.length > 0 ? 1 : 0,
  to: data.length,
  total: data.length,
  pages: data.length > 0 ? 1 : 0,
  data,
});

const groupResource = (GroupCode: string, permissions: any = {}) => ({
  GroupCode,
  ResourceType: SynConfigResourceTypes.DocumentClassification,
  Resource1: 'CLASS',
  Resource2: '',
  Resource3: '',
  Description: 'Classification description',
  SelectFlag: false,
  UpdateFlag: false,
  InsertFlag: false,
  DeleteFlag: false,
  ...permissions,
});

describe('DocumentClassificationPermissionsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (SynVConfigGroupResourcesAllService.getAll as jest.Mock)
      .mockResolvedValueOnce(paginated([
        groupResource('Z_GROUP', {SelectFlag: true, InsertFlag: true}),
        groupResource('A_GROUP', {
          Resource2: 'SECOND_RESOURCE',
          Resource3: 'THIRD_RESOURCE',
          SelectFlag: true,
          UpdateFlag: true,
        }),
        groupResource('IGNORED_GROUP'),
      ]))
      .mockResolvedValueOnce(paginated([
        groupResource('Z_GROUP', {SelectFlag: true, InsertFlag: true}),
      ]));
    (SynConfigUserGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {GroupCode: 'Z_GROUP', LoginName: 'mgg\\alice'},
      {GroupCode: 'A_GROUP', LoginName: 'mgg\\bob'},
      {GroupCode: 'A_GROUP', LoginName: 'mgg\\alice'},
      {GroupCode: 'A_GROUP', LoginName: 'mgg\\excluded'},
    ]));
    (SynLuConfigGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {Code: 'A_GROUP', Description: 'Alpha group'},
      {Code: 'Z_GROUP', Description: 'Zulu group'},
    ]));
    (SynConfigUserService.getAll as jest.Mock).mockResolvedValue(paginated([
      {ID: 2, LoginName: 'mgg\\bob'},
      {ID: 1, LoginName: 'MGG\\ALICE'},
      {ID: 3, LoginName: 'mgg\\excluded'},
    ]));
    (SynCommunityService.getCommunityProfiles as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, Preferred: 'Alice', Given1: 'Alicia', Surname: 'Able', NameInternal: 'Able, Alice'},
      {ID: 2, Preferred: 'Bob', Given1: 'Robert', Surname: 'Baker', NameInternal: 'Baker, Bob'},
    ]));
    (SynVStaffService.getStaffList as jest.Mock).mockResolvedValue([
      {StaffID: 1, ActiveFlag: true},
      {StaffID: 2, ActiveFlag: false},
    ]);
  });

  test('renders enriched, excluded, formatted and sorted permission rows', async () => {
    render(
      <DocumentClassificationPermissionsTable
        classificationCode={'CLASS'}
        excludedUserIds={[3]}
      />
    );

    await screen.findByText('Classification description');
    expect(screen.getByText('Classification description')).toBeInTheDocument();
    const totalUsersHeading = await screen.findByRole('heading', {level: 5});
    expect(totalUsersHeading).toBeInTheDocument();
    expect(totalUsersHeading).toHaveTextContent('Total Users:');
    const canReadSummary = screen.getByText((_, element) =>
      element?.tagName === 'SMALL' && element.textContent === 'Can Read: 2'
    );
    const canUpdateSummary = screen.getByText((_, element) =>
      element?.tagName === 'SMALL' && element.textContent === 'Can Update: 2'
    );
    const canInsertSummary = screen.getByText((_, element) =>
      element?.tagName === 'SMALL' && element.textContent === 'Can Insert: 1'
    );
    expect(screen.getByText((_, element) =>
      element?.tagName === 'SMALL' && element.textContent === 'Can Delete: 0'
    )).toBeInTheDocument();
    expect(within(canReadSummary).getByRole('button', {name: '2'})).toBeInTheDocument();
    expect(within(canUpdateSummary).getByRole('button', {name: '2'})).toBeInTheDocument();
    expect(within(canInsertSummary).getByRole('button', {name: '1'})).toBeInTheDocument();
    expect(screen.queryByText('mgg\\excluded')).not.toBeInTheDocument();

    // Initially shows only active rows (2 rows - Alice rows) because "Active Only" is default
    const bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(2);
    const firstUserGroupCell = within(bodyRows[0]).getByText(/A_GROUP/).closest('td');
    expect(firstUserGroupCell).toHaveAttribute('rowspan', '1');
    expect(firstUserGroupCell).toHaveClass('user-group-cell');
    expect(within(bodyRows[1]).getByText(/Z_GROUP/).closest('td')).toHaveAttribute('rowspan', '1');
    expect(screen.queryByRole('columnheader', {name: 'ResourceType'})).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Resources'})).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', {name: 'Resource1'})).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', {name: 'Resource2'})).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', {name: 'Resource3'})).not.toBeInTheDocument();
    const resourcesCell = within(bodyRows[0]).getByText('CLASS').closest('td');
    expect(resourcesCell).toHaveAttribute('rowspan', '1');
    expect(screen.getByRole('columnheader', {name: 'No. Of Users'})).toBeInTheDocument();
    const numberOfUsersCell = within(bodyRows[0]).getByText('1').closest('td');
    expect(numberOfUsersCell).toHaveAttribute('rowspan', '1');
    expect(numberOfUsersCell).toHaveClass('resource-permission-cell');
    expect(screen.queryByRole('columnheader', {name: 'Classification'})).not.toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader').map(header => header.textContent);
    expect(headers.indexOf('ID')).toBeLessThan(headers.indexOf('User'));
    expect(headers.indexOf('User')).toBeLessThan(headers.indexOf('LoginName'));
    expect(within(bodyRows[0]).getByText('Alice Able')).toBeInTheDocument();
    expect(within(bodyRows[1]).getByText('Alice Able')).toBeInTheDocument();
    expect(screen.queryByText('Bob Baker')).not.toBeInTheDocument();

    expect(SynVConfigGroupResourcesAllService.getAll).toHaveBeenCalledWith({
      where: JSON.stringify({
        ResourceType: SynConfigResourceTypes.DocumentClassification,
        [OP_OR]: [
          {Resource1: 'CLASS'},
          {Resource2: 'CLASS'},
          {Resource3: 'CLASS'},
        ],
      }),
      perPage: 9999,
    });
    expect(SynVConfigGroupResourcesAllService.getAll).toHaveBeenCalledWith({
      where: JSON.stringify({
        [OP_OR]: [
          {Resource1: 'CLASS'},
          {Resource2: 'CLASS'},
          {Resource3: 'CLASS'},
        ],
      }),
      perPage: 1,
    });
    await waitFor(() => expect(SynConfigUserGroupService.getAll).toHaveBeenCalledWith({
      where: JSON.stringify({GroupCode: ['Z_GROUP', 'A_GROUP']}),
      perPage: 9999,
    }));
    expect(SynConfigUserService.getAll).toHaveBeenCalledWith({perPage: 9999});
  });

  test('avoids oversized login queries and batches large ID lookups', async () => {
    const users = Array.from({length: 201}, (_, index) => ({
      ID: index + 1,
      LoginName: `mgg\\user${index + 1}`,
    }));
    (SynVConfigGroupResourcesAllService.getAll as jest.Mock).mockResolvedValue(
      paginated([groupResource('MEDICAL_GROUP', {SelectFlag: true})])
    );
    (SynConfigUserGroupService.getAll as jest.Mock).mockResolvedValue(paginated(
      users.map(user => ({GroupCode: 'MEDICAL_GROUP', LoginName: user.LoginName}))
    ));
    (SynLuConfigGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {Code: 'MEDICAL_GROUP', Description: 'Medical access'},
    ]));
    (SynConfigUserService.getAll as jest.Mock).mockResolvedValue(paginated(users));
    (SynCommunityService.getCommunityProfiles as jest.Mock).mockImplementation(({where}) => {
      const ids: number[] = JSON.parse(where).ID;
      return Promise.resolve(paginated(ids.map(ID => ({
        ID,
        Preferred: `User${ID}`,
        Surname: 'Test',
      }))));
    });
    (SynVStaffService.getStaffList as jest.Mock).mockImplementation(({where}) => {
      const ids: number[] = JSON.parse(where).StaffID;
      return Promise.resolve(ids.map(StaffID => ({StaffID, ActiveFlag: true})));
    });

    render(<DocumentClassificationPermissionsTable classificationCode={'MEDICAL'} />);

    expect(await screen.findByRole('heading', {name: 'Total Users: 201'})).toBeInTheDocument();
    expect(SynConfigUserService.getAll).toHaveBeenCalledTimes(1);
    expect(SynConfigUserService.getAll).toHaveBeenCalledWith({perPage: 9999});
    expect(SynCommunityService.getCommunityProfiles).toHaveBeenCalledTimes(3);
    expect(SynVStaffService.getStaffList).toHaveBeenCalledTimes(3);

    const communityBatchSizes = (SynCommunityService.getCommunityProfiles as jest.Mock).mock.calls
      .map(([params]) => JSON.parse(params.where).ID.length);
    const staffBatchSizes = (SynVStaffService.getStaffList as jest.Mock).mock.calls
      .map(([params]) => JSON.parse(params.where).StaffID.length);
    expect(communityBatchSizes).toEqual([100, 100, 1]);
    expect(staffBatchSizes).toEqual([100, 100, 1]);
  });

  test('filters table rows by Active/Inactive status when filter buttons are clicked', async () => {
    render(
      <DocumentClassificationPermissionsTable
        classificationCode={'CLASS'}
        excludedUserIds={[3]}
      />
    );

    await screen.findByText('Classification description');

    // Verify filter buttons are rendered in a ButtonGroup
    const filterButtons = screen.getAllByRole('button').filter(btn =>
      ['Active Only', 'Inactive Only', 'All'].includes(btn.textContent?.trim() || '')
    );
    expect(filterButtons).toHaveLength(3);
    expect(filterButtons[0]).toHaveTextContent('Active Only');
    expect(filterButtons[1]).toHaveTextContent('Inactive Only');
    expect(filterButtons[2]).toHaveTextContent('All');

    // Initially shows only active rows (2 rows - Alice rows) because "Active Only" is default
    let bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(2);
    expect(within(bodyRows[0]).getByText('Alice Able')).toBeInTheDocument();
    expect(screen.queryByText('Bob Baker')).not.toBeInTheDocument();

    // Verify rowspans are correct for active filter (recalculated)
    let userGroupCell = within(bodyRows[0]).getByText(/A_GROUP/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '1');

    // Click "Inactive Only" button
    fireEvent.click(filterButtons[1]);

    // Should show only 1 row (Bob is inactive)
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);
    expect(within(bodyRows[0]).getByText('Bob Baker')).toBeInTheDocument();
    expect(screen.queryByText('Alice Able')).not.toBeInTheDocument();

    // Verify rowspan updated for inactive filter
    userGroupCell = within(bodyRows[0]).getByText(/A_GROUP/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '1');

    // Click "All" button
    fireEvent.click(filterButtons[2]);

    // Should show all 3 rows
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(3);
    expect(within(bodyRows[0]).getByText('Alice Able')).toBeInTheDocument();
    expect(screen.getByText('Bob Baker')).toBeInTheDocument();

    // Verify rowspan recalculated for "All" filter (A_GROUP has 2 active Alice rows)
    userGroupCell = within(bodyRows[0]).getByText(/A_GROUP/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '2');

    // Click "Active Only" again to verify toggle
    fireEvent.click(filterButtons[0]);
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(2);
    expect(screen.queryByText('Bob Baker')).not.toBeInTheDocument();
  });

  test('maintains correct rowspan values after filtering when resources span multiple users', async () => {
    // Mock multi-row resources
    (SynVConfigGroupResourcesAllService.getAll as jest.Mock)
      .mockResolvedValueOnce(paginated([
        groupResource('GROUP1', {SelectFlag: true}),
      ]))
      .mockResolvedValueOnce(paginated([
        groupResource('GROUP1', {SelectFlag: true}),
      ]));
    (SynConfigUserGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {GroupCode: 'GROUP1', LoginName: 'mgg\\alice'},
      {GroupCode: 'GROUP1', LoginName: 'mgg\\bob'},
    ]));
    (SynLuConfigGroupService.getAll as jest.Mock).mockResolvedValue(paginated([
      {Code: 'GROUP1', Description: 'Test group'},
    ]));
    (SynConfigUserService.getAll as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, LoginName: 'mgg\\alice'},
      {ID: 2, LoginName: 'mgg\\bob'},
    ]));
    (SynCommunityService.getCommunityProfiles as jest.Mock).mockResolvedValue(paginated([
      {ID: 1, Preferred: 'Alice', Surname: 'Able', NameInternal: 'Able, Alice'},
      {ID: 2, Preferred: 'Bob', Surname: 'Baker', NameInternal: 'Baker, Bob'},
    ]));
    (SynVStaffService.getStaffList as jest.Mock).mockResolvedValue([
      {StaffID: 1, ActiveFlag: true},
      {StaffID: 2, ActiveFlag: false},
    ]);

    render(<DocumentClassificationPermissionsTable classificationCode={'CLASS'} />);

    await screen.findByText('Classification description');

    // With "Active Only" default, should only show Alice (1 row)
    let bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(1);
    let userGroupCell = within(bodyRows[0]).getByText(/GROUP1/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '1');

    // Switch to "All"
    fireEvent.click(screen.getByRole('button', {name: 'All'}));
    bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(2);

    // Now usergroup should span 2 rows
    userGroupCell = within(bodyRows[0]).getByText(/GROUP1/).closest('td');
    expect(userGroupCell).toHaveAttribute('rowspan', '2');
  });
});
