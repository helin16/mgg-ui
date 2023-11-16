import iStudentReportResult from '../../../../../../types/Synergetic/Student/iStudentReportResult';
import SectionDiv from '../../../../../../components/common/SectionDiv';
import React, {useEffect, useState} from 'react';

const SubjectDescriptionDiv = ({result}: {result: iStudentReportResult}) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDescription(`${result.AssessOverview || ''}`);
  }, [result]);


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
