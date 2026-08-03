import {useEffect, useMemo, useState} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import Table, {iTableColumn} from '../../../components/common/Table';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import SynConfigUserGroupService from '../../../services/Synergetic/SynConfigUserGroupService';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';
import Toaster from '../../../services/Toaster';

type iSynUserRow = {
  ID: number;
  NameInternal: string;
  NetworkLogin: string;
  ActiveFlag: boolean | null;
  Groups: string[];
};

type UserFilter = 'active' | 'inactive' | 'all';

const chunk = <T,>(values: T[], size = 100): T[][] => values.reduce<T[][]>(
  (chunks, value, index) => {
    const chunkIndex = Math.floor(index / size);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), value];
    return chunks;
  },
  []
);

const SynUsersTable = () => {
  const [rows, setRows] = useState<iSynUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<UserFilter>('inactive');

  const filteredRows = useMemo(() => rows.filter(user => {
    if (filter === 'active') return user.ActiveFlag === true;
    if (filter === 'inactive') return user.ActiveFlag !== true;
    return true;
  }), [filter, rows]);

  const columns = useMemo<iTableColumn<iSynUserRow>[]>(() => [
    {key: 'ID', header: 'ID', cell: (_, staff) => `${staff.ID}`},
    {key: 'NameInternal', header: 'Name', cell: (_, staff) => staff.NameInternal},
    {key: 'NetworkLogin', header: 'NetworkLogin', cell: (_, staff) => staff.NetworkLogin},
    {
      key: 'ActiveFlag',
      header: 'ActiveFlag',
      cell: (column, staff) => (
        <td key={column.key} className={staff.ActiveFlag ? '' : 'bg-danger text-white'}>
          {staff.ActiveFlag === true ? 'YES' : staff.ActiveFlag === false ? 'NO' : ''}
        </td>
      ),
    },
    {
      key: 'Groups',
      header: 'Groups',
      cell: (column, staff) => (
        <td key={column.key}>
          {staff.Groups.map((groupName: string) => (
            <div key={groupName}><small>{groupName}</small></div>
          ))}
        </td>
      ),
    },
  ], []);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      SynConfigUserService.getAll({perPage: 9999}),
      SynConfigUserGroupService.getAll({perPage: 9999}),
    ])
      .then(async ([userResult, membershipResult]) => {
        if (isCancelled) return;

        const users = userResult.data || [];
        const idChunks = chunk(users.map(user => user.ID));
        const [communityResults, staffResults] = await Promise.all([
          Promise.all(idChunks.map(ids => SynCommunityService.getCommunityProfiles({
              where: JSON.stringify({ID: ids}),
              perPage: 9999,
            }))),
          Promise.all(idChunks.map(ids => SynVStaffService.getStaffList({
            where: JSON.stringify({StaffID: ids}),
          }))),
        ]);
        if (isCancelled) return;

        const communitiesById = communityResults.flatMap(result => result.data || []).reduce<{
          [ID: number]: any;
        }>((map, community) => ({...map, [community.ID]: community}), {});
        const activeStaffIds = new Set(
          staffResults.flat().filter(staff => staff.ActiveFlag).map(staff => staff.StaffID)
        );
        const groupsByLogin = (membershipResult.data || []).reduce<{
          [loginName: string]: string[];
        }>((map, membership) => {
          const loginName = membership.LoginName.toLowerCase();
          map[loginName] = [...(map[loginName] || []), membership.GroupCode];
          return map;
        }, {});

        const userRows = users.map(user => {
          const community = communitiesById[user.ID];
          const networkLogin = user.LoginName;
          return {
            ID: user.ID,
            NameInternal: community?.NameInternal || '',
            NetworkLogin: networkLogin,
            ActiveFlag: activeStaffIds.has(user.ID),
            Groups: Array.from(new Set(groupsByLogin[networkLogin.toLowerCase()] || []))
              .sort((groupA, groupB) => groupA.localeCompare(groupB)),
          };
        }).sort((staffA, staffB) =>
          staffA.NameInternal.localeCompare(staffB.NameInternal) || staffA.ID - staffB.ID
        );

        setRows(userRows);
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
      <ButtonGroup className={'mb-3'} aria-label={'Filter Synergetic users'}>
        <Button
          variant={filter === 'active' ? 'primary' : 'outline-primary'}
          aria-pressed={filter === 'active'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'inactive' ? 'primary' : 'outline-primary'}
          aria-pressed={filter === 'inactive'}
          onClick={() => setFilter('inactive')}
        >
          Inactive
        </Button>
        <Button
          variant={filter === 'all' ? 'primary' : 'outline-primary'}
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </ButtonGroup>
      {!isLoading && rows.length <= 0
        ? <p className={'mb-0'}>No Synergetic users were found.</p>
        : !isLoading && filteredRows.length <= 0
          ? <p className={'mb-0'}>No users match the selected filter.</p>
        : (
          <Table
            columns={columns}
            rows={filteredRows}
            isLoading={isLoading}
            striped
            hover
            responsive
          />
        )}
    </>
  );
};

export default SynUsersTable;
