import iStudentReportResult from '../../../../../../types/Synergetic/iStudentReportResult';
import SectionDiv from '../../../../../../components/common/SectionDiv';
import {useEffect, useState} from 'react';

const CommentsDiv = ({result, title = 'Comments'}: {result: iStudentReportResult; title?: string}) => {
  const [comments, setComments] = useState('');

  useEffect(() => {
    setComments(`${result.AssessmentComment || ''}`);
  }, [result]);


  if (comments.trim() === '') {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger'}><i>{title}</i></h3>
      <p>{comments}</p>
    </SectionDiv>
  )
};

export default CommentsDiv;
