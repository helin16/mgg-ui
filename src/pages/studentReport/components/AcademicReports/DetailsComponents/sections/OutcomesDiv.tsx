import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OUTCOMES
} from '../../../../../../types/Synergetic/iStudentReportResult';
import {useEffect, useState} from 'react';
import GraphTable from './GraphTable';

const OutcomesDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [aSResults, setASResults] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    setASResults(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OUTCOMES)
        .sort((result1, result2) => result1.AssessAreaSeq > result2.AssessAreaSeq ? 1 : -1)
    )
  }, [results]);

  if (aSResults.length <= 0) {
    return null;
  }

  return (
    <>
      <GraphTable
        results={aSResults}
        title={'Outcomes'}
      />
    </>
  );
};

export default OutcomesDiv;
