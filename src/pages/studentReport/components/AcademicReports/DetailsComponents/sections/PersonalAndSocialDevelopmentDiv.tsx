import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_PERSONAL_AND_SOCIAL_DEVELOPMENT
} from '../../../../../../types/Synergetic/Student/iStudentReportResult';
import {useEffect, useState} from 'react';
import GraphTable from './GraphTable';

const resultTranslateMap = {
  'R': {name: 'Rarely', width: 5},
  'S': {name: 'Sometimes', width: 33},
  'U': {name: 'Usually', width: 60},
  'C': {name: 'Consistently', width: 100},
}

const PersonalAndSocialDevelopmentDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    setResultList(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_PERSONAL_AND_SOCIAL_DEVELOPMENT)
        .sort((result1, result2) => result1.AssessAreaSeq > result2.AssessAreaSeq ? 1 : -1)
    )
  }, [results]);

  if (resultList.length < 0) {
    return null;
  }

  return (
    <GraphTable
      results={resultList}
      title={'Personal And Social Development'}
      resultTranslateMap={resultTranslateMap}
    />
  )
};

export default PersonalAndSocialDevelopmentDiv;
