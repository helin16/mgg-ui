import React from 'react';
import {iSubjectPageParams, StudentAcademicSubjectPageHeader, SubjectPageWrapper} from './StudentAcademicSubjectPage';
import AttitudeAndManagementDiv from '../sections/AttitudeAndManagementDiv';
import ReflectionDiv from '../sections/RefelectionDiv';
import CommentsDiv from '../sections/CommentsDiv';
import CoCurricularActivitiesDiv from '../sections/CoCurricularActivitiesDiv';
import AwardsDiv from '../sections/AwardsDiv';
import TeachersDiv from '../sections/TeacherDiv';
import ApproachesToLearningDiv from '../sections/ApproachesToLearningDiv';

const HomeGroupPage = ({
  student, studentReportYear, selectedReportResults
}: iSubjectPageParams) => {

  console.log(selectedReportResults);
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
        showHeadOfSchool={true}
        showHeadOfYear={true}
        teacherTitle={`${selectedReportResults[0].teacherTitlePrefix} Teacher`}
      />
    </SubjectPageWrapper>
  )
};

export default HomeGroupPage;
