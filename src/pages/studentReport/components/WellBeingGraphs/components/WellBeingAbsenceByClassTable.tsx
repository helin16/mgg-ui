import iVStudent from "../../../../../types/Synergetic/Student/iVStudent";
import { useEffect, useState } from "react";
import iSynVAttendance from "../../../../../types/Synergetic/Attendance/iSynVAttendance";
import Table, { iTableColumn } from "../../../../../components/common/Table";
import styled from "styled-components";
import iSynVAbsence from "../../../../../types/Synergetic/Absence/iSynVAbsence";
import AttendanceTablePopupBtn from "../../../../../components/Attendance/AttendanceTablePopupBtn";
import AttendanceHelper from '../../../../../components/Attendance/AttendanceHelper';

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
    const approvedAbsences = absences.filter(
      absence => absence.ApprovedFlag === true
    );
    setAbsencesByClassMap(
      attendances.reduce((map, attendance) => {
        const classCode = attendance.ClassCode;
        const matchAbsences = approvedAbsences.filter(absence => {
          return (
            attendance.AttendanceDate === absence.AbsenceDate &&
            absence.AbsencePeriod === attendance.AttendancePeriod
          );
        });
        return {
          ...map,
          [classCode]: [
            // @ts-ignore
            ...(map[classCode] || []),
            {
              ...attendance,
              isApproved:
                matchAbsences.length > 0 ? matchAbsences[0].ApprovedFlag : false
            }
          ]
        };
      }, {})
    );
  }, [student, attendances, absences]);

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: "classCode",
      header: "Class",
      footer: 'Total',
      cell: (column, classCode: string) => {
        return <td key={column.key}>{classCode}</td>;
      }
    },
    {
      key: "NoOfClasses",
      header: "Total Classes",
      cell: (column, classCode: string) => {
        const atts = attendances.filter(
          attendance => attendance.ClassCode === classCode
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>Class (<u>{classCode}</u>) Attendances for <u>{student.StudentNameExternal}</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      },
      footer: (column: iTableColumn<T>) => {
        const atts = attendances;
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>All Attendances for <u>{student.StudentNameExternal}</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      }
    },
    {
      key: "attended",
      header: "Attended",
      cell: (column, classCode: string) => {
        const atts = attendances.filter(
          attendance =>
            attendance.ClassCode === classCode &&
            attendance.AttendedFlag === true
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>Class (<u>{classCode}</u>) Attendances for <u>{student.StudentNameExternal}</u>, <u>attended</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      },
      footer: (column: iTableColumn<T>) => {
        const atts = attendances.filter(
          attendance =>
            attendance.AttendedFlag === true
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>All Attended for <u>{student.StudentNameExternal}</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      }
    },
    {
      key: "markedAsAbsence",
      header: "Marked Absence",
      cell: (column, classCode: string) => {
        const atts = attendances.filter(
          attendance =>
            attendance.ClassCode === classCode &&
            attendance.AttendedFlag === false
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>Class (<u>{classCode}</u>) Attendances for <u>{student.StudentNameExternal}</u>, <u>marked absences</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      },
      footer: (column: iTableColumn<T>) => {
        const atts = attendances.filter(
          attendance =>
            attendance.AttendedFlag !== true
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>All Marked Absence for <u>{student.StudentNameExternal}</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      }
    },
    {
      key: "approvedAbsence",
      header: "Approved Absence",
      cell: (column, classCode: string) => {
        const atts = (classCode in absencesByClassMap
            ? absencesByClassMap[classCode]
            : []
        ).filter(
          // @ts-ignore
          attendance => attendance.isApproved === true
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>Class (<u>{classCode}</u>) Attendances for <u>{student.StudentNameExternal}</u>, <u>approved absences</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      },
      footer: (column: iTableColumn<T>) => {
        const atts = attendances.filter(
          attendance =>
            // @ts-ignore
            attendance.isApproved === true
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>All Approved Absence for <u>{student.StudentNameExternal}</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      }
    },
    {
      key: "reportableAbsence",
      header: "Reportable Absence",
      cell: (column, classCode: string) => {
        const atts= attendances.filter(
          attendance => {
            if (attendance.ClassCode !== classCode) {
              return false;
            }
            return AttendanceHelper.isReportableAbsence(attendance);
          }

        )
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>Class (<u>{classCode}</u>) Attendances for <u>{student.StudentNameExternal}</u>, <u>reportable absences</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      },
      footer: (column: iTableColumn<T>) => {
        const atts = attendances.filter(
          attendance =>
            AttendanceHelper.isReportableAbsence(attendance)
        );
        return (
          <td key={column.key}>
            <AttendanceTablePopupBtn
              showStudentID={false}
              attendances={atts}
              variant={"link"}
              size={'sm'}
              className={"no-padding"}
              popupTitle={<>All Reportable Absence for <u>{student.StudentNameExternal}</u>: {atts.length} </>}
            >
              {atts.length}
            </AttendanceTablePopupBtn>
          </td>
        );
      }
    }
  ];

  return (
    <Wrapper>
      <Table
        columns={getColumns<string>()}
        rows={Object.keys(absencesByClassMap).sort((classCode1, classCode2) => classCode1 > classCode2 ? 1 : -1)}
        hover
        striped
        responsive
      />
    </Wrapper>
  );
};

export default WellBeingAbsenceByClassChart;
