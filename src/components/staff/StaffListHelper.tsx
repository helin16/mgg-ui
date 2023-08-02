import {iTableColumn} from '../common/Table';
import iVStaff from '../../types/Synergetic/iVStaff';
import moment from 'moment-timezone';
import iSynStaffJobPosition from '../../types/Synergetic/Staff/iSynStaffJobPosition';

export type iJobPositionMap = {[key: number]: iSynStaffJobPosition[]};
const getListColumns = (jobPosMap: iJobPositionMap): iTableColumn[] => [{
  isDefault: true,
  key: 'ID',
  header: 'Staff ID',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffID}</td>
  }
}, {
  isDefault: true,
  key: 'name',
  header: 'Staff Name',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffNameInternal}</td>
  }
}, {
  isDefault: true,
  key: 'code',
  header: 'Staff Code',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.SchoolStaffCode}</td>
  }
}, {
  key: 'GivenName',
  header: 'Given Name',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffGiven1}</td>
  }
}, {
  key: 'GivenName2',
  header: 'Given Name 2',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffGiven2}</td>
  }
}, {
  key: 'Surname',
  header: 'Surname',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffSurname}</td>
  }
}, {
  key: 'CategoryCode',
  header: 'Category Code',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffCategory}</td>
  }
}, {
  isDefault: true,
  key: 'CategoryDescription',
  header: 'Category Description',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffCategoryDescription}</td>
  }
}, {
  key: 'CategoryType',
  header: 'Category Type',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffCategoryType}</td>
  }
}, {
  isDefault: true,
  key: 'OccupEmail',
  header: 'Occup. Email',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffOccupEmail}</td>
  }
}, {
  key: 'Campus Code',
  header: 'Campus Code',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffCampus}</td>
  }
}, {
  key: 'Campus Description',
  header: 'Campus Descr.',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.StaffCampusDescription}</td>
  }
}, {
  key: 'ActiveFlag',
  header: 'Is Active',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{data.ActiveFlag === true ? 'Y' : 'N'}</td>
  }
}, {
  key: 'StartDate',
  header: 'Start Date',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{`${data.StartDate || ''}`.trim() === '' ? '' : moment(`${data.StartDate || ''}`.trim()).format('DD/MM/YYYY')}</td>
  }
}, {
  key: 'EndDate',
  header: 'Leaving Date',
  cell: (column: iTableColumn, data: iVStaff) => {
    return <td key={column.key}>{`${data.LeavingDate || ''}`.trim() === '' ? '' : moment(`${data.LeavingDate || ''}`.trim()).format('DD/MM/YYYY')}</td>
  }
}, {
  isDefault: true,
  key: 'JobPositionDescription',
  header: 'Job Position Description',
  cell: (column: iTableColumn, data: iVStaff) => {
    const jobPositions = data.StaffID in jobPosMap ? jobPosMap[data.StaffID] : []
    return <td key={column.key} className={'job-pos-col'}>{jobPositions.map((jobPosition, index) => {
      return <div key={index}>{jobPosition.SynJobPosition?.Description || ''}</div>;
    })}</td>
  }
}, {
  isDefault: true,
  key: 'FTE',
  header: 'FTE',
  cell: (column: iTableColumn, data: iVStaff) => {
    const jobPositions = data.StaffID in jobPosMap ? jobPosMap[data.StaffID] : []
    return <td key={column.key} className={'job-pos-col'}>{jobPositions.map((jobPosition, index) => {
      return <div key={index}>{jobPosition.FTE}</div>;
    })}</td>
  }
}, {
  isDefault: true,
  key: 'CurrentLevel',
  header: 'Current Level',
  cell: (column: iTableColumn, data: iVStaff) => {
    const jobPositions = data.StaffID in jobPosMap ? jobPosMap[data.StaffID] : []
    return <td key={column.key} className={'job-pos-col'}>{jobPositions.map((jobPosition, index) => {
      return <div key={index} dangerouslySetInnerHTML={{ __html: jobPosition.AwardLevelCode || '&nbsp;'}} />;
    })}</td>
  }
}];

// select distinct
// sf.StaffID,
//   sf.StaffPreferred,
//   sf.StaffSurname,
//   sf.StaffDepartment,
//   sf.StaffCategory,
//   sf.StaffCategoryDescription,
//   sf.StaffOccupEmail,
//   sf.StaffCampus,
//   sf.StaffCampusDescription,
//   sf.StartDate,
//   sf.LeavingDate,
//   vPos.Position as JobPositionDescription,
//   vPos.FTE,
//   vPos.AwardLevelCode as 'Current Level',
// ss.*,
//   vPos.ReportsTo,
//   vPos.ReportsToPosition,
//   vPos.Reports_To_Email
// from vStaff sf
// --left join uvCurrentStaffListWithManager cslwm on (cslwm.StaffID = sf.StaffID)
// left join uvCurrentStaffListWithManager vPos on (vPos.StaffID = sf.StaffID and vPos.Active = 1)
// left join (
//   select *
//   from (
//     select ID, SkillCode, format(max(expirydate), 'dd/MM/yyyy') as Expiring from CommunitySkills where skillcode in ('FIRST AID 2','ANAPHCERT','CPR','ASTHMA','EPIL','ANAPHBRIEF','DIABETESIS',  'PCHIL') group by ID, SkillCode
// ) as tmpSkills
// PIVOT
// (
//   MAX(Expiring)
// FOR SkillCode IN ([FIRST AID 2] , [ANAPHCERT], [CPR],[ASTHMA],[EPIL],[ANAPHBRIEF],[DIABETESIS], [PCHIL])
// ) AS StaffTrainPivot
// ) ss  on ID = sf.StaffID
//
// where sf.ActiveFlag = 1

const StaffListHelper = {
  getListColumns,
}

export default StaffListHelper;
