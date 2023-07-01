import iLuYearLevel from "../../../../types/Synergetic/iLuYearLevel";
import Table, { iTableColumn } from "../../../../components/common/Table";
import { iVPastAndCurrentStudent } from "../../../../types/Synergetic/iVStudent";
import iSynVStudentAttendanceHistory from "../../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory";
import { useEffect, useState } from "react";
import StudentAttendanceRatePopup from "./StudentAttendanceRatePopup";
import styled from "styled-components";

export type iAttendanceMap = { [key: number]: iSynVStudentAttendanceHistory[] };

type iStudentAttendanceReportTable = {
  watchingRate: number;
  yearLevels: iLuYearLevel[];
  studentMap: { [key: number]: iVPastAndCurrentStudent };
  attendanceRecordMap: iAttendanceMap;
  attendanceRateMap: { [key: number]: number };
};

const Wrapper = styled.div`
  th,
  td {
    padding: 2px;
  }
`;

const StudentAttendanceRateReportTable = ({
  watchingRate,
  yearLevels,
  studentMap,
  attendanceRecordMap,
  attendanceRateMap
}: iStudentAttendanceReportTable) => {
  const [stYearLevelMap, setStYearLevelMap] = useState({});

  useEffect(() => {
    setStYearLevelMap(
      Object.values(studentMap).reduce(
        (map, student) => ({
          ...map,
          [`${student.StudentYearLevel}`]: [
            ...(student.StudentYearLevel in map
              ? // @ts-ignore
                map[student.StudentYearLevel]
              : []),
            student.StudentID
          ]
        }),
        {}
      )
    );
  }, [studentMap, watchingRate]);

  const getRatedStudentIds = ({
    studentIds,
    minRate,
    maxRate
  }: {
    studentIds?: (number | string)[];
    minRate: number;
    maxRate: number;
  }) => {
    // console.log('attendanceRateMap', attendanceRateMap);
    return Object.keys(attendanceRateMap).filter(studentId => {
      if (studentIds && studentIds.indexOf(Number(studentId)) < 0) {
        return false;
      }
      // @ts-ignore
      const rate = attendanceRateMap[studentId];
      if (rate >= maxRate) {
        return false;
      }
      if (rate < minRate) {
        return false;
      }
      return true;
    });
  };

  const getPopupDiv = (studentIds: number[] | string[]) => {
    return (
      <StudentAttendanceRatePopup
        variant={"link"}
        size={"sm"}
        watchingRate={watchingRate}
        showingStudentIds={studentIds.map(id => Number(id))}
        studentMap={studentMap}
        attendanceRecordMap={attendanceRecordMap}
        attendanceRateMap={attendanceRateMap}
      >
        {studentIds.length}
      </StudentAttendanceRatePopup>
    );
  };

  const getColumns = () => [
    {
      key: "yearLevel",
      header: "Yr Lvl.",
      cell: (column: iTableColumn, data: iLuYearLevel) => {
        return (
          <td key={column.key}>
            <b>{data.Description}</b>
          </td>
        );
      },
      footer: (column: iTableColumn) => {
        return (
          <td key={column.key}>
            <b>Total</b>
          </td>
        );
      }
    },
    {
      key: "rate-greater",
      header: `>=${watchingRate}%`,
      footer: (column: iTableColumn, data: iLuYearLevel) => {
        // @ts-ignore
        const studentIds = getRatedStudentIds({
          minRate: watchingRate,
          maxRate: 101
        });

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      },
      cell: (column: iTableColumn, data: iLuYearLevel) => {
        const studentIds = getRatedStudentIds({
          // @ts-ignore
          studentIds: stYearLevelMap[data.Code] || [],
          minRate: 80,
          maxRate: 101
        });

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      }
    },
    {
      key: "rate-less",
      header: `<${watchingRate}%`,
      footer: (column: iTableColumn, data: iLuYearLevel) => {
        // @ts-ignore
        const studentIds = getRatedStudentIds({
          minRate: 0,
          maxRate: watchingRate
        });
        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      },
      cell: (column: iTableColumn, data: iLuYearLevel) => {
        const studentIds = getRatedStudentIds({
          // @ts-ignore
          studentIds: stYearLevelMap[data.Code] || [],
          minRate: 0,
          maxRate: 80
        });

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      }
    },
    {
      key: "yrlvl-total",
      header: "Total",
      footer: (column: iTableColumn, data: iLuYearLevel) => {
        // @ts-ignore
        const studentIds = Object.keys(studentMap);

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      },
      cell: (column: iTableColumn, data: iLuYearLevel) => {
        // @ts-ignore
        const studentIds = stYearLevelMap[data.Code] || [];
        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      }
    }
  ];

  if (Object.keys(stYearLevelMap).length === 0) {
    return null;
  }
  return (
    <Wrapper>
      <Table columns={getColumns()} rows={yearLevels} hover />
    </Wrapper>
  );
};

export default StudentAttendanceRateReportTable;
