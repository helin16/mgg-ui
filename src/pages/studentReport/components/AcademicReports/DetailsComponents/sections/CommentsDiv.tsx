import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import SectionDiv from './SectionDiv';
import {useEffect, useState} from 'react';

const CommentsDiv = ({result}: {result: iStudentReportResult}) => {
  const [comments, setComments] = useState('');

  useEffect(() => {
    setComments(`${result.AssessmentComment || ''}`);
  }, [result]);


  if (comments.trim() === '') {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger'}><i>Comments</i></h3>
      <p>{comments}</p>
    </SectionDiv>
  )
};

export default CommentsDiv;
