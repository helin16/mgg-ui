import { iTableColumn } from "../../common/Table";
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

type iGetListColumns = {
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

const getListColumns = ({
  luSkills,
  staffJobPosMap,
  skillMap,
  positionStaffIdMap,
  staffMap
}: iGetListColumns): iTableColumn[] => [
  {
    isDefault: true,
    key: "ID",
    header: "Staff ID",
    isSelectable: false,
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffID}`
  },
  {
    isDefault: true,
    key: "name",
    header: "Staff Name",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffNameInternal}`
  },
  {
    isDefault: true,
    key: "code",
    header: "Staff Code",
    cell: (column: iTableColumn, data: iVStaff) => `${data.SchoolStaffCode}`
  },
  {
    key: "GivenName",
    header: "Given Name",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffGiven1}`
  },
  {
    key: "GivenName2",
    header: "Given Name 2",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffGiven2}`
  },
  {
    key: "Surname",
    header: "Surname",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffSurname}`
  },
  {
    key: "CategoryCode",
    header: "Category Code",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffCategory}`
  },
  {
    isDefault: true,
    key: "DepartmentCode",
    header: "Department",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffDepartment}`
  },
  {
    isDefault: true,
    key: "CategoryDescription",
    header: "Category Description",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${data.StaffCategoryDescription}`
  },
  {
    key: "CategoryType",
    header: "Category Type",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffCategoryType}`
  },
  {
    isDefault: true,
    key: "OccupEmail",
    header: "Occup. Email",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffOccupEmail}`
  },
  {
    key: "Campus Code",
    header: "Campus Code",
    cell: (column: iTableColumn, data: iVStaff) => `${data.StaffCampus}`
  },
  {
    key: "Campus Description",
    header: "Campus Descr.",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${data.StaffCampusDescription}`
  },
  {
    key: "ActiveFlag",
    header: "Is Active",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${data.ActiveFlag === true ? "Y" : "N"}`
  },
  {
    key: "StartDate",
    header: "Start Date",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${
        `${data.StartDate || ""}`.trim() === ""
          ? ""
          : moment(`${data.StartDate || ""}`.trim()).format("DD/MM/YYYY")
      }`
  },
  {
    key: "EndDate",
    header: "Leaving Date",
    cell: (column: iTableColumn, data: iVStaff) =>
      `${
        `${data.LeavingDate || ""}`.trim() === ""
          ? ""
          : moment(`${data.LeavingDate || ""}`.trim()).format("DD/MM/YYYY")
      }`
  },
  {
    key: "JobPositionCode",
    header: "Position Code",
    group: "Job Position",
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
    key: "JobPositionDescription",
    header: "Position Description",
    group: "Job Position",
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
    key: "JobPositionAwardLevelCode",
    header: "Award Level Code",
    group: "Job Position",
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions = getJobPositionFromMap(data, staffJobPosMap);
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            const string = jobPosition.AwardLevelCode || "&nbsp;";
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
    key: "JobPositionStartDate",
    header: "Position Start",
    group: "Job Position",
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
    key: "JobPositionEndDate",
    header: "Position End",
    group: "Job Position",
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
    key: "FTE",
    header: "FTE",
    group: "Job Position",
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
    key: "CurrentLevel",
    header: "Current Level",
    group: "Job Position",
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
    key: "ReportsToPositionCode",
    header: "Reports To Position Code",
    group: "Job Position",
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
    key: "ReportsToPosition",
    header: "Reports To Position",
    group: "Job Position",
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
    key: "ReportsTo",
    header: "Reports To",
    group: "Job Position",
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
    key: "ReportsToEmail",
    header: "Reports To Email",
    group: "Job Position",
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
      group: "Skill Expiry Date",
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
  getListColumns,
  genExportFile
};

export default StaffListHelper;
