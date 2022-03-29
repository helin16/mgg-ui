import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import SectionDiv from './SectionDiv';
import React, {useEffect, useState} from 'react';

const SubjectDescriptionDiv = ({result}: {result: iStudentReportResult}) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    let isCancelled = false;
    setDescription(`${result.AssessOverview || ''}`);
    return () => {
      isCancelled = true
    };
  }, [JSON.stringify(result)]);


  if (description.trim() === '') {
    return null;
  }

  return (
    <SectionDiv>
      <h3 className={'text-danger text-italic'}>Subject Description</h3>
      <p>{result.AssessOverview}</p>
    </SectionDiv>
  )
};

export default SubjectDescriptionDiv;
