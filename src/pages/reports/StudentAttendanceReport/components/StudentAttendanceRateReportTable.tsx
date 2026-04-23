import ISynLuYearLevel from "../../../../types/Synergetic/Lookup/iSynLuYearLevel";
import Table, { iTableColumn } from "../../../../components/common/Table";
import { iVPastAndCurrentStudent } from "../../../../types/Synergetic/Student/iVStudent";
import { useEffect, useState } from "react";
import StudentAttendanceRatePopup from "./StudentAttendanceRatePopup";
import styled from "styled-components";
import MathHelper from '../../../../helper/MathHelper';
import iSynVAttendancesWithAbsence from '../../../../types/Synergetic/Attendance/iSynVAttendancesWithAbsence';

export type iAttendanceMap = { [key: number]: iSynVAttendancesWithAbsence[] };

type iStudentAttendanceReportTable = {
  watchingRate: number;
  yearLevels: ISynLuYearLevel[];
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

  const getPopupDiv = (studentIds: number[] | string[], text?: string) => {
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
        {text || studentIds.length}
      </StudentAttendanceRatePopup>
    );
  };

  const getOverallAttendanceRate = (studentIds: number[] ) => {
    const attendances = studentIds.reduce((arr: iSynVAttendancesWithAbsence[], studentId: number) => {
      return [...arr, ...(studentId in attendanceRecordMap ? attendanceRecordMap[studentId] : [])]
    }, []);
    if (attendances.length <= 0) {
      return {attendances, attended: [], notAttended: []};
    }
    const attended: iSynVAttendancesWithAbsence[] = [];
    const notAttended: iSynVAttendancesWithAbsence[] = [];
    attendances.forEach((attendance: iSynVAttendancesWithAbsence) => {
      if (attendance.AttendedFlag === true) {
        attended.push(attendance)
      } else {
        notAttended.push(attendance);
      }
    })
    return {attended, notAttended, attendances}

  }

  const getColumns = <T extends {}>() => [
    {
      key: "yearLevel",
      header: "Yr Lvl.",
      cell: (column: iTableColumn<T>, data: ISynLuYearLevel) => {
        return (
          <td key={column.key}>
            <b>{data.Description}</b>
          </td>
        );
      },
      footer: (column: iTableColumn<T>) => {
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
      footer: (column: iTableColumn<T>) => {
        // @ts-ignore
        const studentIds = getRatedStudentIds({
          minRate: watchingRate,
          maxRate: 101
        });

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      },
      cell: (column: iTableColumn<T>, data: ISynLuYearLevel) => {
        const studentIds = getRatedStudentIds({
          // @ts-ignore
          studentIds: stYearLevelMap[data.Code] || [],
          minRate: watchingRate,
          maxRate: 101
        });

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      }
    },
    {
      key: "rate-less",
      header: `<${watchingRate}%`,
      footer: (column: iTableColumn<T>) => {
        // @ts-ignore
        const studentIds = getRatedStudentIds({
          minRate: 0,
          maxRate: watchingRate
        });
        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      },
      cell: (column: iTableColumn<T>, data: ISynLuYearLevel) => {
        const studentIds = getRatedStudentIds({
          // @ts-ignore
          studentIds: stYearLevelMap[data.Code] || [],
          minRate: 0,
          maxRate: watchingRate
        });

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      }
    },
    {
      key: "yrlvl-total",
      header: "Total",
      footer: (column: iTableColumn<T>) => {
        // @ts-ignore
        const studentIds = Object.keys(studentMap);

        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      },
      cell: (column: iTableColumn<T>, data: ISynLuYearLevel) => {
        // @ts-ignore
        const studentIds = stYearLevelMap[data.Code] || [];
        return <td key={column.key}>{getPopupDiv(studentIds)}</td>;
      }
    },
    {
      key: "yrlvl-overall",
      header: "Overall %",
      footer: (column: iTableColumn<T>) => {
        const studentIds = Object.keys(studentMap).map(studentId => Number(studentId));

        const {attended, attendances} = getOverallAttendanceRate(studentIds);
        if (attendances.length <= 0) {
          return '';
        }
        return <td key={column.key}>{getPopupDiv(studentIds, MathHelper.mul(MathHelper.div(attended.length, attendances.length), 100).toFixed(2))}</td>;;
      },
      cell: (column: iTableColumn<T>, data: ISynLuYearLevel) => {
        // @ts-ignore
        const studentIds = stYearLevelMap[data.Code] || [];
        const {attended, attendances} = getOverallAttendanceRate(studentIds);
        if (attendances.length <= 0) {
          return '';
        }
        return <td key={column.key}>{getPopupDiv(studentIds, MathHelper.mul(MathHelper.div(attended.length, attendances.length), 100).toFixed(2))}</td>;
      }
    }
  ];

  if (Object.keys(stYearLevelMap).length === 0) {
    return null;
  }
  return (
    <Wrapper>
      <Table columns={getColumns<ISynLuYearLevel>()} rows={yearLevels} hover />
    </Wrapper>
  );
};

export default StudentAttendanceRateReportTable;
