import {useEffect, useMemo, useState} from 'react';
import * as Icons from 'react-bootstrap-icons';
import styled from 'styled-components';
import Table, {iTableColumn} from '../../../components/common/Table';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';
import SynConfigUserGroupService from '../../../services/Synergetic/SynConfigUserGroupService';
import SynLuConfigGroupService from '../../../services/Synergetic/SynLuConfigGroupService';
import SynVConfigGroupResourcesAllService
  from '../../../services/Synergetic/SynVConfigGroupResourcesAllService';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';
import Toaster from '../../../services/Toaster';
import iSynDocumentClassificationPermissionRow
  from '../../../types/Synergetic/iSynDocumentClassificationPermissionRow';
import {OP_OR} from '../../../helper/ServiceHelper';
import SynConfigResourceTypes from '../../../types/Synergetic/SynConfigResourceTypes';

type iDocumentClassificationPermissionsTable = {
  classificationCode: string;
  excludedUserIds?: number[];
};

const EMPTY_EXCLUDED_USER_IDS: number[] = [];

const permissionIcon = (value: boolean) => value
  ? <Icons.CheckCircleFill className={'text-success'} title={'Yes'} />
  : null;

const centeredHeader = (label: string) => (
  column: iTableColumn<iSynDocumentClassificationPermissionRow>
) => <th key={column.key} className={'text-center'}>{label}</th>;

const chunk = <T,>(values: T[], size = 100): T[][] => {
  return values.reduce<T[][]>((chunks, value, index) => {
    const chunkIndex = Math.floor(index / size);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), value];
    return chunks;
  }, []);
};

const getResourceKey = (row: iSynDocumentClassificationPermissionRow) => [
  row.ResourceType,
  row.Resource1,
  row.Resource2,
  row.Resource3,
  row.CanRead,
  row.CanUpdate,
  row.CanInsert,
  row.CanDelete,
].join('|');

const Wrapper = styled.div`
  .table-striped > tbody > tr > td.user-group-cell,
  .table-striped > tbody > tr > td.resource-permission-cell {
    --bs-table-bg-type: transparent !important;
  }

  .table-hover > tbody > tr:hover > td.user-group-cell,
  .table-hover > tbody > tr:hover > td.resource-permission-cell {
    --bs-table-bg-state: transparent !important;
  }
`;

const DocumentClassificationPermissionsTable = ({
  classificationCode,
  excludedUserIds = EMPTY_EXCLUDED_USER_IDS,
}: iDocumentClassificationPermissionsTable) => {
  const [rows, setRows] = useState<iSynDocumentClassificationPermissionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<iTableColumn<iSynDocumentClassificationPermissionRow>[]>(() => [
    {
      key: 'UserGroupCode',
      header: 'User Group',
      cell: (column, row) => !row.UserGroupRowSpan ? null : (
        <td key={column.key} rowSpan={row.UserGroupRowSpan} className={'user-group-cell'}>
          {row.UserGroupCode}
          <div><small>{row.UserGroupDescription}</small></div>
        </td>
      ),
    },
    {
      key: 'Resources',
      header: 'Resources',
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'resource-permission-cell'}>
          {[row.Resource1, row.Resource2, row.Resource3]
            .filter(Boolean)
            .map((resource, index) => <div key={`${resource}-${index}`}>{resource}</div>)}
        </td>
      ),
    },
    {
      key: 'CanRead',
      header: centeredHeader('Can Read'),
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'text-center resource-permission-cell'}>
          {permissionIcon(row.CanRead)}
        </td>
      ),
    },
    {
      key: 'CanUpdate',
      header: centeredHeader('Can Update'),
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'text-center resource-permission-cell'}>
          {permissionIcon(row.CanUpdate)}
        </td>
      ),
    },
    {
      key: 'CanInsert',
      header: centeredHeader('Can Insert'),
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'text-center resource-permission-cell'}>
          {permissionIcon(row.CanInsert)}
        </td>
      ),
    },
    {
      key: 'CanDelete',
      header: centeredHeader('Can Delete'),
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'text-center resource-permission-cell'}>
          {permissionIcon(row.CanDelete)}
        </td>
      ),
    },
    {
      key: 'NumberOfUsers',
      header: centeredHeader('No. Of Users'),
      cell: (column, row) => !row.ResourceRowSpan ? null : (
        <td key={column.key} rowSpan={row.ResourceRowSpan} className={'text-center resource-permission-cell'}>
          {row.ResourceRowSpan}
        </td>
      ),
    },
    {key: 'LoginName', header: 'LoginName', cell: (_, row) => row.LoginName},
    {
      key: 'User',
      header: 'User',
      cell: (column, row) => (
        <td key={column.key}>
          {[row.Preferred, row.Surname].filter(Boolean).join(' ')}
          <div><small>{row.ID}</small></div>
        </td>
      ),
    },
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

    const resourceWhere = {
      ResourceType: SynConfigResourceTypes.DocumentClassification,
      [OP_OR]: [
        {Resource1: classificationCode},
        {Resource2: classificationCode},
        {Resource3: classificationCode},
      ],
    };

    SynVConfigGroupResourcesAllService.getAll({
      where: JSON.stringify(resourceWhere),
      perPage: 9999,
    })
      .then(async groupResourceResult => {
        const groupResources = (groupResourceResult.data || []).filter(resource =>
          resource.SelectFlag || resource.UpdateFlag || resource.InsertFlag || resource.DeleteFlag
        );
        const groupCodes = groupResources.map(resource => resource.GroupCode);

        if (groupCodes.length <= 0) return [];

        const [userGroupResult, configGroupResult] = await Promise.all([
          SynConfigUserGroupService.getAll({
            where: JSON.stringify({GroupCode: groupCodes}),
            perPage: 9999,
          }),
          SynLuConfigGroupService.getAll({
            where: JSON.stringify({Code: groupCodes}),
            perPage: 9999,
          }),
        ]);
        const memberships = userGroupResult.data || [];
        const membershipLoginNames = new Set(
          memberships.map(membership => membership.LoginName.toLowerCase())
        );

        if (membershipLoginNames.size <= 0) return [];

        const configUserResult = await SynConfigUserService.getAll({perPage: 9999});
        const excludedUserIdSet = new Set(excludedUserIds);
        const configUsers = (configUserResult.data || []).filter(user =>
          membershipLoginNames.has(user.LoginName.toLowerCase()) &&
          !excludedUserIdSet.has(user.ID)
        );
        const ids = configUsers.map(user => user.ID);

        const idChunks = chunk(ids);
        const [communityResults, staffResults] = await Promise.all([
          Promise.all(idChunks.map(idChunk => SynCommunityService.getCommunityProfiles({
              where: JSON.stringify({ID: idChunk}),
              perPage: 9999,
            })
          )),
          Promise.all(idChunks.map(idChunk => SynVStaffService.getStaffList({
            where: JSON.stringify({StaffID: idChunk}),
          }))),
        ]);
        const communities = communityResults.flatMap(result => result.data || []);
        const staff = staffResults.flat();

        const resourcesByGroup = groupResources.reduce<{[key: string]: typeof groupResources}>(
          (map, resource) => ({
            ...map,
            [resource.GroupCode]: [...(map[resource.GroupCode] || []), resource],
          }),
          {}
        );
        const usersByLogin = configUsers.reduce<{[key: string]: typeof configUsers[number]}>(
          (map, user) => ({...map, [user.LoginName.toLowerCase()]: user}),
          {}
        );
        const groupDescriptions = (configGroupResult.data || []).reduce<{[key: string]: string}>(
          (map, group) => ({...map, [group.Code]: group.Description}),
          {}
        );
        const communitiesById = communities.reduce<{[key: number]: any}>(
          (map, community) => ({...map, [community.ID]: community}),
          {}
        );
        const activeStaffIds = new Set(
          (staff || []).filter(record => record.ActiveFlag).map(record => record.StaffID)
        );

        return memberships.flatMap(membership => {
          const user = usersByLogin[membership.LoginName.toLowerCase()];
          if (!user) return [];
          const community = communitiesById[user.ID];

          return (resourcesByGroup[membership.GroupCode] || []).map(resource => ({
            ClassificationCode: classificationCode,
            ClassificationDescription: resource.Description || '',
            UserGroupCode: membership.GroupCode,
            UserGroupDescription: groupDescriptions[membership.GroupCode] || '',
            LoginName: membership.LoginName,
            Preferred: community?.Preferred || community?.Given1 || '',
            Surname: community?.Surname || '',
            ID: user.ID,
            ActiveStaff: activeStaffIds.has(user.ID),
            ResourceType: resource.ResourceType,
            Resource1: resource.Resource1,
            Resource2: resource.Resource2,
            Resource3: resource.Resource3,
            CanRead: resource.SelectFlag === true,
            CanUpdate: resource.UpdateFlag === true,
            CanInsert: resource.InsertFlag === true,
            CanDelete: resource.DeleteFlag === true,
          }));
        });
      })
      .then(permissionRows => {
        if (isCancelled) return;
        const sortedRows = [...permissionRows].sort((rowA, rowB) => {
          const classificationOrder = rowA.ClassificationCode.localeCompare(
            rowB.ClassificationCode,
            undefined,
            {sensitivity: 'base'}
          );
          if (classificationOrder !== 0) return classificationOrder;

          const groupOrder = rowA.UserGroupCode.localeCompare(
            rowB.UserGroupCode,
            undefined,
            {sensitivity: 'base'}
          );
          if (groupOrder !== 0) return groupOrder;

          const resourceOrder = getResourceKey(rowA).localeCompare(
            getResourceKey(rowB),
            undefined,
            {sensitivity: 'base'}
          );
          if (resourceOrder !== 0) return resourceOrder;

          const userA = `${rowA.Preferred} ${rowA.Surname}`.trim();
          const userB = `${rowB.Preferred} ${rowB.Surname}`.trim();
          const userOrder = userA.localeCompare(userB, undefined, {sensitivity: 'base'});
          return userOrder !== 0 ? userOrder : rowA.ID - rowB.ID;
        });

        setRows(sortedRows.map((row, index) => {
          const isFirstUserGroupRow = index === 0 ||
            sortedRows[index - 1].ClassificationCode !== row.ClassificationCode ||
            sortedRows[index - 1].UserGroupCode !== row.UserGroupCode;
          const isFirstResourceRow = isFirstUserGroupRow ||
            getResourceKey(sortedRows[index - 1]) !== getResourceKey(row);

          return {
            ...row,
            UserGroupRowSpan: isFirstUserGroupRow
              ? sortedRows.filter(candidate =>
                candidate.ClassificationCode === row.ClassificationCode &&
                candidate.UserGroupCode === row.UserGroupCode
              ).length
              : undefined,
            ResourceRowSpan: isFirstResourceRow
              ? sortedRows.filter(candidate =>
                candidate.ClassificationCode === row.ClassificationCode &&
                candidate.UserGroupCode === row.UserGroupCode &&
                getResourceKey(candidate) === getResourceKey(row)
              ).length
              : undefined,
          };
        }));
      })
      .catch(err => {
        if (isCancelled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [classificationCode, excludedUserIds]);

  const totalUsers = new Set(rows.map(row => row.ID)).size;

  return (
    <Wrapper>
      <h5 className={'mt-3'}>Total Users: {totalUsers}</h5>
      <Table
        rows={rows}
        columns={columns}
        isLoading={isLoading}
        responsive
        striped
        hover
        size={'sm'}
      />
    </Wrapper>
  );
};

export default DocumentClassificationPermissionsTable;
