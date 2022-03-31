import React, {useEffect, useState} from 'react';
import {iSubjectPageParams, StudentAcademicSubjectPageHeader, SubjectPageWrapper} from './StudentAcademicSubjectPage';
import AttitudeAndManagementDiv from '../sections/AttitudeAndManagementDiv';
import ReflectionDiv from '../sections/RefelectionDiv';
import CommentsDiv from '../sections/CommentsDiv';
import CoCurricularActivitiesDiv from '../sections/CoCurricularActivitiesDiv';
import AwardsDiv from '../sections/AwardsDiv';
import TeachersDiv from '../sections/TeacherDiv';
import iSchoolManagementTeam, {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
} from '../../../../../../types/SMT/iSchoolManagementTeam';
import SchoolManagementTeamService from '../../../../../../services/SchoolManagementTeamService';
import {OP_OR} from '../../../../../../helper/ServiceHelper';
import {Spinner} from 'react-bootstrap';
import ApproachesToLearningDiv from '../sections/ApproachesToLearningDiv';

const HomeGroupPage = ({
  student, studentReportYear, selectedReportResults
}: iSubjectPageParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [headOfYearTeacher, setHeadOfYearTeacher] = useState<iSchoolManagementTeam | undefined>(undefined);
  const [headOfSchoolTeacher, setHeadOfSchoolTeacher] = useState<iSchoolManagementTeam | undefined>(undefined);
  const [headOfSchoolCode, setHeadOfSchoolCode] = useState('');

  useEffect(() => {
    let isCancelled = false;
    if (selectedReportResults.length <= 0) {
      return;
    }
    setIsLoading(true);
    const result = selectedReportResults[0];
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
        setHeadOfYearTeacher(
          resp.filter(result => result.SchoolRoleCode === SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR)[0]
        );
        setHeadOfSchoolTeacher(
          resp.filter(result => result.SchoolRoleCode === headOfSchoolCode)[0]
        );
        setIsLoading(false)
      })
    return () => {
      isCancelled = true;
    }
  }, [selectedReportResults])

  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  return (
    <SubjectPageWrapper className={'home-group-wrapper'}>
      <StudentAcademicSubjectPageHeader
        student={student}
        studentReportYear={studentReportYear}
        selectedReportResults={selectedReportResults}
      />

      <AttitudeAndManagementDiv results={selectedReportResults} />
      <ApproachesToLearningDiv results={selectedReportResults} />
      <ReflectionDiv results={selectedReportResults} />

      <CoCurricularActivitiesDiv student={student} studentReportYear={studentReportYear} />
      <AwardsDiv student={student} studentReportYear={studentReportYear} />

      <CommentsDiv result={selectedReportResults[0]} />

      <TeachersDiv
        results={selectedReportResults}
        headOfYear={headOfYearTeacher}
        headOfSchool={headOfSchoolTeacher}
        teacherTitle={'Home Group Teacher'}
        headOfSchoolTitle={`Head Of ${headOfSchoolCode === SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL ? 'Junior' : 'Senior'} School`}
      />
    </SubjectPageWrapper>
  )
};

export default HomeGroupPage;
