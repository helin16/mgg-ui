import iVStudent from '../../../../../types/Synergetic/iVStudent';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/makeReduxStore';
import {useEffect, useState} from 'react';
import iSBSubmissionReturn from '../../../../../types/SchoolBox/iSBSubmissionReturn';
import SBSubmissionReturnService from '../../../../../services/SchoolBox/SBSubmissionReturnService';
import {Spinner} from 'react-bootstrap';
import MathHelper from '../../../../../helper/MathHelper';
import {OP_AND, OP_GTE, OP_LT} from '../../../../../helper/ServiceHelper';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'

type iAssessmentAlertGraph = {
  student: iVStudent
}

const seriesColors = ['#B90d19', '#990000', '#700f74', '#c13c01'];

type iSubmissionReturnsMap = {
  'Not Assessed': number;
  'Not Satisfactory': number;
  'Absent': number;
  'Not Submitted': number;
  'Submitted': number;
}

const defaultSubmissionReturnsMap: iSubmissionReturnsMap = {
  'Absent': 0,
  'Not Assessed': 0,
  'Not Satisfactory': 0,
  'Not Submitted': 0,
  'Submitted': 0,
}

const getAlertMap = (submissionReturns: iSBSubmissionReturn[]): iSubmissionReturnsMap => {
  const map = {...defaultSubmissionReturnsMap};
  submissionReturns.map(submissionReturn => {
    const mark = `${submissionReturn.mark || ''}`.trim();
    if (mark === '') {
      return null;
    }
    let key = '';
    switch (mark.toLowerCase()) {
      case 'Not Assessed'.toLowerCase():
      case 'Not Satisfactory'.toLowerCase():
      case 'Absent'.toLowerCase():
      case 'Not Submitted'.toLowerCase(): {
        key = mark;
        break;
      }
      default: {
        key = 'Submitted'
      }
    }
    if (!(key in map)) {
      // @ts-ignore
      map[key] = 0;
    }
    // @ts-ignore
    map[key] = MathHelper.add(map[key], 1);
    return null;
  });
  // @ts-ignore
  return map;
}

const AssessmentAlertGraph = ({student}: iAssessmentAlertGraph) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [submissionReturnsMap, setSubmissionReturnsMap] = useState<iSubmissionReturnsMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    SBSubmissionReturnService.getSubmissionReturns({
        include: 'Owner',
        perPage: '999999',
        where: JSON.stringify({
          '$Owner.synergy_id$': student.StudentID,
          deleted_at: null,
          ...(user?.SynCurrentFileSemester && user?.SynCurrentFileSemester.FileYear ? {
            [OP_AND]: [
              {updated_at: {[OP_GTE]: `${user?.SynCurrentFileSemester.FileYear}`}},
              {updated_at: {[OP_LT]: `${MathHelper.add(user?.SynCurrentFileSemester.FileYear, 1)}`}},
            ]
          } : {})
        }),
      })
      .then(res => {
        if (isCancelled === true) { return }
        setSubmissionReturnsMap(getAlertMap(res.data));
      })
      .finally(() => {
        setIsLoading(false)
      })
    return () => {
      isCancelled = true;
    }
  }, [user, student]);


  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }
  if (submissionReturnsMap === null) {
    return null;
  }


  const getSeriesData = () => {
    return Object.keys(submissionReturnsMap).map((name, index) => {
      return {
        // @ts-ignore
        y: parseInt(submissionReturnsMap[name] || 0, 10),
        name: name.replace(' ', '<br />'),
        color: seriesColors[index]
      };
    });
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: 250
          },
          title: {
            text: `${user?.SynCurrentFileSemester?.FileYear} Assessment Alerts`,
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
            }
          },
          credits: { enabled:false},
          xAxis: {
            categories: [],
            visible: false
          },
          yAxis: {
            title: { text: null }
          },
          plotOptions: {
            pie: {
              showInLegend: true,
              dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                  color: 'white'
                },
                // @ts-ignore
                formatter: function () {
                  // @ts-ignore
                  return this.point.y;
                }
              }
            }
          },
          series: [{
            'name': '',
            type: 'pie',
            innerSize: '50%',
            'data': getSeriesData()
          }],
          legend: {
            enabled: true,
            align:'right',
            layout: 'vertical',
            itemStyle: {
              fontWeight: '200'
            }
          }
        }}
      />
    </div>
  );
}

export default AssessmentAlertGraph;
