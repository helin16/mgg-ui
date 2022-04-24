import iVStudent from '../../../../../types/Synergetic/iVStudent';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import iStudentReportYear from '../../../../../types/Synergetic/iStudentReportYear';
import StudentReportService from '../../../../../services/Synergetic/StudentReportService';
import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_MARKS,
  STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC
} from '../../../../../types/Synergetic/iStudentReportResult';
import * as _ from 'lodash';
import MathHelper from '../../../../../helper/MathHelper';

type iSemesterOverallScoresChart = {
  student: iVStudent
}
type iResultMap = {
  [key:string]: {
    [key: string]: iStudentReportResult[]
  }
}

const getResultMap = (currentResults: iStudentReportResult[], previousResults: iStudentReportResult[]): {
  map: iResultMap;
  semesterKeys: string[];
} => {
  const map = {};
  const semesterKeys: string[] = [];
  [...currentResults, ...previousResults].map(result => {
    const key = `${result.AssessHeading || ''}`.trim();
    if(!(key in map)) {
      // @ts-ignore
      map[key] = {};
    }
    const semesterKey = `${result.FileYear}-S${result.FileSemester / 2}`;
    semesterKeys.push(semesterKey);
    // @ts-ignore
    if (!(semesterKey in map[key])) {
      // @ts-ignore
      map[key][semesterKey] = [];
    }
    // @ts-ignore
    map[key][semesterKey].push(result);
    return null;
  });
  return {
    map,
    semesterKeys: _.uniq(semesterKeys),
  }
}

const SemesterOverallScoresChart = ({student}: iSemesterOverallScoresChart) => {
  const [isLoadingReportYears, setIsLoadingReportYears] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [currentStudentReportYear, setCurrentStudentReportYear] = useState<iStudentReportYear | null>(null);
  const [previousStudentReportYear, setPreviousStudentReportYear] = useState<iStudentReportYear | null>(null);
  const [semesterNames, setSemesterNames] = useState<string[]>([]);
  const [resultMap, setResultMap] = useState<iResultMap>({});
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoadingReportYears(true);
    StudentReportService.getStudentReportYearsForAStudent(student.StudentID, {
        sort: `FileYear:DESC,FileSemester:DESC`
      })
      .then(resp => {
        if (isCancelled === true) { return }
        const sortedReportedYears = resp.sort((res1, res2) => {
          return res1.FileYear > res2.FileYear && res1.FileSemester > res2.FileSemester ? 1 : -1
        })
        setCurrentStudentReportYear(sortedReportedYears.length > 0 ? sortedReportedYears[0] : null);
        setPreviousStudentReportYear(sortedReportedYears.length > 1 ? sortedReportedYears[1] : null);
      })
      .finally(() => {
        setIsLoadingReportYears(false);
      })

    return () => {
      isCancelled = true;
    }
  }, [student]);

  useEffect(() => {
    let isCancelled = false;
    if (currentStudentReportYear === null || previousStudentReportYear === null) { return }
    setIsLoadingResults(true);
    const where = {
      AssessAreaResultType: STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_MARKS,
      FileType: STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC,
    }
    Promise.all([
        StudentReportService.getStudentReportResultForAStudent(student.StudentID, currentStudentReportYear.ID || '', {
            where: JSON.stringify({
              ...where,
              FileYear: currentStudentReportYear.FileYear,
              FileSemester: currentStudentReportYear.FileSemester,
            })
        }),
        StudentReportService.getStudentReportResultForAStudent(student.StudentID, previousStudentReportYear.ID || '', {
          where: JSON.stringify({
            ...where,
            FileYear: previousStudentReportYear.FileYear,
            FileSemester: previousStudentReportYear.FileSemester,
          })
        }),
      ])
      .then(resp => {
        if (isCancelled === true) { return }
        const {map, semesterKeys} = getResultMap(resp[0] || [], resp[1] || []);

        setSemesterNames(semesterKeys.sort((sKey1, sKey2) => sKey1 > sKey2 ? 1: -1 ));
        setResultMap(map);
      })
      .finally(() => {
        setIsLoadingResults(false);
      })

    return () => {
      isCancelled = true;
    }
  }, [student, currentStudentReportYear, previousStudentReportYear]);

  useEffect(() => {
    const subjectNames = Object.keys(resultMap);
    if(subjectNames.length <= 0 || semesterNames.length <= 0){
      return;
    }
    const returnArr: any[] = [];
    subjectNames.map((name :string) => {
      const info = resultMap[name];
      const data: any[] = [];
      semesterNames.map((semesterName, index) => {
        if (!(semesterName in info)) { return null; }
        if (info[semesterName].length <= 0) { return null; }

        // @ts-ignore
        const filteredResults = info[semesterName].filter(result => !isNaN(`${result.AssessResultsResult || ''}`))
        const sumResult = filteredResults.reduce((sum, result) => {
          return MathHelper.add(Number(sum), Number(result.AssessResultsResult));
        }, 0);
        const averageResult = MathHelper.div(sumResult, filteredResults.length);
        data.push({
          y: parseInt(`${averageResult}`, 10),
          data: {
            ...info[semesterName][0],
            AssessResultsResult: averageResult.toFixed(1),
          },
          x: index,
        });
        return null;
      });
      returnArr.push({ name, data, showInLegend: false });
      return null;
    });
    setChartData(returnArr);
  }, [semesterNames, resultMap]);


  if (isLoadingReportYears === true || isLoadingResults === true) {
    return <Spinner animation={'border'} />
  }

  if (chartData.length <= 0 ){
    return null;
  }

  const justifyColumns = (chart: any) => {
    const charXMin = chart.xAxis[0].min || 0;
    const charXMax = chart.xAxis[0].max || 100;
    const categoriesWidth = MathHelper.div(
      chart.plotSizeX,
      MathHelper.sub(
        MathHelper.add(1, charXMax),
        charXMin
      )
    );
    // const distanceBetweenColumns = 0;
    const categories = chart.xAxis[0].categories;
    categories.map((xName: string, xNameIndex: number) => {
      let categorySum = 0;
      Highcharts.each(chart.series, (pol: any)=> {
        if (pol.visible === true) {
          Highcharts.each(pol.data, (obj: any) => {
            if (obj.category === xName) {
              categorySum = MathHelper.add(categorySum, 1);
            }
          })
        }
      });

      // const distanceBetweenColumns = MathHelper.div(categoriesWidth, MathHelper.add(categorySum, 1));
      const midCategory = Math.ceil(MathHelper.div(categorySum, 2));
      let number = 1;
      Highcharts.each(chart.series, (pol: any)=> {
        if (pol.visible === true) {
          Highcharts.each(pol.data, (obj: any) => {
            if (obj.category === xName) {
              // ob.graphic.element.x.baseVal.value = i * categoriesWidth + distanceBetweenColumns * number - ob.pointWidth / 2;
              obj.graphic.element.x.baseVal.value = xNameIndex * categoriesWidth + categoriesWidth / 2;
              if (number < midCategory) {
                obj.graphic.element.x.baseVal.value = obj.graphic.element.x.baseVal.value - ((midCategory - number) * obj.pointWidth);
              } else {
                obj.graphic.element.x.baseVal.value = obj.graphic.element.x.baseVal.value + ((number - midCategory) * obj.pointWidth);
              }
              number = MathHelper.add(number, 1);
            }
          })
        }
      })
      return null;
    });
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          chart: {
            type: 'column',
            events: {
              load: function () {
                justifyColumns(this);
              },
              redraw: function () {
                justifyColumns(this);
              }
            },
            height: 250
          },
          credits: { enabled:false },
          title: {
            text: 'Semester Reports: Overall Scores',
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
            }
          },
          xAxis: {
            categories: semesterNames
          },
          yAxis: {
            title: { text: 'Overall Score / 100' },
            min: 40,
            max: 100,
            tickInterval: 10
          },
          plotOptions: {
            series: {
              pointPadding: 0.1,
              groupPadding: 0,
              borderWidth: 0,
              events: {
                hide: function () {
                  // @ts-ignore
                  justifyColumns(this.chart);
                },
                show: function () {
                  // @ts-ignore
                  justifyColumns(this.chart);
                }
              }
            }
          },
          series: chartData,
          tooltip: {
            // @ts-ignore
            formatter: function() {
              // @ts-ignore
              return `${this.point.data.AssessHeading || ''}: ${this.point.data.AssessResultsResult}`
            }
          }
        }}
      />
    </div>
  );
}

export default SemesterOverallScoresChart;
