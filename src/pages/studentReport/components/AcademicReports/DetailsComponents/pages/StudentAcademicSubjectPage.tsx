import React from 'react';
import styled from 'styled-components';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import {Col, Row} from 'react-bootstrap';
import PanelTitle from '../../../../../../components/PanelTitle';
import AchievementStandardsDiv from '../sections/AchievementStandardsDiv';
import OverallAchievementStandardsDiv from '../sections/OverallAchievementStandardsDiv';
import ApproachesToLearningDiv from '../sections/ApproachesToLearningDiv';
import TeachersDiv from '../sections/TeacherDiv';
import {getStudentReportClassname} from '../Helpers/AcademicReportHelper';
import KnowledgeAndSkillsDiv from '../sections/KnowledgeAndSkillsDiv';
import AttitudeAndManagementDiv from '../sections/AttitudeAndManagementDiv';
import CommentsDiv from '../sections/CommentsDiv';
import SubjectDescriptionDiv from '../sections/SubjectDescriptionDiv';

export const SubjectPageWrapper = styled.div`
  .d-table {
    width: 100%;
  }
`;

export type iSubjectPageParams = StudentAcademicReportDetailsProps & {selectedReportResults: iStudentReportResult[]};
export const StudentAcademicSubjectPageHeader = ({student, selectedReportResults}: iSubjectPageParams) => {
  return (
    <>
      <h3 className={'d-table'}>
        {getStudentReportClassname(selectedReportResults[0])}
        <div className={'pull-right d-table-cell'}>
          {student.StudentGiven1} {student.StudentSurname}
        </div>
      </h3>

      <PanelTitle>
        <Row>
          <Col>
            House: {student.StudentHouseDescription}
          </Col>
          <Col className={'text-right'}>
            {selectedReportResults[0].StudentForm}
          </Col>
        </Row>
      </PanelTitle>

      <SubjectDescriptionDiv result={selectedReportResults[0]} />
    </>
  )
}

const StudentAcademicSubjectPage = ({
   student, studentReportYear, selectedReportResults
  }: iSubjectPageParams
) => {
  return (
    <SubjectPageWrapper>
      <StudentAcademicSubjectPageHeader
        student={student}
        studentReportYear={studentReportYear}
        selectedReportResults={selectedReportResults}
      />

      <AchievementStandardsDiv results={selectedReportResults} />
      <OverallAchievementStandardsDiv results={selectedReportResults} />
      <ApproachesToLearningDiv results={selectedReportResults} />
      <KnowledgeAndSkillsDiv results={selectedReportResults} />
      <AttitudeAndManagementDiv results={selectedReportResults} />

      <CommentsDiv result={selectedReportResults[0]} />
      <TeachersDiv results={selectedReportResults} />

    </SubjectPageWrapper>
  )
}

export default StudentAcademicSubjectPage;
