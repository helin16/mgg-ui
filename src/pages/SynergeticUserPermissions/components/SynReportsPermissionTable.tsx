import {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import Table, {iTableColumn} from '../../../components/common/Table';
import {OP_OR} from '../../../helper/ServiceHelper';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import SynConfigUserGroupService from '../../../services/Synergetic/SynConfigUserGroupService';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';
import SynLuConfigGroupService from '../../../services/Synergetic/SynLuConfigGroupService';
import SynVConfigGroupResourcesAllService
  from '../../../services/Synergetic/SynVConfigGroupResourcesAllService';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';
import Toaster from '../../../services/Toaster';
import SynConfigResourceTypes from '../../../types/Synergetic/SynConfigResourceTypes';
import iSynReportPermissionRow from '../../../types/Synergetic/iSynReportPermissionRow';

type iSynReportsPermissionTable = {
  reportCode: string;
  excludedUserIds?: number[];
};

const EMPTY_EXCLUDED_USER_IDS: number[] = [];
const REPORT_RESOURCE_TYPES = [
  SynConfigResourceTypes.StandaloneReport,
  SynConfigResourceTypes.AssessmentReport,
  SynConfigResourceTypes.Report,
];

const chunk = <T,>(values: T[], size = 100): T[][] => values.reduce<T[][]>(
  (chunks, value, index) => {
    const chunkIndex = Math.floor(index / size);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), value];
    return chunks;
  },
  []
);

const resourceKey = (row: Pick<
  iSynReportPermissionRow,
  'Module' | 'Resource1' | 'Resource2' | 'Resource3'
>) => [row.Module, row.Resource1, row.Resource2, row.Resource3].join('|');

const Wrapper = styled.div`
  .table-striped > tbody > tr > td.grouped-cell {
    --bs-table-bg-type: transparent !important;
  }

  .table-hover > tbody > tr:hover > td.grouped-cell {
    --bs-table-bg-state: transparent !important;
  }
`;

const SynReportsPermissionTable = ({
  reportCode,
  excludedUserIds = EMPTY_EXCLUDED_USER_IDS,
}: iSynReportsPermissionTable) => {
  const [rows, setRows] = useState<iSynReportPermissionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo<iTableColumn<iSynReportPermissionRow>[]>(() => [
    {
      key: 'UserGroupCode',
      header: 'User Group',
      cell: (column, row) => !row.UserGroupRowSpan ? null : (
        <td key={column.key} rowSpan={row.UserGroupRowSpan} className={'grouped-cell'}>
          {row.UserGroupCode}
          <div><small>{row.UserGroupDescription}</small></div>
        </td>
      ),
    },
    {
      key: 'Module',
      header: 'Module',
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'grouped-cell'}>
          {row.Module}
          <div><small>{row.ModuleDescription}</small></div>
        </td>
      ),
    },
    {
      key: 'Resources',
      header: 'Resources',
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'grouped-cell'}>
          {[row.Resource1, row.Resource2, row.Resource3]
            .filter(Boolean)
            .map((resource, index) => <div key={`${resource}-${index}`}>{resource}</div>)}
        </td>
      ),
    },
    {
      key: 'NumberOfUsers',
      header: 'No. Of Users',
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'grouped-cell'}>
          {row.ResourceRowSpan}
        </td>
      ),
    },
    {key: 'ID', header: 'ID', cell: (_, row) => `${row.ID}`},
    {key: 'User', header: 'User', cell: (_, row) => row.User},
    {key: 'LoginName', header: 'LoginName', cell: (_, row) => row.LoginName},
    {
      key: 'ActiveStaff',
      header: 'ActiveStaff',
      cell: (column, row) => (
        <td key={column.key} className={row.ActiveStaff ? '' : 'bg-danger text-white'}>
          {row.ActiveStaff ? 'YES' : ''}
        </td>
      ),
    },
  ], []);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    SynVConfigGroupResourcesAllService.getAll({
      where: JSON.stringify({
        ResourceType: REPORT_RESOURCE_TYPES,
        [OP_OR]: [
          {Resource1: reportCode},
          {Resource2: reportCode},
          {Resource3: reportCode},
        ],
      }),
      perPage: 9999,
    })
      .then(async resourceResult => {
        const resources = (resourceResult.data || []).filter(resource =>
          resource.SelectFlag || resource.UpdateFlag || resource.InsertFlag || resource.DeleteFlag
        );
        const groupCodes = Array.from(new Set(resources.map(resource => resource.GroupCode)));
        if (groupCodes.length <= 0) return [];

        const [membershipResult, groupResult, userResult] = await Promise.all([
          SynConfigUserGroupService.getAll({
            where: JSON.stringify({GroupCode: groupCodes}),
            perPage: 9999,
          }),
          SynLuConfigGroupService.getAll({
            where: JSON.stringify({Code: groupCodes}),
            perPage: 9999,
          }),
          SynConfigUserService.getAll({perPage: 9999}),
        ]);
        const membershipLoginNames = new Set(
          (membershipResult.data || []).map(membership => membership.LoginName.toLowerCase())
        );
        const excludedUserIdSet = new Set(excludedUserIds);
        const users = (userResult.data || []).filter(user =>
          membershipLoginNames.has(user.LoginName.toLowerCase()) &&
          !excludedUserIdSet.has(user.ID)
        );
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

        const resourcesByGroup = resources.reduce<{[groupCode: string]: typeof resources}>(
          (map, resource) => ({
            ...map,
            [resource.GroupCode]: [...(map[resource.GroupCode] || []), resource],
          }),
          {}
        );
        const usersByLogin = users.reduce<{[loginName: string]: typeof users[number]}>(
          (map, user) => ({...map, [user.LoginName.toLowerCase()]: user}),
          {}
        );
        const groupsByCode = (groupResult.data || []).reduce<{[groupCode: string]: string}>(
          (map, group) => ({...map, [group.Code]: group.Description}),
          {}
        );
        const communitiesById = communityResults.flatMap(result => result.data || []).reduce<{
          [ID: number]: any;
        }>((map, community) => ({...map, [community.ID]: community}), {});
        const activeStaffIds = new Set(
          staffResults.flat().filter(staff => staff.ActiveFlag).map(staff => staff.StaffID)
        );

        return (membershipResult.data || []).flatMap(membership => {
          const user = usersByLogin[membership.LoginName.toLowerCase()];
          if (!user) return [];
          const community = communitiesById[user.ID];
          return (resourcesByGroup[membership.GroupCode] || []).map(resource => ({
            UserGroupCode: membership.GroupCode,
            UserGroupDescription: groupsByCode[membership.GroupCode] || '',
            Module: resource.Module,
            ModuleDescription: resource.ModuleDescription,
            Resource1: resource.Resource1,
            Resource2: resource.Resource2,
            Resource3: resource.Resource3,
            ID: user.ID,
            User: community?.NameInternal || '',
            LoginName: user.LoginName,
            ActiveStaff: activeStaffIds.has(user.ID),
          }));
        });
      })
      .then(reportRows => {
        if (isCancelled) return;
        const sortedRows = [...reportRows].sort((rowA, rowB) =>
          rowA.UserGroupCode.localeCompare(rowB.UserGroupCode) ||
          resourceKey(rowA).localeCompare(resourceKey(rowB)) ||
          rowA.User.localeCompare(rowB.User) ||
          rowA.ID - rowB.ID
        );

        setRows(sortedRows.map((row, index) => {
          const firstGroupRow = index === 0 ||
            sortedRows[index - 1].UserGroupCode !== row.UserGroupCode;
          const firstResourceRow = firstGroupRow ||
            resourceKey(sortedRows[index - 1]) !== resourceKey(row);
          return {
            ...row,
            UserGroupRowSpan: firstGroupRow
              ? sortedRows.filter(candidate => candidate.UserGroupCode === row.UserGroupCode).length
              : undefined,
            ResourceRowSpan: firstResourceRow
              ? sortedRows.filter(candidate =>
                candidate.UserGroupCode === row.UserGroupCode &&
                resourceKey(candidate) === resourceKey(row)
              ).length
              : undefined,
          };
        }));
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
  }, [excludedUserIds, reportCode]);

  const totalUsers = new Set(rows.map(row => row.ID)).size;

  return (
    <Wrapper>
      <h5 className={'mt-3'}>Total User: {totalUsers}</h5>
      <Table
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        responsive
        striped
        hover
        size={'sm'}
      />
    </Wrapper>
  );
};

export default SynReportsPermissionTable;
