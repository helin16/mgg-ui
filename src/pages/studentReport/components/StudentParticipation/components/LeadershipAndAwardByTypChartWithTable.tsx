import iVStudent from "../../../../../types/Synergetic/Student/iVStudent";
import iStudentReportAward from "../../../../../types/Synergetic/Student/iStudentReportAward";
import styled from "styled-components";
import Chart from "../../../../../components/chart/Chart";
import {useEffect, useState} from 'react';
import Table, {iTableColumn} from '../../../../../components/common/Table';

type iLeadershipAndAwardByTypChartWithTable = {
  student: iVStudent;
  className?: string;
  awards: iStudentReportAward[];
};

const Wrapper = styled.div``;

const LeadershipAndAwardByTypChartWithTable = ({
  student,
  className,
  awards
}: iLeadershipAndAwardByTypChartWithTable) => {
  const [awardsByClassificationMap, setAwardsByClassificationMap] = useState<{
    [key: string]: iStudentReportAward[];
  }>({});
  const [awardsByDescriptionMap, setAwardsByDescriptionMap] = useState<{
    [key: string]: iStudentReportAward[];
  }>({});

  useEffect(() => {
    setAwardsByClassificationMap(
      awards.reduce((map, award) => {
        const key = `${award.ClassificationDescription}`;
        return {
          ...map,
          // @ts-ignore
          [key]: [...(map[key] || []), award]
        };
      }, {})
    );
    setAwardsByDescriptionMap(
      awards.reduce((map, award) => {
        const key = `${award.AwardDescription}`;
        return {
          ...map,
          // @ts-ignore
          [key]: [...(map[key] || []), award]
        };
      }, {})
    );
  }, [student, awards]);


  const getTable = () => {
    return (
      <Table
        hover
        striped
        columns={[
          {
            key: "Award",
            header: "Award/Position",
            cell: (col: iTableColumn, data: iStudentReportAward[]) => {
              return (
                <td key={col.key}>
                  <div className={"ellipsis"}>
                    {data.length <= 0 ? "" : data[0].AwardDescription}
                  </div>
                </td>
              );
            },
            footer: (col: iTableColumn) => {
              return (
                <td key={col.key}><b>Total</b></td>
              );
            },
          },
          {
            key: "Attained",
            header: "Attained",
            cell: (col: iTableColumn, data: iStudentReportAward[]) => {
              return (
                <td key={col.key}>
                  <div className={"ellipsis"}>{data.length}</div>
                </td>
              );
            },
            footer: (col: iTableColumn) => {
              return (
                <td key={col.key}><b>{awards.length}</b></td>
              );
            },
          }
        ]}
        rows={Object.values(awardsByDescriptionMap)}
      />
    );
  };

  return (
    <Wrapper className={className}>
      <Chart
        options={{
          plotOptions: {
            pie: {
              shadow: false,
              innerSize: "75%"
            }
          },
          title: {
            text:
              Object.keys(awardsByClassificationMap).length <= 0 ? "No Data" : "",
            align: "center",
            verticalAlign: "middle"
          },
          colors: ['#3257A8', '#37A794', '#8B3D88', '#DD6B7F', '#6B91C9', '#F5C869', '#77C4A8'],
          series: [
            {
              type: "pie",
              name: "count",
              data: Object.keys(awardsByClassificationMap).map(
                ClassificationDescription => ({
                  name: `${ClassificationDescription}: ${awardsByClassificationMap[ClassificationDescription].length}`,
                  y: awardsByClassificationMap[ClassificationDescription].length
                })
              )
            }
          ]
        }}
      />
      {getTable()}
    </Wrapper>
  );
};

export default LeadershipAndAwardByTypChartWithTable;
