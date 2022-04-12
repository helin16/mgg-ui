import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_MARKS,
} from '../../../../../../types/Synergetic/iStudentReportResult';
import {useEffect, useState} from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 8px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-weight: bold;
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
`;

const OverallAchievementStandardsDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);
  useEffect(() => {
    setResultList(
      results
        .filter(result => {
          return [
            STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_MARKS,
          ].indexOf(result.AssessAreaResultType) >= 0
        })
    )
  }, [results]);

  if (resultList.length <= 0) {
    return null;
  };

  return (
    <Wrapper>
      <div>OVERALL GRADE</div>
      <div>{resultList[0].overallGradeText}</div>
    </Wrapper>
  )
};

export default OverallAchievementStandardsDiv;
