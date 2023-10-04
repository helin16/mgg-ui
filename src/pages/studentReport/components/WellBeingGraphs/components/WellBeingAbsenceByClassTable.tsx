import iVStudent from "../../../../../types/Synergetic/iVStudent";
import { useEffect, useState } from "react";
import iSynVAttendance from "../../../../../types/Synergetic/Attendance/iSynVAttendance";
import Table, { iTableColumn } from "../../../../../components/common/Table";
import styled from "styled-components";
import iSynVAbsence from '../../../../../types/Synergetic/Absence/iSynVAbsence';

type iWellBeingAbsenceByClassPanel = {
  student: iVStudent;
  attendances: iSynVAttendance[];
  absences: iSynVAbsence[];
};
const Wrapper = styled.div``;
const WellBeingAbsenceByClassChart = ({
  student,
  attendances,
  absences
}: iWellBeingAbsenceByClassPanel) => {
  const [absencesByClassMap, setAbsencesByClassMap] = useState<{
    [key: string]: iSynVAttendance[];
  }>({});

  useEffect(() => {
    const approvedAbsences = absences.filter(absence => absence.ApprovedFlag === true);
    setAbsencesByClassMap(
      attendances
        .reduce(
          (map, attendance) => {
            const classCode = attendance.ClassCode;
            const matchAbsences = approvedAbsences.filter(absence => attendance.AttendanceDate === absence.AbsenceDate && absence.AbsencePeriod === attendance.AttendancePeriod);
            return {
              ...map,
              // @ts-ignore
              [classCode]: [...(map[classCode] || []), {
                ...attendance,
                isApproved: matchAbsences.length > 0 ? matchAbsences[0].ApprovedFlag : false,
              }]
            }
          },
          {}
        )
    );
  }, [student, attendances, absences]);

  const getColumns = (): iTableColumn[] => [
    {
      key: "classCode",
      header: "Code",
      cell: (column, classCode: string) => {
        return <td key={column.key}>{classCode}</td>;
      }
    },
    {
      key: "NoOfClasses",
      header: "Total Classes",
      cell: (column, classCode: string) => {
        return (
          <td key={column.key}>
            {
              attendances.filter(
                attendance => attendance.ClassCode === classCode
              ).length
            }
          </td>
        );
      }
    },
    {
      key: "attended",
      header: "Attended",
      cell: (column, classCode: string) => {
        return (
          <td key={column.key}>
            {
              attendances.filter(
                attendance => attendance.ClassCode === classCode && attendance.AttendedFlag === true
              ).length
            }
          </td>
        );
      }
    },
    {
      key: "markedAsAbsence",
      header: "Marked Absence",
      cell: (column, classCode: string) => {
        return (
          <td key={column.key}>
            {
              attendances.filter(
                attendance => attendance.ClassCode === classCode && attendance.AttendedFlag === false
              ).length
            }
          </td>
        );
      }
    },
    {
      key: "approvedAbsence",
      header: "Approved Absence",
      cell: (column, classCode: string) => {
        return (
          <td key={column.key}>
            {
              (classCode in absencesByClassMap ? absencesByClassMap[classCode] : []).filter(
                // @ts-ignore
                attendance =>attendance.isApproved === true
              ).length
            }
          </td>
        );
      }
    },
    {
      key: "reportableAbsence",
      header: "Reportable Absence",
      cell: (column, classCode: string) => {
        return (
          <td key={column.key}>
            {
              attendances.filter(
                attendance => attendance.ClassCode === classCode && attendance.AttendedFlag === false
              ).length
            }
          </td>
        );
      }
    }
  ];

  return (
    <Wrapper>
      <Table
        columns={getColumns()}
        rows={Object.keys(absencesByClassMap)}
        hover
        striped
      />
    </Wrapper>
  );
};

export default WellBeingAbsenceByClassChart;
