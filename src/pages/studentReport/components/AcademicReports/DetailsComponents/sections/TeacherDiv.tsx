import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import {useEffect, useState} from 'react';
import SectionDiv from './SectionDiv';
import styled from 'styled-components';
import iStudentReportYear from '../../../../../../types/student/iStudentReportYear';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const TeachersDiv = ({results, studentReportYear}: {results: iStudentReportResult[]; studentReportYear: iStudentReportYear}) => {
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    let isCancelled = false;
    if (results.length <= 0) { return }
    setTeacherName(results[0].StaffName )
    return () => {
      isCancelled = true;
    };
  }, [results]);

  return (
    <SectionDiv>
      <Wrapper>
        <div></div>
        <div className={'text-right'}>
          <div>{teacherName}</div>
          <div><b>Teacher</b></div>
        </div>
      </Wrapper>
    </SectionDiv>
  );
};

export default TeachersDiv;
