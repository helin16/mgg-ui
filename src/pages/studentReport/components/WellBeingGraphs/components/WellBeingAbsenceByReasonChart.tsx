import iVStudent from "../../../../../types/Synergetic/iVStudent";
import { useEffect, useState } from "react";
import Chart from "../../../../../components/chart/Chart";
import styled from "styled-components";
import iSynVAbsence from "../../../../../types/Synergetic/Absence/iSynVAbsence";

type iWellBeingAbsenceByReasonPanel = {
  student: iVStudent;
  absences: iSynVAbsence[];
};
const Wrapper = styled.div`
  
`;
const WellBeingAbsenceByReasonChart = ({
  student,
  absences
}: iWellBeingAbsenceByReasonPanel) => {
  const [absencesByReasonMap, setAbsencesByReasonMap] = useState<{[key: string]: iSynVAbsence[]}>({});
  useEffect(() => {
    setAbsencesByReasonMap(
      absences
        .reduce(
          (map, absence) => {
            const key = `${absence.SynLuAbsenceType?.Description || ''}`.trim();
            return {
              ...map,
              // @ts-ignore
              [key]: [...(map[key] || []), absence]
            }
          },
          {}
        )
    );
  }, [student, absences]);


  return (
    <Wrapper>
      <div className={"chart-wrapper"}>
        <Chart
          options={{
            plotOptions: {
              pie: {
                shadow: false,
                innerSize: "50%"
              }
            },
            title: {
              text: Object.keys(absencesByReasonMap).length <= 0 ? 'No Absence' : '',
              align: 'center',
              verticalAlign: 'middle',
            },
            series: [
              {
                type: "pie",
                name: "count",
                data: Object.keys(absencesByReasonMap).map(type => ({
                  name: `${type}: ${absencesByReasonMap[type].length}`,
                  y: absencesByReasonMap[type].length
                }))
              }
            ]
          }}
        />
      </div>
    </Wrapper>
  );
};

export default WellBeingAbsenceByReasonChart;
