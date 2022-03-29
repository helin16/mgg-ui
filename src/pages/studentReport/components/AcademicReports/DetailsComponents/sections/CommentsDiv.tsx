import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import SectionDiv from './SectionDiv';
import {useEffect, useState} from 'react';

const CommentsDiv = ({result}: {result: iStudentReportResult}) => {
  const [comments, setComments] = useState('');

  useEffect(() => {
    let isCancelled = false;
    setComments(`${result.AssessmentComment || ''}`);
    return () => {
      isCancelled = true
    };
  }, [JSON.stringify(result)]);


  if (comments.trim() === '') {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger'}><i>Comments</i></h3>
      <p>{result.AssessmentComment}</p>
    </SectionDiv>
  )
};

export default CommentsDiv;
