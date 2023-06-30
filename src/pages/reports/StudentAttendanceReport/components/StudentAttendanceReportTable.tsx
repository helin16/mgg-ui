import iLuYearLevel from '../../../../types/Synergetic/iLuYearLevel';
import Table, {iTableColumn} from '../../../../components/common/Table';
import iVStudent from '../../../../types/Synergetic/iVStudent';
import iSynVStudentAttendanceHistory from '../../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory';
import {useEffect, useState} from 'react';

export type iAttendanceMap = { [key: number]: iSynVStudentAttendanceHistory[] };

type iStudentAttendanceReportTable = {
  yearLevels: iLuYearLevel[];
  studentMap: { [key: number]: iVStudent };
  attendanceRecordMap: iAttendanceMap;
  attendanceRateMap: { [key: number]: number };
}

const StudentAttendanceReportTable = ({yearLevels, studentMap, attendanceRecordMap, attendanceRateMap}: iStudentAttendanceReportTable) => {

  const [stYearLevelMap, setStYearLevelMap] = useState({});

  useEffect(() => {
    setStYearLevelMap(Object.values(studentMap).reduce((map, student) => ({
      ...map,
      [`${student.StudentYearLevel}`]: [
        // @ts-ignore
        ...(student.StudentYearLevel in map ? map[student.StudentYearLevel] : []),
        student.StudentID,
      ]
    }), {}))
  }, [studentMap]);

  const getRatedStudentIds = ({studentIds, minRate, maxRate}: {studentIds?: (number | string)[], minRate: number, maxRate: number}) => {
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
    })
  }

  const getColumns = () => [{
    key: 'yearLevel',
    header: 'Yr Lvl.',
    cell: (column: iTableColumn, data: iLuYearLevel) => {
      return <td key={column.key}><b>{data.Description}</b></td>
    },
    footer: (column: iTableColumn) => {
      return <td key={column.key}><b>Total</b></td>
    },
  }, {
    key: 'rate-greater',
    header: '>=80%',
    footer: (column: iTableColumn, data: iLuYearLevel) => {
      // @ts-ignore
      const studentIds = getRatedStudentIds({minRate: 80, maxRate: 101});

      // @ts-ignore
      return <td key={column.key}>{studentIds.length}</td>
    },
    cell: (column: iTableColumn, data: iLuYearLevel) => {
      // @ts-ignore
      const studentIds = getRatedStudentIds({studentIds: stYearLevelMap[data.Code] || [], minRate: 80, maxRate: 101});

      // @ts-ignore
      return <td key={column.key}>{studentIds.length}</td>
    }
  }, {
    key: 'rate-less',
    header: '<80%',
    footer: (column: iTableColumn, data: iLuYearLevel) => {
      // @ts-ignore
      const studentIds = getRatedStudentIds({minRate: 0, maxRate: 80});

      // @ts-ignore
      return <td key={column.key}>{studentIds.length}</td>
    },
    cell: (column: iTableColumn, data: iLuYearLevel) => {
      // @ts-ignore
      const studentIds = getRatedStudentIds({studentIds: stYearLevelMap[data.Code] || [], minRate: 0, maxRate: 80});

      // @ts-ignore
      return <td key={column.key}>{studentIds.length}</td>
    }
  }, {
    key: 'yrlvl-total',
    header: 'Total',
    footer: (column: iTableColumn, data: iLuYearLevel) => {
      // @ts-ignore
      const studentIds = Object.keys(studentMap);

      // @ts-ignore
      return <td key={column.key}>{studentIds.length}</td>
    },
    cell: (column: iTableColumn, data: iLuYearLevel) => {
      // @ts-ignore
      const studentIds = stYearLevelMap[data.Code] || [];

      // @ts-ignore
      return <td key={column.key}>{studentIds.length}</td>
    }
  }]

  if (Object.keys(stYearLevelMap).length === 0) {
    return null;
  }
  return (
    <Table columns={getColumns()} rows={yearLevels} />
  )
}

export default StudentAttendanceReportTable;
