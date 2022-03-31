import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_ASSESSMENT_JNR
} from '../../../../../../types/student/iStudentReportResult';
import {useEffect, useState} from 'react';
import SectionDiv from './SectionDiv';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-weight: bold;
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
`;

const translateOverallResult = (result: string) => {
  switch(result.toUpperCase()) {
    case 'A':
      return 'achieved with distinction';
    case 'B':
      return 'achieved with credit';
    case 'C':
      return 'achieved';
    case 'D':
      return 'achieved to a limited extent';
    case 'E':
      return 'rarely achieved';
    default:
      return null;
  }
}

const OverallAchievementStandardsDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);
  useEffect(() => {
    setResultList(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_ASSESSMENT_JNR)
    )
  }, [results]);

  if (resultList.length <= 0) {
    return null;
  };

  return (
    <SectionDiv>
      <Wrapper>
        <div>OVERALL ACHIEVEMENT IN RELATION TO STANDARDS</div>
        <div>The expected standards were {translateOverallResult(resultList[0].AssessResultsResult || '')}</div>
      </Wrapper>
    </SectionDiv>
  )
};

export default OverallAchievementStandardsDiv;
