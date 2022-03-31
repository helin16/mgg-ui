import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_REFLECT
} from '../../../../../../types/student/iStudentReportResult';
import SectionDiv from './SectionDiv';
import {useEffect, useState} from 'react';

const ReflectionDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [resultList, setResultList] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    setResultList(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_REFLECT)
    );
  }, [results]);


  if (resultList.length <= 0) {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger'}><i>Reflection</i></h3>
      <p>{resultList[0].TopicComment}</p>
    </SectionDiv>
  )
};

export default ReflectionDiv;
