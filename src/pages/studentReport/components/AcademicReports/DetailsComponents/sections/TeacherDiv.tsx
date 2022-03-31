import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import {useEffect, useState} from 'react';
import SectionDiv from './SectionDiv';
import styled from 'styled-components';
import iSchoolManagementTeam from '../../../../../../types/SMT/iSchoolManagementTeam';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

type iTeacherDiv = {
  results: iStudentReportResult[];
  headOfYear?: iSchoolManagementTeam;
  headOfSchool?: iSchoolManagementTeam;
  teacherTitle?: string;
  headOfSchoolTitle?: string;
}

const TeachersDiv = ({
  results, headOfYear, headOfSchool, teacherTitle = 'Teacher', headOfSchoolTitle ='Head Of School'
}: iTeacherDiv) => {
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    if (results.length <= 0) { return }
    setTeacherName(results[0].StaffName)
  }, [results]);

  const getHeadOfSchoolDiv = () => {
    if (!headOfSchool) {
      return <div></div>;
    }
    return (
      <div className={'head-of-school text-left'}>
        <div>{headOfSchool.SynSSTStaff?.Title} {headOfSchool.SynSSTStaff?.Initials} {headOfSchool.SynSSTStaff?.Surname}</div>
        {(headOfSchool.Comments && headOfSchool.Comments.trim() !== '') ? <div><b>{headOfSchool.Comments}</b></div> : null}
        <div><b>{headOfSchoolTitle}</b></div>
      </div>
    )
  }
  const getHeadOfYearDiv = () => {
    if (!headOfYear) {
      return null;
    }
    return (
      <div className={'head-of-year text-center'}>
        <div>{headOfYear.SynSSTStaff?.Title} {headOfYear.SynSSTStaff?.Initials} {headOfYear.SynSSTStaff?.Surname}</div>
        <div><b>Head of Year</b></div>
      </div>
    )
  }

  return (
    <SectionDiv>
      <Wrapper>
        {getHeadOfSchoolDiv()}
        {getHeadOfYearDiv()}
        <div className={'text-right'}>
          <div>{teacherName}</div>
          <div><b>{teacherTitle}</b></div>
        </div>
      </Wrapper>
    </SectionDiv>
  );
};

export default TeachersDiv;
