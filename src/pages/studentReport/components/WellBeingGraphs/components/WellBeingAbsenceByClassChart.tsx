import iVStudent from "../../../../../types/Synergetic/Student/iVStudent";
import { useEffect, useState } from "react";
import iSynVAttendance from "../../../../../types/Synergetic/Attendance/iSynVAttendance";
import Chart from "../../../../../components/chart/Chart";
import styled from "styled-components";

type iWellBeingAbsenceByClassPanel = {
  student: iVStudent;
  attendances: iSynVAttendance[];
};
const Wrapper = styled.div``;
const WellBeingAbsenceByClassChart = ({
  student,
  attendances
}: iWellBeingAbsenceByClassPanel) => {
  const [absencesByClassMap, setAbsencesByClassMap] = useState<{
    [key: string]: iSynVAttendance[];
  }>({});

  useEffect(() => {
    setAbsencesByClassMap(
      attendances
        .filter(attendance => attendance.AttendedFlag !== true)
        .reduce(
          (map, absence) => ({
            ...map,
            // @ts-ignore
            [absence.ClassCode]: [...(map[absence.ClassCode] || []), absence]
          }),
          {}
        )
    );
  }, [student, attendances]);


  return (
    <Wrapper className={"chart-wrapper"}>
      <Chart
        options={{
          plotOptions: {
            pie: {
              shadow: false,
              innerSize: "50%"
            }
          },
          title: {
            text: Object.keys(absencesByClassMap).length <= 0 ? 'No Absence' : '',
            align: 'center',
            verticalAlign: 'middle',
          },
          series: [
            {
              type: "pie",
              name: "count",
              data: Object.keys(absencesByClassMap).map(classCode => ({
                name: `${classCode}: ${absencesByClassMap[classCode].length}`,
                y: absencesByClassMap[classCode].length
              }))
            }
          ]
        }}
      />
    </Wrapper>
  );
};

export default WellBeingAbsenceByClassChart;
