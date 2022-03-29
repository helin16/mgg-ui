import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_APPROACHES_TO_LEARNING
} from '../../../../../../types/student/iStudentReportResult';
import {useEffect, useState} from 'react';
import GraphTable from './GraphTable';

const resultTranslateMap = {
  'R': {name: 'Rarely', width: 5},
  'S': {name: 'Sometimes', width: 33},
  'U': {name: 'Usually', width: 60},
  'C': {name: 'Consistently', width: 100},
}

const ApproachesToLearningDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    let isCancelled = false;
    setResultList(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_APPROACHES_TO_LEARNING)
    )
    return () => {
      isCancelled = true;
    };
  }, [results]);

  return (
    <GraphTable
      results={resultList}
      title={'Approaches To Learning'}
      resultTranslateMap={resultTranslateMap}
    />
  )
};

export default ApproachesToLearningDiv;
