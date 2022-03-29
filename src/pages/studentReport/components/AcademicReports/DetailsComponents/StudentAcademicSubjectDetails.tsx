import React from 'react';
import styled from 'styled-components';
import {StudentAcademicReportDetailsProps} from '../StudentAcademicReportDetails';
import iStudentReportResult from '../../../../../types/student/iStudentReportResult';
import {Col, Row} from 'react-bootstrap';
import PanelTitle from '../../../../../components/PanelTitle';
import SectionDiv from './sections/SectionDiv';
import AchievementStandardsDiv from './sections/AchievementStandardsDiv';
import OverallAchievementStandardsDiv from './sections/OverallAchievementStandardsDiv';
import ApproachesToLearningDiv from './sections/ApproachesToLearningDiv';
import TeachersDiv from './sections/TeacherDiv';
import {getStudentReportClassname} from './Helpers/AcademicReportHelper';
import KnowledgeAndSkillsDiv from './sections/KnowledgeAndSkillsDiv';
import AttitudeAndManagementDiv from './sections/AttitudeAndManagementDiv';
import CommentsDiv from './sections/CommentsDiv';
import SubjectDescriptionDiv from './sections/SubjectDescriptionDiv';

const Wrapper = styled.div`
  .d-table {
    width: 100%;
  }
`;

const StudentAcademicSubjectDetails = ({
   student, studentReportYear, selectedReportResults
  }: StudentAcademicReportDetailsProps & {selectedReportResults: iStudentReportResult[]}
) => {
  return (
    <Wrapper>
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
            {student.StudentForm}
          </Col>
        </Row>
      </PanelTitle>

      <SubjectDescriptionDiv result={selectedReportResults[0]} />

      <AchievementStandardsDiv results={selectedReportResults} />
      <OverallAchievementStandardsDiv results={selectedReportResults} />
      <ApproachesToLearningDiv results={selectedReportResults} />
      <KnowledgeAndSkillsDiv results={selectedReportResults} />
      <AttitudeAndManagementDiv results={selectedReportResults} />

      <CommentsDiv result={selectedReportResults[0]} />
      <TeachersDiv results={selectedReportResults} studentReportYear={studentReportYear}/>

    </Wrapper>
  )
}

export default StudentAcademicSubjectDetails;
