import { iTableColumn } from "../common/Table";
import iVStaff from "../../types/Synergetic/iVStaff";
import moment from "moment-timezone";
import iSynStaffJobPosition from "../../types/Synergetic/Staff/iSynStaffJobPosition";
import iSynCommunitySkill from "../../types/Synergetic/Community/iSynCommunitySkill";
import iSynLuSkill from "../../types/Synergetic/Lookup/iSynLuSkill";

export type iJobPositionMap = { [key: number]: iSynStaffJobPosition[] };
export type iCommunitySkillMap = { [key: number]: iSynCommunitySkill[] };

type iGetListColumns = {
  luSkills: iSynLuSkill[];
  jobPosMap: iJobPositionMap;
  skillMap: iCommunitySkillMap;
};
const getListColumns = ({
  luSkills,
  jobPosMap,
  skillMap
}: iGetListColumns): iTableColumn[] => [
  {
    isDefault: true,
    key: "ID",
    header: "Staff ID",
    isSelectable: false,
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffID}</td>;
    }
  },
  {
    isDefault: true,
    key: "name",
    header: "Staff Name",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffNameInternal}</td>;
    }
  },
  {
    isDefault: true,
    key: "code",
    header: "Staff Code",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.SchoolStaffCode}</td>;
    }
  },
  {
    key: "GivenName",
    header: "Given Name",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffGiven1}</td>;
    }
  },
  {
    key: "GivenName2",
    header: "Given Name 2",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffGiven2}</td>;
    }
  },
  {
    key: "Surname",
    header: "Surname",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffSurname}</td>;
    }
  },
  {
    key: "CategoryCode",
    header: "Category Code",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffCategory}</td>;
    }
  },
  {
    isDefault: true,
    key: "DepartmentCode",
    header: "Department",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffDepartment}</td>;
    }
  },
  {
    isDefault: true,
    key: "CategoryDescription",
    header: "Category Description",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffCategoryDescription}</td>;
    }
  },
  {
    key: "CategoryType",
    header: "Category Type",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffCategoryType}</td>;
    }
  },
  {
    isDefault: true,
    key: "OccupEmail",
    header: "Occup. Email",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffOccupEmail}</td>;
    }
  },
  {
    key: "Campus Code",
    header: "Campus Code",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffCampus}</td>;
    }
  },
  {
    key: "Campus Description",
    header: "Campus Descr.",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.StaffCampusDescription}</td>;
    }
  },
  {
    key: "ActiveFlag",
    header: "Is Active",
    cell: (column: iTableColumn, data: iVStaff) => {
      return <td key={column.key}>{data.ActiveFlag === true ? "Y" : "N"}</td>;
    }
  },
  {
    key: "StartDate",
    header: "Start Date",
    cell: (column: iTableColumn, data: iVStaff) => {
      return (
        <td key={column.key}>
          {`${data.StartDate || ""}`.trim() === ""
            ? ""
            : moment(`${data.StartDate || ""}`.trim()).format("DD/MM/YYYY")}
        </td>
      );
    }
  },
  {
    key: "EndDate",
    header: "Leaving Date",
    cell: (column: iTableColumn, data: iVStaff) => {
      return (
        <td key={column.key}>
          {`${data.LeavingDate || ""}`.trim() === ""
            ? ""
            : moment(`${data.LeavingDate || ""}`.trim()).format("DD/MM/YYYY")}
        </td>
      );
    }
  },
  {
    key: "JobPositionDescription",
    header: "Job Position Description",
    group: "Job Position",
    cell: (column: iTableColumn, data: iVStaff) => {
      const jobPositions =
        data.StaffID in jobPosMap ? jobPosMap[data.StaffID] : [];
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            return (
              <div key={index}>
                {jobPosition.SynJobPosition?.Description || ""}
              </div>
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
      const jobPositions =
        data.StaffID in jobPosMap ? jobPosMap[data.StaffID] : [];
      return (
        <td key={column.key} className={"job-pos-col"}>
          {jobPositions.map((jobPosition, index) => {
            return <div key={index}>{jobPosition.FTE}</div>;
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
      const jobPositions =
        data.StaffID in jobPosMap ? jobPosMap[data.StaffID] : [];
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
  ...luSkills.map(luSkill => {
    return {
      key: `Expiry-${luSkill.Code}`,
      header: luSkill.Code,
      group: "Skill Expiry Date",
      cell: (column: iTableColumn, data: iVStaff) => {
        const communitySkills =
          (data.StaffID in skillMap ? skillMap[data.StaffID] : [])
          .filter(communitySkill => `${communitySkill.SkillCode}`.trim() === `${luSkill.Code}`.trim());

        if (communitySkills.length <= 0) {
          return <td key={column.key}></td>;
        }
        const latest = communitySkills
          .sort((skill1, skill2) =>
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

const StaffListHelper = {
  getListColumns
};

export default StaffListHelper;
