import iStudentReportResult from '../../../../../../types/Synergetic/iStudentReportResult';
import React, {useEffect, useState} from 'react';
import SectionDiv from './SectionDiv';
import styled from 'styled-components';
import iSchoolManagementTeam, {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL, SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
} from '../../../../../../types/Synergetic/iSchoolManagementTeam';
import SchoolManagementTeamService from '../../../../../../services/Synergetic/SchoolManagementTeamService';
import {OP_OR} from '../../../../../../helper/ServiceHelper';
import {Spinner} from 'react-bootstrap';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

type iTeacherDiv = {
  results: iStudentReportResult[];
  teacherTitle?: string;
  showHeadOfYear?: boolean;
  showHeadOfSchool?: boolean;
}

const TeachersDiv = ({
  results,
  showHeadOfYear = false,
  showHeadOfSchool = false,
  teacherTitle = 'Teacher',
}: iTeacherDiv) => {
  const [isLoading, setIsLoading] = useState(false);
  const [headOfYearTeacher, setHeadOfYearTeacher] = useState<iSchoolManagementTeam | undefined>(undefined);
  const [headOfSchoolTeacher, setHeadOfSchoolTeacher] = useState<iSchoolManagementTeam | undefined>(undefined);
  const [headOfSchoolCode, setHeadOfSchoolCode] = useState('');
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    let isCancelled = false;
    if (results.length <= 0) {
      return;
    }
    setTeacherName(results[0].StaffName);
    if (showHeadOfYear === false && showHeadOfSchool === false) {
      return;
    }
    setIsLoading(true);
    const result = results[0];
    const headOfSchoolCode = (
      result.ClassCampus.toUpperCase().trim() === 'S' ?
        SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL :
        SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL
    );
    setHeadOfSchoolCode(headOfSchoolCode);
    SchoolManagementTeamService.getSchoolManagementTeams({
      include: 'SynSSTStaff',
      where: JSON.stringify({
        FileYear: result.FileYear,
        FileSemester: result.FileSemester,
        SchoolRoleCode: [SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR, headOfSchoolCode],
        [OP_OR]: [
          {YearLevelCode: result.StudentYearLevel},
          {YearLevelCode: null},
        ]
      })
    })
      .then(resp => {
        if(isCancelled === true) { return }
        if (showHeadOfYear === true) {
          setHeadOfYearTeacher(
            resp.filter(result => result.SchoolRoleCode === SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR)[0]
          );
        }
        if (showHeadOfSchool === true) {
          setHeadOfSchoolTeacher(
            resp.filter(result => result.SchoolRoleCode === headOfSchoolCode)[0]
          );
        }
        setIsLoading(false)
      })
    return () => {
      isCancelled = true;
    }
  }, [results, showHeadOfYear, showHeadOfSchool])

  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  const getHeadOfSchoolDiv = () => {
    if (!headOfSchoolTeacher) {
      return <div></div>;
    }
    return (
      <div className={'head-of-school text-left'}>
        <div>{headOfSchoolTeacher.SynSSTStaff?.Title} {headOfSchoolTeacher.SynSSTStaff?.Initials} {headOfSchoolTeacher.SynSSTStaff?.Surname}</div>
        {(headOfSchoolTeacher.Comments && headOfSchoolTeacher.Comments.trim() !== '') ? <div><b>{headOfSchoolTeacher.Comments}</b></div> : null}
        <div><b>{`Head of ${headOfSchoolCode === SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL ? 'Junior' : 'Senior'} School`}</b></div>
      </div>
    )
  }
  const getHeadOfYearDiv = () => {
    if (!headOfYearTeacher) {
      return null;
    }
    return (
      <div className={'head-of-year text-center'}>
        <div>{headOfYearTeacher.SynSSTStaff?.Title} {headOfYearTeacher.SynSSTStaff?.Initials} {headOfYearTeacher.SynSSTStaff?.Surname}</div>
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
