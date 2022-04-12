import iSBSubmissionReturn from '../../../../../types/SchoolBox/iSBSubmissionReturn';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import moment from 'moment';
import {iGradeMap} from './AssessmentSubjectCharts';
import {useEffect, useState} from 'react';

type iAssessmentSubjectChart = {
  submissionReturns: iSBSubmissionReturn[]
  gradeMap: iGradeMap,
  showGroupedScale?: boolean;
  colorCode: string;
}

type iSeriesDataRow = {
  y: number;
  data: iSBSubmissionReturn,
  color: string
  grade: string;
}

const AssessmentSubjectChart = ({
  submissionReturns, gradeMap, colorCode, showGroupedScale = false
}: iAssessmentSubjectChart) => {

  const [seriesName, setSeriesName] = useState('');
  const [seriesData, setSeriesData] = useState<iSeriesDataRow[]>([]);
  const [xAxisNames, setXAxisNames] = useState<string[]>([]);
  const [yAxisNames, setYAxisNames] = useState<string[]>([]);

  useEffect(() => {
    if(submissionReturns.length <= 0) { return }

    setXAxisNames(
      submissionReturns.map(submissionReturn => moment(submissionReturn.updated_at).format('YYYY-MM-DD'))
    );
    const yNames = Object.keys(gradeMap).reverse();
    setYAxisNames(yNames)
    setSeriesName(`${submissionReturns[0].SubmissionBox?.Folder?.name || ''}`);

    const translateMarkToScale = (submissionReturn: iSBSubmissionReturn) => {
      let y = yNames.length;
      let grade = yNames[y - 1];
      yNames.map((yName, index) => {
        if (gradeMap[yName] && submissionReturn.norm_mark >= gradeMap[yName].lower && submissionReturn.norm_mark < gradeMap[yName].higher) {
          y = index;
          grade = yName;
        }
      })
      return {y, grade};
    }
    setSeriesData(
      submissionReturns.map(submissionReturn => {
        return {data: submissionReturn, color: colorCode, ...translateMarkToScale(submissionReturn)}
      })
    )
  }, [submissionReturns, gradeMap, showGroupedScale])

  if (seriesData.length <= 0 || xAxisNames.length <= 0) {
    return null;
  }

  const getChartOptions = () => {
    return {
      chart: {
        type: 'column',
        marginBottom: '35',
        height: 250
      },
      credits:{enabled:false},
      title: {
        text: seriesName,
        align: 'center',
        verticalAlign: 'bottom',
        float: true,
        height: 15,
        style: {
          fontSize: '12px'
        }
      },
      xAxis: {
        categories: xAxisNames,
        visible: false
      },
      yAxis: {
        endOnTick: true,
        min: 0,
        max: showGroupedScale === true ? 5 : 10,
        tickInterval: 1,
        title: { text: null },
        labels: {
          // @ts-ignore
          formatter: function() {
            // @ts-ignore
            return yAxisNames[this.value]
          }
        }
      },
      plotOptions: {
        column: {
          maxPointWidth: 50
        }
      },
      series: [
        {'name': seriesName, 'data': seriesData, showInLegend: false}
      ],
      tooltip: {
        // @ts-ignore
        formatter: function() {
          // @ts-ignore
          console.log(this.point)
          // @ts-ignore
          return `${this.point.data.SubmissionBox.name || ''}: ${this.point.grade}`;
        }
      }
    }
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={getChartOptions()}
      />
    </div>
  );
}

export default AssessmentSubjectChart;
