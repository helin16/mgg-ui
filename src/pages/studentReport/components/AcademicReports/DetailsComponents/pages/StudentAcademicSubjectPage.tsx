import React from 'react';
import styled from 'styled-components';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import iStudentReportResult from '../../../../../../types/Synergetic/iStudentReportResult';
import AchievementStandardsDiv from '../sections/AchievementStandardsDiv';
import ApproachesToLearningDiv from '../sections/ApproachesToLearningDiv';
import TeachersDiv from '../sections/TeacherDiv';
import {getStudentReportClassname} from '../Helpers/AcademicReportHelper';
import KnowledgeAndSkillsDiv from '../sections/KnowledgeAndSkillsDiv';
import AttitudeAndManagementDiv from '../sections/AttitudeAndManagementDiv';
import CommentsDiv from '../sections/CommentsDiv';
import SubjectDescriptionDiv from '../sections/SubjectDescriptionDiv';
import PageTitleDivider from '../sections/PageTitleDivider';
import LearningBehavioursDiv from '../sections/LearningBehavioursDiv';
import AssessmentTasksDiv from '../sections/AssessmentTasksDiv';
import OutcomesDiv from '../sections/OutcomesDiv';
import ReflectionDiv from '../sections/RefelectionDiv';

export const SubjectPageWrapper = styled.div`
  .d-table {
    width: 100%;
  }
`;

export type iSubjectPageParams = StudentAcademicReportDetailsProps & {selectedReportResults: iStudentReportResult[]};
export const StudentAcademicSubjectPageHeader = ({student, selectedReportResults}: iSubjectPageParams) => {
  return (
    <>
      <h4 className={'d-table'}>
        {getStudentReportClassname(selectedReportResults[0])}
        <div className={'pull-right d-table-cell'}>
          {student.StudentGiven1} {student.StudentSurname}
        </div>
      </h4>

      <PageTitleDivider student={student} studentReportResult={selectedReportResults[0]} />

      <SubjectDescriptionDiv result={selectedReportResults[0]} />
    </>
  )
}

const StudentAcademicSubjectPage = ({
   student, studentReportYear, selectedReportResults
  }: iSubjectPageParams
) => {
  const selectedReportResultList = selectedReportResults.sort((res1, res2) => {
    return res1.AssessmentCode > res2.AssessmentCode ? 1 : -1;
  });

  return (
    <SubjectPageWrapper>
      <StudentAcademicSubjectPageHeader
        student={student}
        studentReportYear={studentReportYear}
        selectedReportResults={selectedReportResultList}
      />

      <OutcomesDiv results={selectedReportResultList}/>
      <AssessmentTasksDiv results={selectedReportResultList}/>
      <AchievementStandardsDiv results={selectedReportResultList} />

      <ApproachesToLearningDiv results={selectedReportResultList} />
      <KnowledgeAndSkillsDiv results={selectedReportResultList} />
      <AttitudeAndManagementDiv results={selectedReportResultList} />
      <LearningBehavioursDiv results={selectedReportResultList} />

      <ReflectionDiv results={selectedReportResultList} title={'Student Reflection'}/>
      <CommentsDiv result={selectedReportResultList[0]} />
      <TeachersDiv results={selectedReportResultList} />

    </SubjectPageWrapper>
  )
}

export default StudentAcademicSubjectPage;
