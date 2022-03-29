import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ATTITUDE_AND_MANAGEMENT,
} from '../../../../../../types/student/iStudentReportResult';
import {useEffect, useState} from 'react';
import GraphTable from './GraphTable';

const resultTranslateMap = {
  'R': {name: 'Rarely', width: 5},
  'S': {name: 'Sometimes', width: 33},
  'U': {name: 'Usually', width: 60},
  'C': {name: 'Consistently', width: 100},
}

const AttitudeAndManagementDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setResultList(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ATTITUDE_AND_MANAGEMENT)
    )

    return () => {
      isCancelled = true;
    };
  }, [results]);

  return <GraphTable
    results={resultList}
    title={'Knowledge & Skills'}
    resultTranslateMap={resultTranslateMap}
  />;
};

export default AttitudeAndManagementDiv;
