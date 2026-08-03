import {useEffect, useMemo, useState} from 'react';
import PopupBtn from '../../../components/common/PopupBtn';
import Table, {iTableColumn} from '../../../components/common/Table';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';
import SynConfigUserGroupService from '../../../services/Synergetic/SynConfigUserGroupService';
import SynLuConfigGroupService from '../../../services/Synergetic/SynLuConfigGroupService';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';
import Toaster from '../../../services/Toaster';

type iSynUserGroupRow = {
  Name: string;
  Description: string;
  NumberOfUsers: number;
  NumberOfActiveUsers: number;
  Users: iSynUserGroupUser[];
};

type iSynUserGroupUser = {
  ID: number | '';
  NameInternal: string;
  NetworkLogin: string;
  ActiveFlag: boolean;
};

const chunk = <T,>(values: T[], size = 100): T[][] => values.reduce<T[][]>(
  (chunks, value, index) => {
    const chunkIndex = Math.floor(index / size);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), value];
    return chunks;
  },
  []
);

const userColumns: iTableColumn<iSynUserGroupUser>[] = [
  {key: 'ID', header: 'ID', cell: (_, user) => `${user.ID}`},
  {key: 'NameInternal', header: 'Name', cell: (_, user) => user.NameInternal},
  {key: 'NetworkLogin', header: 'NetworkLogin', cell: (_, user) => user.NetworkLogin},
  {
    key: 'ActiveFlag',
    header: 'ActiveFlag',
    cell: (column, user) => (
      <td key={column.key} className={user.ActiveFlag ? '' : 'bg-danger text-white'}>
        {user.ActiveFlag ? 'YES' : 'NO'}
      </td>
    ),
  },
];

const usersPopup = (groupName: string, users: iSynUserGroupUser[], activeOnly = false) => {
  const displayedUsers = activeOnly ? users.filter(user => user.ActiveFlag) : users;
  return (
    <PopupBtn
      variant={'link'}
      className={'p-0 align-baseline'}
      popupProps={{
        title: `${groupName} - ${activeOnly ? 'Active Users' : 'Users'}`,
        children: (
          <Table
            columns={userColumns}
            rows={displayedUsers}
            striped
            hover
            responsive
          />
        ),
      }}
    >
      {displayedUsers.length}
    </PopupBtn>
  );
};

const SynUserGroupsTable = () => {
  const [rows, setRows] = useState<iSynUserGroupRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo<iTableColumn<iSynUserGroupRow>[]>(() => [
    {
      key: 'Name',
      header: 'Name',
      cell: (_, row) => row.Name,
    },
    {key: 'Description', header: 'Description', cell: (_, row) => row.Description},
    {
      key: 'NumberOfUsers',
      header: 'No. Of Users',
      cell: (column, row) => (
        <td key={column.key} className={row.NumberOfUsers === 0 ? 'bg-danger text-white' : ''}>
          {row.NumberOfUsers === 0 ? 0 : usersPopup(row.Name, row.Users)}
        </td>
      ),
    },
    {
      key: 'NumberOfActiveUsers',
      header: 'No. Of Active Users',
      cell: (column, row) => (
        <td key={column.key} className={row.NumberOfActiveUsers === 0 ? 'bg-danger text-white' : ''}>
          {row.NumberOfActiveUsers === 0 ? 0 : usersPopup(row.Name, row.Users, true)}
        </td>
      ),
    },
  ], []);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      SynLuConfigGroupService.getAll({perPage: 9999}),
      SynConfigUserGroupService.getAll({perPage: 9999}),
      SynConfigUserService.getAll({perPage: 9999}),
    ])
      .then(async ([groupResult, membershipResult, userResult]) => {
        if (isCancelled) return;

        const configUsers = userResult.data || [];
        const idChunks = chunk(configUsers.map(user => user.ID));
        const [staffResults, communityResults] = await Promise.all([
          Promise.all(idChunks.map(ids => SynVStaffService.getStaffList({
            where: JSON.stringify({StaffID: ids}),
          }))),
          Promise.all(idChunks.map(ids => SynCommunityService.getCommunityProfiles({
            where: JSON.stringify({ID: ids}),
            perPage: 9999,
          }))),
        ]);
        if (isCancelled) return;

        const activeStaffIds = new Set(
          staffResults.flat().filter(staff => staff.ActiveFlag).map(staff => staff.StaffID)
        );
        const configUsersByLogin = configUsers.reduce<{
          [loginName: string]: typeof configUsers[number];
        }>((map, user) => ({...map, [user.LoginName.toLowerCase()]: user}), {});
        const communitiesById = communityResults.flatMap(result => result.data || []).reduce<{
          [ID: number]: any;
        }>((map, community) => ({...map, [community.ID]: community}), {});

        const membershipsByGroup = (membershipResult.data || []).reduce<{
          [groupCode: string]: string[];
        }>((map, membership) => {
          const groupCode = membership.GroupCode.toLowerCase();
          map[groupCode] = [...(map[groupCode] || []), membership.LoginName];
          return map;
        }, {});
        const groupsByCode = (groupResult.data || []).reduce<{
          [groupCode: string]: {Code: string; Description: string};
        }>((map, group) => ({
          ...map,
          [group.Code.toLowerCase()]: group,
        }), {});
        const groupCodes = Array.from(new Set([
          ...Object.keys(groupsByCode),
          ...Object.keys(membershipsByGroup),
        ])).sort((codeA, codeB) => codeA.localeCompare(codeB));

        const userGroupRows = groupCodes.map(groupCode => {
          const group = groupsByCode[groupCode];
          const users = (membershipsByGroup[groupCode] || []).map((loginName): iSynUserGroupUser => {
            const configUser = configUsersByLogin[loginName.toLowerCase()];
            const community = configUser ? communitiesById[configUser.ID] : undefined;
            const ID: number | '' = configUser ? configUser.ID : '';
            return {
              ID,
              NameInternal: community?.NameInternal || '',
              NetworkLogin: configUser?.LoginName || loginName,
              ActiveFlag: !!configUser && activeStaffIds.has(configUser.ID),
            };
          }).sort((userA, userB) => userA.NetworkLogin.localeCompare(userB.NetworkLogin));

          return {
            Name: group?.Code || groupCode,
            Description: group?.Description || '',
            NumberOfUsers: users.length,
            NumberOfActiveUsers: users.filter(user => user.ActiveFlag).length,
            Users: users,
          };
        }).sort((rowA, rowB) =>
          rowA.NumberOfActiveUsers - rowB.NumberOfActiveUsers ||
          rowA.NumberOfUsers - rowB.NumberOfUsers ||
          rowA.Name.localeCompare(rowB.Name)
        );

        setRows(userGroupRows);
      })
      .catch(err => {
        if (!isCancelled) Toaster.showApiError(err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {!isLoading && rows.length <= 0
        ? <p className={'mb-0'}>No user groups were found.</p>
        : (
          <Table
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            striped
            hover
            responsive
          />
        )}
    </>
  );
};

export default SynUserGroupsTable;
