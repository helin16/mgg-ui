import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ACHIEVEMENT_STANDARDS
} from '../../../../../../types/student/iStudentReportResult';
import React, {useEffect, useState} from 'react';
import GraphTable from './GraphTable';
import OverallAchievementStandardsDiv from './OverallAchievementStandardsDiv';

const resultTranslateMap = {
  '1': {name: 'Well Below', width: 8},
  '2': {name: 'Below', width: 29},
  '3': {name: 'At Standard', width: 50},
  '4': {name: 'Above', width: 72},
  '5': {name: 'Well Above', width: 100},
}

const AchievementStandardsDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [aSResults, setASResults] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    setASResults(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ACHIEVEMENT_STANDARDS)
    )
  }, [results]);

  if (aSResults.length <= 0) {
    return null;
  }

  return (
    <>
      <GraphTable
        results={aSResults}
        title={'Achievement Standards'}
        resultTranslateMap={resultTranslateMap}
      />

      <OverallAchievementStandardsDiv results={results} />
    </>
  );
};

export default AchievementStandardsDiv;
