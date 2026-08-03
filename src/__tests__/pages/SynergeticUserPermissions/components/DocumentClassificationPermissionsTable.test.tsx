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

    (SynVConfigGroupResourcesAllService.getAll as jest.Mock).mockResolvedValue(paginated([
      groupResource('Z_GROUP', {SelectFlag: true, InsertFlag: true}),
      groupResource('A_GROUP', {
        Resource2: 'SECOND_RESOURCE',
        Resource3: 'THIRD_RESOURCE',
        SelectFlag: true,
        UpdateFlag: true,
      }),
      groupResource('IGNORED_GROUP'),
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

    const totalUsersHeading = await screen.findByRole('heading', {name: 'Total Users: 2'});
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

    const bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(3);
    const firstUserGroupCell = within(bodyRows[0]).getByText(/A_GROUP/).closest('td');
    expect(firstUserGroupCell).toHaveAttribute('rowspan', '2');
    expect(firstUserGroupCell).toHaveClass('user-group-cell');
    expect(within(bodyRows[1]).queryByText(/A_GROUP/)).not.toBeInTheDocument();
    expect(within(bodyRows[2]).getByText(/Z_GROUP/).closest('td')).toHaveAttribute('rowspan', '1');
    expect(screen.queryByRole('columnheader', {name: 'ResourceType'})).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Resources'})).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', {name: 'Resource1'})).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', {name: 'Resource2'})).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', {name: 'Resource3'})).not.toBeInTheDocument();
    const resourcesCell = within(bodyRows[0]).getByText('CLASS').closest('td');
    expect(resourcesCell).toHaveAttribute('rowspan', '2');
    expect(resourcesCell).toHaveTextContent('CLASSSECOND_RESOURCETHIRD_RESOURCE');
    expect(resourcesCell?.querySelectorAll(':scope > div')).toHaveLength(3);
    expect(screen.getByRole('columnheader', {name: 'No. Of Users'})).toBeInTheDocument();
    const numberOfUsersCell = within(bodyRows[0]).getByText('2').closest('td');
    expect(numberOfUsersCell).toHaveAttribute('rowspan', '2');
    expect(numberOfUsersCell).toHaveClass('resource-permission-cell');
    expect(within(bodyRows[0]).getAllByTitle('Yes')[0].closest('td')).toHaveAttribute('rowspan', '2');
    expect(screen.queryByRole('columnheader', {name: 'Classification'})).not.toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader').map(header => header.textContent);
    expect(headers.indexOf('ID')).toBeLessThan(headers.indexOf('User'));
    expect(headers.indexOf('User')).toBeLessThan(headers.indexOf('LoginName'));
    expect(within(bodyRows[0]).getByText('Alice Able')).toBeInTheDocument();
    expect(within(bodyRows[0]).getByText('1')).toBeInTheDocument();
    expect(within(bodyRows[0]).getByText('Alice Able').querySelector('small')).not.toBeInTheDocument();
    expect(within(bodyRows[0]).getByText('Alpha group')).toBeInTheDocument();
    expect(within(bodyRows[1]).getByText('Bob Baker')).toBeInTheDocument();
    expect(within(bodyRows[2]).getByText('Alice Able')).toBeInTheDocument();

    const inactiveStaffCell = bodyRows[1].querySelector('td.bg-danger');
    expect(inactiveStaffCell).toHaveClass('bg-danger', 'text-white');
    expect(screen.getAllByTitle('Yes')).toHaveLength(4);

    fireEvent.click(within(totalUsersHeading).getByRole('button', {name: '2'}));
    const usersDialog = await screen.findByRole('dialog');
    expect(within(usersDialog).getByText('CLASS - Users')).toBeInTheDocument();
    expect(within(usersDialog).getByText('Able, Alice')).toBeInTheDocument();
    expect(within(usersDialog).getByText('Baker, Bob')).toBeInTheDocument();
    expect(within(usersDialog).getAllByRole('row')).toHaveLength(3);
    expect(within(usersDialog).getByText('NO').closest('td')).toHaveClass('bg-danger', 'text-white');

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
});
