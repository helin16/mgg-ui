import {
  iTableColumn,
  TABLE_COLUMN_FORMAT_BOOLEAN,
  TABLE_COLUMN_FORMAT_CALCULATED,
  TABLE_COLUMN_FORMAT_DATE
} from "../../common/Table";
import iVStaff from "../../../types/Synergetic/iVStaff";
import moment from "moment-timezone";
import iSynStaffJobPosition from "../../../types/Synergetic/Staff/iSynStaffJobPosition";
import iSynCommunitySkill from "../../../types/Synergetic/Community/iSynCommunitySkill";
import iSynLuSkill from "../../../types/Synergetic/Lookup/iSynLuSkill";
import iSynJobPosition from "../../../types/Synergetic/Staff/iSynJobPosition";

export type iStaffJobPositionMap = { [key: number]: iSynStaffJobPosition[] };
export type iCommunitySkillMap = { [key: number]: iSynCommunitySkill[] };
export type iPositionStaffIdMap = { [key: number]: number[] };
export type iStaffMap = { [key: number]: iVStaff };

export type iGetListColumns = {
  luSkills: iSynLuSkill[];
  staffJobPosMap: iStaffJobPositionMap;
  skillMap: iCommunitySkillMap;
  staffMap: iStaffMap;
  positionStaffIdMap: iPositionStaffIdMap;
};

const getJobPositionFromMap = (
  staff: iVStaff,
  staffJobPosMap: iStaffJobPositionMap
) => {
  return staff.StaffID in staffJobPosMap ? staffJobPosMap[staff.StaffID] : [];
};

const getReportsToPosFromJobPosition = (
  jobPos: iSynStaffJobPosition
): iSynJobPosition | null | undefined => {
  if (
    !jobPos.OverrideReportsToJobPosition &&
    !jobPos.SynJobPosition?.ReportsToJobPosition
  ) {
    return null;
  }

  if (jobPos.OverrideReportsToJobPosition) {
    return jobPos.OverrideReportsToJobPosition;
  }
  return jobPos.SynJobPosition?.ReportsToJobPosition;
};

const getReportsToStaffsFromJobPosition = (
  reportsPosition: iSynJobPosition,
  positionStaffIdMap: iPositionStaffIdMap,
  staffMap: iStaffMap
): iVStaff[] => {
  const reportsToJobPosSeq = Number(reportsPosition?.JobPositionsSeq || 0);
  if (!(reportsToJobPosSeq in positionStaffIdMap)) {
    return [];
  }
  // @ts-ignore
  return positionStaffIdMap[reportsToJobPosSeq]
    .map(staffId => {
      if (!(staffId in staffMap)) {
        return null;
      }
      return staffMap[staffId];
    })
    .filter(staff => staff !== null);
};

export const COLUMN_KEY_PREFIX_JP = 'JP-';
export const COLUMN_KEY_PREFIX_JP_POS = 'JP-POS-';
export const COLUMN_KEY_PREFIX_JP_REPORTS_TO = 'JP-RPT-TO-';
export const COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF = 'JP-RPT-TO-STAFF-';
export const COLUMN_GROUP_JOB_POSITION = 'Job Position';
export const COLUMN_GROUP_SKILL_EXPIRY_DATE = 'Skill Expiry Date';

const getListColumns = ({
  luSkills,
}: iGetListColumns): iTableColumn[] => [
  {
    isDefault: true,
    key: "StaffID",
    header: "Staff ID",
    isSelectable: false,
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffID}`
  },
  {
    isDefault: true,
    key: "StaffNameInternal",
    header: "Staff Name",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffNameInternal}`
  },
  {
    isDefault: true,
    key: "SchoolStaffCode",
    header: "Staff Code",
    cell: (column: iTableColumn, data: iVStaff) => `${data.SchoolStaffCode}`
  },
  {
    key: "StaffGiven1",
    header: "Given Name",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffGiven1}`
  },
  {
    key: "StaffGiven2",
    header: "Given Name 2",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffGiven2}`
  },
  {
    key: "StaffSurname",
    header: "Surname",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffSurname}`
  },
  {
    key: "StaffCategory",
    header: "Category Code",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffCategory}`
  },
  {
    isDefault: true,
    key: "StaffDepartment",
    header: "Department",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffDepartment}`
  },
  {
    isDefault: true,
    key: "StaffCategoryDescription",
    header: "Category Description",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${data.StaffCategoryDescription}`
  },
  {
    key: "StaffCategoryType",
    header: "Category Type",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffCategoryType}`
  },
  {
    isDefault: true,
    key: "StaffOccupEmail",
    header: "Occup. Email",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffOccupEmail}`
  },
  {
    key: "StaffCampus",
    header: "Campus Code",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffCampus}`
  },
  {
    key: "StaffCampusDescription",
    header: "Campus",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${data.StaffCampusDescription}`
  },
  {
    key: "ActiveFlag",
    header: "Active Flag",
    format: TABLE_COLUMN_FORMAT_BOOLEAN,
    cell: (column: iTableColumn, data: iVStaff) =>
      `${data.ActiveFlag === true ? "Y" : "N"}`
  },
  {
    key: "StartDate",
    header: "Start Date",
    format: TABLE_COLUMN_FORMAT_DATE,
    cell: (column: iTableColumn, data: iVStaff) =>
      `${
        `${data.StartDate || ""}`.trim() === ""
          ? ""
          : moment(`${data.StartDate || ""}`.trim()).format("DD/MM/YYYY")
      }`
  },
  {
    key: "LeavingDate",
    header: "Leaving Date",
    format: TABLE_COLUMN_FORMAT_DATE,
    cell: (column: iTableColumn, data: iVStaff) =>
      `${
        `${data.LeavingDate || ""}`.trim() === ""
          ? ""
          : moment(`${data.LeavingDate || ""}`.trim()).format("DD/MM/YYYY")
      }`
  },
  {
    key: "ServicedYears",
    header: "Serviced Years",
    format: TABLE_COLUMN_FORMAT_CALCULATED,
    cell: (column: iTableColumn, data: iVStaff) => {
      return `${
        `${data.StartDate || ""}`.trim() === ""
          ? ""
          : Math.abs(moment(`${data.StartDate || ""}`.trim()).diff(moment(),'year'))
      }`
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_POS}JobPositionCode`,
    header: "Position Code",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_POS}Description`,
    header: "Position Description",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}StartDate`,
    header: "Position Start",
    group: COLUMN_GROUP_JOB_POSITION,
    format: TABLE_COLUMN_FORMAT_DATE,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}EndDate`,
    header: "Position End",
    group: COLUMN_GROUP_JOB_POSITION,
    format: TABLE_COLUMN_FORMAT_DATE,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}FTE`,
    header: "FTE",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}AwardLevelCode`,
    header: "Current Level",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO}JobPositionCode`,
    header: "Reports To Position Code",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO}Description`,
    header: "Reports To Position",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF}StaffNameInternal`,
    header: "Reports To",
    group: COLUMN_GROUP_JOB_POSITION,
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF}StaffOccupEmail`,
    header: "Reports To Email",
    group: COLUMN_GROUP_JOB_POSITION,
  },

  ...luSkills.map(luSkill => {
    return {
      key: `Expiry-${luSkill.Code}`,
      header: luSkill.Code,
      name: `${luSkill.Code} - ${luSkill.Description}`,
      group: COLUMN_GROUP_SKILL_EXPIRY_DATE,
    };
  })
];


const StaffListHelper = {
  getJobPositionFromMap,
  getReportsToPosFromJobPosition,
  getReportsToStaffsFromJobPosition,
  getListColumns,
};

export default StaffListHelper;
