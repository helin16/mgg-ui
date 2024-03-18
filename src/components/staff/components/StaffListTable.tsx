import styled from "styled-components";
import {
  iTableColumn,
  TABLE_COLUMN_FORMAT_BOOLEAN, TABLE_COLUMN_FORMAT_CALCULATED,
  TABLE_COLUMN_FORMAT_DATE
} from "../../common/Table";
import { useEffect, useState } from "react";
import ReactTableWithFixedColumns from "../../common/ReactTableWithFixedColumns";
import iVStaff from "../../../types/Synergetic/iVStaff";
import moment from "moment-timezone";
import StaffListHelper, {
  COLUMN_GROUP_JOB_POSITION,
  COLUMN_GROUP_SKILL_EXPIRY_DATE,
  COLUMN_KEY_PREFIX_JP,
  COLUMN_KEY_PREFIX_JP_POS,
  COLUMN_KEY_PREFIX_JP_REPORTS_TO, COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF,
  iGetListColumns
} from "./StaffListHelper";
import iSynStaffJobPosition from '../../../types/Synergetic/Staff/iSynStaffJobPosition';

const Wrapper = styled.div`
  .td {
    .skill-expiry-date {
      height: calc(100% + 10px);
      margin: -5px;
      padding: 5px;
    }
  }
`;

type iStaffListTable = iGetListColumns & {
  tableHtmlId?: string;
  className?: string;
  selectedColumns: iTableColumn[];
  staffList: iVStaff[];
};
const StaffListTable = ({
  tableHtmlId,
  selectedColumns,
  staffList,
  className,
  skillMap,
  staffJobPosMap,
  positionStaffIdMap,
  staffMap,
}: iStaffListTable) => {
  const [columns, setColumns] = useState<any[]>([]);
  const [hasJPColumns, setHasJPColumns] = useState(false);

  const getDefaultColumn = (column: iTableColumn) => ({
    Header: column.header,
    accessor: column.key,
  });

  const getFormatCell = (column: iTableColumn, value: any, data?: any) => {
    switch (column.format) {
      case TABLE_COLUMN_FORMAT_BOOLEAN: {
        return `${(value === true || value.trim().toLowerCase() === 'true') ? "Y" : "N"}`;
      }
      case TABLE_COLUMN_FORMAT_DATE: {
        const string =`${value || ""}`.trim();
        return string === "" ? "" : moment(string).format("DD/MM/YYYY");
      }
      case TABLE_COLUMN_FORMAT_CALCULATED: {
        return typeof column.cell === 'function' ? column.cell(column, data) : '';
      }
      default: {
        return value;
      }
    }
  };

  const getStaffColumns = (column: iTableColumn) => {
    const defaultCol = getDefaultColumn(column);
    if (`${column.group || ""}`.trim() !== "") {
      return null;
    }
    if (column.key === "StaffID") {
      return {
        ...defaultCol,
        sticky: "left",
        width: 50
      };
    }
    return {
      ...defaultCol,
      getCellProps: (cell: any) => {
        if (!cell.row.original.noOfMergingRows && cell.row.original.noOfMergingRows <= 0) {
          return {};
        }
        return {
          rowSpan: cell.row.original.noOfMergingRows
        }
      },
      Cell: (cell: any) => {
        const dateString = `${cell.cell.row.original[column.key] || ""}`.trim();
        return getFormatCell(column, dateString, cell.cell.row.original);
      }
    };
  };


  const getJPCell = (column: iTableColumn, jobPositions: iSynStaffJobPosition[], getValueFn: (jp: iSynStaffJobPosition) => any) => {
    return <div className={`jp-col`}>
      {jobPositions.map((jp, index) => {
        // @ts-ignore
        const value = getFormatCell(column, getValueFn(jp));
        return (
          <div
            key={index}
            className={"jp-col-row"}
            dangerouslySetInnerHTML={{
              __html: `${value || ''}`.trim() === '' ? '&nbsp;' : value,
            }}
          />
        );
      })}
    </div>
  }

  const getJobPositionColumns = (column: iTableColumn) => {
    const defaultCol = getDefaultColumn(column);
    if (`${column.group || ""}`.trim() !== COLUMN_GROUP_JOB_POSITION) {
      return null;
    }
    return {
      ...defaultCol,
      Cell: (cell: any) => {
        const vStaff = cell.cell.row.original;
        const jobPositions = StaffListHelper.getJobPositionFromMap(
          vStaff,
          staffJobPosMap
        ).filter(jp => jp.StaffJobPositionsSeq === cell.cell.row.original.sJPSeq);

        if (column.key.startsWith(COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF)) {
          const key = `${column.key}`.replace(
            COLUMN_KEY_PREFIX_JP_REPORTS_TO_STAFF,
            ""
          );
          return getJPCell(column, jobPositions, (sjp) => {
            const reportsPosition = StaffListHelper.getReportsToPosFromJobPosition(sjp);
            if (!reportsPosition) {
              return '';
            }
            const reportsToStaffs = StaffListHelper.getReportsToStaffsFromJobPosition(reportsPosition,
              positionStaffIdMap,
              staffMap
            );
            // @ts-ignore
            return reportsToStaffs.map(reportsToStaff => key in reportsToStaff ? reportsToStaff[key] : "").join(' & ');
          })
        }

        if (column.key.startsWith(COLUMN_KEY_PREFIX_JP_REPORTS_TO)) {
          const key = `${column.key}`.replace(
            COLUMN_KEY_PREFIX_JP_REPORTS_TO,
            ""
          );
          return getJPCell(column, jobPositions, (sjp) => {
            const reportsPosition = StaffListHelper.getReportsToPosFromJobPosition(sjp);
            // @ts-ignore
            return reportsPosition && key in reportsPosition ? reportsPosition[key] : "";
          })
        }

        if (column.key.startsWith(COLUMN_KEY_PREFIX_JP_POS)) {
          const key = `${column.key}`.replace(COLUMN_KEY_PREFIX_JP_POS, "");
          // @ts-ignore
          return getJPCell(column, jobPositions, (sjp) => key in sjp.SynJobPosition ? sjp.SynJobPosition[key] : "")
        }

        if (column.key.startsWith(COLUMN_KEY_PREFIX_JP)) {
          const key = `${column.key}`.replace(COLUMN_KEY_PREFIX_JP, "");
          // @ts-ignore
          return getJPCell(column, jobPositions, (sjp) => key in sjp ? sjp[key] : "")
        }
      }
    };
  };

  const getSkillExpiryDateColumns = (column: iTableColumn) => {
    const defaultCol = getDefaultColumn(column);
    if (`${column.group || ""}`.trim() !== COLUMN_GROUP_SKILL_EXPIRY_DATE) {
      return null;
    }
    return {
      ...defaultCol,
      Cell: (cell: any) => {
        const staffID = cell.cell.row.original.StaffID;
        const communitySkills = (staffID in skillMap
          ? skillMap[staffID]
          : []
        ).filter(
          communitySkill =>
            `${communitySkill.SkillCode}`.trim() === `${column.header}`.trim()
        );
        if (communitySkills.length <= 0) {
          return "";
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

        const dateString = `${latest[0].ExpiryDate || ""}`.trim();
        return (
          <div className={`skill-expiry-date ${className}`}>
            {dateString === "" ? "" : moment(dateString).format("DD/MM/YYYY")}
          </div>
        );
      }
    };
  };

  useEffect(() => {
    const staffDetailsColumns = selectedColumns.map(column => getStaffColumns(column)).filter(col => col !== null);
    const jpColumns = selectedColumns.map(column => getJobPositionColumns(column)).filter(col => col !== null);
    const skillExpiryDateColumns = selectedColumns.map(column => getSkillExpiryDateColumns(column)).filter(col => col !== null);
    setHasJPColumns(jpColumns.length > 0);
    setColumns(
      [
        ...staffDetailsColumns,
        ...jpColumns,
        ...skillExpiryDateColumns
      ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColumns]);
  if (columns.length <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <ReactTableWithFixedColumns
        htmlId={tableHtmlId}
        hover
        className={`staff-list-table ${className || ""}`}
        data={staffList
          .map(staff => {
            if (hasJPColumns !== true || (!(staff.StaffID in staffJobPosMap)) || !Array.isArray(staffJobPosMap[staff.StaffID]) || staffJobPosMap[staff.StaffID].length <= 0) {
              return [staff];
            }
            const staffData = {...staff, noOfMergingRows: staffJobPosMap[staff.StaffID].length};
            return staffJobPosMap[staff.StaffID].map(sJP => ({...staffData, sJPSeq: sJP.StaffJobPositionsSeq}));
          })
          .reduce((arr: iVStaff[], staffs) => [...arr, ...staffs], [])}
        columns={columns}
      />
    </Wrapper>
  );
};

export default StaffListTable;
