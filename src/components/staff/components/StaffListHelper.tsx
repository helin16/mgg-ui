import {iTableColumn, TABLE_COLUMN_FORMAT_BOOLEAN, TABLE_COLUMN_FORMAT_DATE} from "../../common/Table";
import iVStaff from "../../../types/Synergetic/iVStaff";
import moment from "moment-timezone";
import iSynStaffJobPosition from "../../../types/Synergetic/Staff/iSynStaffJobPosition";
import iSynCommunitySkill from "../../../types/Synergetic/Community/iSynCommunitySkill";
import iSynLuSkill from "../../../types/Synergetic/Lookup/iSynLuSkill";
import iSynJobPosition from "../../../types/Synergetic/Staff/iSynJobPosition";
import * as XLSX from 'sheetjs-style';
import * as _ from 'lodash';
import MathHelper from '../../../helper/MathHelper';

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
  staffJobPosMap,
  skillMap,
  positionStaffIdMap,
  staffMap
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
    key: `${COLUMN_KEY_PREFIX_JP_POS}JobPositionCode`,
    header: "Position Code",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const code =
              jobPosition.SynJobPosition?.JobPositionCode || "&nbsp;";
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: code
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_POS}Description`,
    header: "Position Description",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const string = jobPosition.SynJobPosition?.Description || "&nbsp;";
            return (
              <div
                key={index}
                title={string}
                dangerouslySetInnerHTML={{
                  __html: string
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}StartDate`,
    header: "Position Start",
    group: COLUMN_GROUP_JOB_POSITION,
    format: TABLE_COLUMN_FORMAT_DATE,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const string =
              `${jobPosition.StartDate || ""}`.trim() === ""
                ? "&nbsp;"
                : moment(`${jobPosition.StartDate || ""}`.trim()).format(
                    "DD/MM/YYYY"
                  );
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: string
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}EndDate`,
    header: "Position End",
    group: COLUMN_GROUP_JOB_POSITION,
    format: TABLE_COLUMN_FORMAT_DATE,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const className =
              `${jobPosition.EndDate || ""}`.trim() === ""
                ? ""
                : moment(`${jobPosition.EndDate}`).isBefore(moment())
                ? "bg-danger text-white"
                : "";
            const string =
              `${jobPosition.EndDate || ""}`.trim() === ""
                ? "&nbsp;"
                : moment(`${jobPosition.EndDate || ""}`.trim()).format(
                    "DD/MM/YYYY"
                  );
            return (
              <div
                key={index}
                className={className}
                dangerouslySetInnerHTML={{
                  __html: string
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}FTE`,
    header: "FTE",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: `${jobPosition.FTE || "&nbsp;"}`
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP}AwardLevelCode`,
    header: "Current Level",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: jobPosition.AwardLevelCode || "&nbsp;"
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO}JobPositionCode`,
    header: "Reports To Position Code",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const reportsPosition = getReportsToPosFromJobPosition(jobPosition);
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: `${reportsPosition?.JobPositionCode || "&nbsp;"}`
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO}Description`,
    header: "Reports To Position",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const reportsPosition = getReportsToPosFromJobPosition(jobPosition);
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: `${reportsPosition?.Description || "&nbsp;"}`
                }}
              />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF}StaffNameInternal`,
    header: "Reports To",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const reportsPosition = getReportsToPosFromJobPosition(jobPosition);
            let string = "&nbsp;";
            if (reportsPosition) {
              const reportsToStaffs = getReportsToStaffsFromJobPosition(
                reportsPosition,
                positionStaffIdMap,
                staffMap
              );
              string = reportsToStaffs
                .map(staff => `${staff.StaffNameInternal || ""}`.trim())
                .filter(name => name !== "")
                .join(" & ");
            }
            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: string }} />
            );
          })}
        </td>
      );
    }
  },
  {
    key: `${COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF}StaffOccupEmail`,
    header: "Reports To Email",
    group: COLUMN_GROUP_JOB_POSITION,
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const reportsPosition = getReportsToPosFromJobPosition(jobPosition);
            let string = "&nbsp;";
            if (reportsPosition) {
              const reportsToStaffs = getReportsToStaffsFromJobPosition(
                reportsPosition,
                positionStaffIdMap,
                staffMap
              );
              string = reportsToStaffs
                .map(staff => `${staff.StaffOccupEmail || ""}`.trim())
                .filter(name => name !== "")
                .join(" & ");
            }
            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: string }} />
            );
          })}
        </td>
      );
    }
  },

  ...luSkills.map(luSkill => {
    return {
      key: `Expiry-${luSkill.Code}`,
      header: luSkill.Code,
      name: `${luSkill.Code} - ${luSkill.Description}`,
      group: COLUMN_GROUP_SKILL_EXPIRY_DATE,
      cell: (column: iTableColumn, data: iVStaff) => {
        const communitySkills = (data.StaffID in skillMap
          ? skillMap[data.StaffID]
          : []
        ).filter(
          communitySkill =>
            `${communitySkill.SkillCode}`.trim() === `${luSkill.Code}`.trim()
        );

        if (communitySkills.length <= 0) {
          return <td key={column.key}></td>;
        }
        const latest = communitySkills.sort((skill1, skill2) =>
          `${skill1.ExpiryDate || ""}` > `${skill2.ExpiryDate || ""}` ? -1 : 1
        );

        const className =
          `${latest[0].ExpiryDate || ""}`.trim() === ""
            ? ""
            : moment(`${latest[0].ExpiryDate}`).isBefore(moment())
            ? "bg-danger text-white"
            : "";

        return (
          <td key={column.key} className={className}>
            {`${latest[0].ExpiryDate || ""}`.trim() === ""
              ? ""
              : moment(`${latest[0].ExpiryDate}`).format("DD/MM/YYYY")}
          </td>
        );
      }
    };
  })
];

const genExportFile = (selectedColumns: iTableColumn[], data: iVStaff[], getColMaps: iGetListColumns) => {
  const titleRows: string[][] = [selectedColumns.map(col => {
    return typeof col.header !== 'function' ? `${col.header}` : `${col.key}`
  })];

  let rowIndex = 0;
  const rows: string[][] = [];
  data.forEach(staff => {
    const row: string[] = [];
    selectedColumns.forEach(col => {
      if (typeof col.cell !== 'function') {
        row.push('');
        return;
      }
      const cell = col.cell(col, staff);
      if (typeof cell === 'string') {
        row.push(`${cell}`);
        return;
      }

      return '';
    })
    rows.push(row);
    rowIndex = MathHelper.add(rowIndex, 1);
  });


  const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

  _.range(0, selectedColumns.length).forEach(colIndex => {
    const colRef = XLSX.utils.encode_col(colIndex);
    ws[`${colRef}1`].s = {
      font: { sz: 12, bold: true, color: { rgb: "FFFFFF" } },
      fill: {
        fgColor: { rgb: '0066ff' }, // RGB color code, e.g., 'FFFF00' for yellow
        patternType: 'solid',
      },
    }
  })

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `Staff_list_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}

const StaffListHelper = {
  getJobPositionFromMap,
  getReportsToPosFromJobPosition,
  getReportsToStaffsFromJobPosition,
  getListColumns,
  genExportFile
};

export default StaffListHelper;
