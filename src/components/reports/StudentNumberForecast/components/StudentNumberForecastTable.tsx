import React, { useEffect, useState } from "react";
import * as _ from "lodash";
import iLuYearLevel from "../../../../types/Synergetic/iLuYearLevel";
import Table, { iTableColumn } from "../../../common/Table";
import iVStudent from "../../../../types/Synergetic/iVStudent";
import iFunnelLead from "../../../../types/Funnel/iFunnelLead";
import StudentNumberDetailsPopupBtn from "./StudentNumberDetailsPopupBtn";
import styled from "styled-components";
import { mainBlue } from "../../../../AppWrapper";
import UtilsService from '../../../../services/UtilsService';
import MathHelper from '../../../../helper/MathHelper';

type iStudentMap = { [key: string]: iVStudent[] };
type iMap = { [key: string]: iFunnelLead[] };
type iFunnelLeadMap = {
  confirmed: iMap;
  inProgress: iMap;
  leadsAndTours: iMap;
};
type iStudentNumberForecastTable = {
  className?: string;
  showingFinanceFigures?: boolean;
  nextFileYear: number;
  selectedCampusCodes?: string[];
  yearLevelMap: { [key: string]: iLuYearLevel };
  currentStudentMap: iStudentMap;
  currentStudentLeaverMap: iStudentMap;
  nextYearFunnelLeadMap: iFunnelLeadMap;
  futureNextYearMap: iMap;
};
const Wrapper = styled.div`
  .st-no-popup-btn {
    padding: 0px;
    margin: 0px;
  }

  .lead-table {
    thead {
      th {
        background: ${mainBlue};
        color: white !important;
      }
    }
    td.sub-total {
      background: #e9e9e9;
      font-weight: bold;
      :first-child {
        text-align: right;
      }
      .btn {
        font-weight: bold;
      }
    }
    tfoot {
      font-weight: bold;
    }
  }
`;
const StudentNumberForecastTable = ({
  className,
  nextFileYear,
  yearLevelMap,
  currentStudentMap,
  currentStudentLeaverMap,
  nextYearFunnelLeadMap,
  futureNextYearMap,
  showingFinanceFigures,
  selectedCampusCodes = ["S", "J", "E"]
}: iStudentNumberForecastTable) => {
  const [yLevelArr, setYLevelArr] = useState<iLuYearLevel[]>([]);

  useEffect(() => {
    const arr = Object.values(yearLevelMap).sort((yl1, yl2) =>
      yl1.YearLevelSort > yl2.YearLevelSort ? 1 : -1
    );
    const campusCodesForE = _.intersection(selectedCampusCodes, ["E"]);
    const campusCodesForJS = _.intersection(selectedCampusCodes, ["J", "S"]);
    setYLevelArr([
      // @ts-ignore
      ...arr.filter(yl => yl.Campus === "E"),
      ...(campusCodesForE.length > 0
        ? // @ts-ignore
          [{ Code: "subTotal", campuses: campusCodesForE }]
        : []),
      // @ts-ignore
      ...arr.filter(yl => ["J", "S"].indexOf(yl.Campus) >= 0),
      // @ts-ignore
      ...(campusCodesForJS.length > 0
        ? [{ Code: "subTotal", campuses: campusCodesForJS }]
        : [])
    ]);
  }, [yearLevelMap, selectedCampusCodes]);

  const getTotalAmountForStudent = (record: iVStudent | iFunnelLead, forFuture: boolean = false) => {

    if (forFuture === true) {
      // @ts-ignore
      return record.futureTotalFeeAmount || 0;
    }
    // @ts-ignore
    return record.currentTotalFeeAmount || 0;
  }

  const StudentPopupDiv = (
    students: (iVStudent | iFunnelLead)[],
    forFuture: boolean = false
  ) => {
    if (students.length <= 0) {
      return null;
    }

    return (
      <StudentNumberDetailsPopupBtn
        records={students}
        size={"sm"}
        variant={"link"}
        showingFuture={forFuture}
        showingFinanceFigures={showingFinanceFigures}
      >
        {showingFinanceFigures === true
          ? UtilsService.formatIntoCurrency(
              students.reduce(
                (sum, student) =>
                  MathHelper.add(
                    sum,
                    getTotalAmountForStudent(student, forFuture)
                  ),
                0
              )
            )
          : students.length}
      </StudentNumberDetailsPopupBtn>
    );
  };

  const getCell = (
    key: string,
    data: iLuYearLevel,
    map: any,
    forFuture: boolean = false
  ) => {
    if (data.Code === "subTotal") {
      const yearLevelCodes = yLevelArr
        // @ts-ignore
        .filter(yLevel => (data.campuses || []).indexOf(yLevel.Campus) >= 0)
        .map(yLevel => yLevel.Code);
      const students = yearLevelCodes.reduce(
        (arr: iVStudent[], code) => [...arr, ...(code in map ? map[code] : [])],
        []
      );
      return (
        <td key={key} className={"sub-total"}>
          {StudentPopupDiv(students, forFuture)}
        </td>
      );
    }

    const students = data.Code in map ? map[data.Code] : [];
    return <td key={key}>{StudentPopupDiv(students, forFuture)}</td>;
  };

  const getColumns = () => [
    {
      key: "ylevelCode",
      header: "Year Level",
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        if (data.Code === "subTotal") {
          return (
            <td key={col.key} className={"text-right sub-total"}>
              <b>Sub Total</b>
            </td>
          );
        }
        return (
          <td key={col.key}>
            {Number(data.Code) > 0
              ? `Year ${data.Description}`
              : data.Description}
          </td>
        );
      },
      footer: (col: iTableColumn) => {
        return (
          <td key={col.key}>
            <b>Total</b>
          </td>
        );
      }
    },
    {
      key: "currentStudent",
      header: "Current Student",
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        return getCell(col.key, data, currentStudentMap);
      },
      footer: (col: iTableColumn) => {
        const students =
          "total" in currentStudentMap ? currentStudentMap.total : [];
        return <td key={col.key}>{StudentPopupDiv(students)}</td>;
      }
    },
    {
      key: "currentLeavers",
      header: "Current Leavers",
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        return getCell(col.key, data, currentStudentLeaverMap);
      },
      footer: (col: iTableColumn) => {
        const students =
          "total" in currentStudentLeaverMap
            ? currentStudentLeaverMap.total
            : [];
        return <td key={col.key}>{StudentPopupDiv(students)}</td>;
      }
    },
    {
      key: "confirmed",
      header: "Confirmed",
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        return getCell(col.key, data, nextYearFunnelLeadMap.confirmed, true);
      },
      footer: (col: iTableColumn) => {
        const students =
          "total" in nextYearFunnelLeadMap.confirmed
            ? nextYearFunnelLeadMap.confirmed.total
            : [];
        return <td key={col.key}>{StudentPopupDiv(students, true)}</td>;
      }
    },
    {
      key: "inProgress",
      header: "In Progress",
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        return getCell(col.key, data, nextYearFunnelLeadMap.inProgress, true);
      },
      footer: (col: iTableColumn) => {
        const students =
          "total" in nextYearFunnelLeadMap.inProgress
            ? nextYearFunnelLeadMap.inProgress.total
            : [];
        return <td key={col.key}>{StudentPopupDiv(students, true)}</td>;
      }
    },
    {
      key: "nextYear",
      header: `Future ${nextFileYear}`,
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        return getCell(col.key, data, futureNextYearMap, true);
      },
      footer: (col: iTableColumn) => {
        const students =
          "total" in futureNextYearMap ? futureNextYearMap.total : [];
        return <td key={col.key}>{StudentPopupDiv(students, true)}</td>;
      }
    },
    {
      key: "leadsAndTours",
      header: `Leads & Tours`,
      cell: (col: iTableColumn, data: iLuYearLevel) => {
        return getCell(
          col.key,
          data,
          nextYearFunnelLeadMap.leadsAndTours,
          true
        );
      },
      footer: (col: iTableColumn) => {
        const students =
          "total" in nextYearFunnelLeadMap.leadsAndTours
            ? nextYearFunnelLeadMap.leadsAndTours.total
            : [];
        return <td key={col.key}>{StudentPopupDiv(students, true)}</td>;
      }
    }
  ];

  return (
    <Wrapper className={className}>
      <Table
        hover
        className={"lead-table"}
        columns={getColumns()}
        rows={yLevelArr}
      />
    </Wrapper>
  );
};

export default StudentNumberForecastTable;
