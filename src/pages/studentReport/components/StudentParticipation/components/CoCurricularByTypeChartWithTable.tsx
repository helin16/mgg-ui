import iVStudent from "../../../../../types/Synergetic/iVStudent";
import iStudentReportCoCurricular from "../../../../../types/Synergetic/iStudentReportCoCurricular";
import styled from "styled-components";
import Chart from "../../../../../components/chart/Chart";
import { useEffect, useState } from "react";
import Table, { iTableColumn } from "../../../../../components/common/Table";

type iCoCurricularByTypeChart = {
  student: iVStudent;
  className?: string;
  coCurriculars: iStudentReportCoCurricular[];
};

const Wrapper = styled.div``;

const CoCurricularByTypeChartWithTable = ({
  student,
  coCurriculars,
  className
}: iCoCurricularByTypeChart) => {
  const [coCurricularByTypeMap, setCoCurricularByTypeMap] = useState<{
    [key: string]: iStudentReportCoCurricular[];
  }>({});
  const [
    coCurricularByDescriptionMap,
    setCoCurricularByDescriptionMap
  ] = useState<{
    [key: string]: iStudentReportCoCurricular[];
  }>({});

  useEffect(() => {
    setCoCurricularByTypeMap(
      coCurriculars.reduce((map, coCurricular) => {
        const key = `${coCurricular.FileTypeDescription}`;
        return {
          ...map,
          // @ts-ignore
          [key]: [...(map[key] || []), coCurricular]
        };
      }, {})
    );
    setCoCurricularByDescriptionMap(
      coCurriculars.reduce((map, coCurricular) => {
        const key = `${coCurricular.FileYear} - ${coCurricular.Description}`;
        return {
          ...map,
          // @ts-ignore
          [key]: [...(map[key] || []), coCurricular]
        };
      }, {})
    );
  }, [student, coCurriculars]);

  const getTable = () => {
    return (
      <Table
        hover
        striped
        columns={[
          {
            key: "FileYear",
            header: "Year",
            cell: (col: iTableColumn, data: iStudentReportCoCurricular[]) => {
              return (
                <td key={col.key}>
                  {data.length <= 0 ? "" : data[0].FileYear}
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
            key: "CoCurricular",
            header: "Co Curricular",
            cell: (col: iTableColumn, data: iStudentReportCoCurricular[]) => {
              return (
                <td key={col.key}>
                  <div className={"ellipsis"}>
                    {data.length <= 0 ? "" : data[0].Description}
                  </div>
                </td>
              );
            }
          },
          {
            key: "Involved",
            header: "Involved",
            cell: (col: iTableColumn, data: iStudentReportCoCurricular[]) => {
              return (
                <td key={col.key}>
                  <div className={"ellipsis"}>{data.length}</div>
                </td>
              );
            },
            footer: (col: iTableColumn) => {
              return (
                <td key={col.key}><b>{coCurriculars.length}</b></td>
              );
            },
          }
        ]}
        rows={Object.values(coCurricularByDescriptionMap)}
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
              Object.keys(coCurricularByTypeMap).length <= 0 ? "No Data" : "",
            align: "center",
            verticalAlign: "middle"
          },
          colors: ['#3257A8', '#37A794', '#8B3D88', '#DD6B7F', '#6B91C9', '#F5C869', '#77C4A8'],
          series: [
            {
              type: "pie",
              name: "count",
              data: Object.keys(coCurricularByTypeMap).map(
                FileTypeDescription => ({
                  name: `${FileTypeDescription}: ${coCurricularByTypeMap[FileTypeDescription].length}`,
                  y: coCurricularByTypeMap[FileTypeDescription].length
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

export default CoCurricularByTypeChartWithTable;
