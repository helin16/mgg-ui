import React from "react";
import styled from "styled-components";
import { StudentAcademicReportDetailsProps } from "../../StudentAcademicReportDetails";
import iStudentReportResult from "../../../../../../types/Synergetic/Student/iStudentReportResult";
import AchievementStandardsDiv from "../sections/AchievementStandardsDiv";
import ApproachesToLearningDiv from "../sections/ApproachesToLearningDiv";
import TeachersDiv from "../sections/TeacherDiv";
import { getStudentReportClassname } from "../Helpers/AcademicReportHelper";
import KnowledgeAndSkillsDiv from "../sections/KnowledgeAndSkillsDiv";
import AttitudeAndManagementDiv from "../sections/AttitudeAndManagementDiv";
import CommentsDiv from "../sections/CommentsDiv";
import SubjectDescriptionDiv from "../sections/SubjectDescriptionDiv";
import PageTitleDivider from "../sections/PageTitleDivider";
import LearningBehavioursDiv from "../sections/LearningBehavioursDiv";
import AssessmentTasksDiv from "../sections/AssessmentTasksDiv";
import OutcomesDiv from "../sections/OutcomesDiv";
import ReflectionDiv from "../sections/RefelectionDiv";
import { FlexContainer } from "../../../../../../styles";
import StudentStatusBadge from "../../StudentStatusBadge";
import ComparativeSection from "../sections/ComparativeSection";

export const SubjectPageWrapper = styled.div`
  .d-table {
    width: 100%;
    .title {
      display: inline-block;
    }
  }
`;

export type iSubjectPageParams = StudentAcademicReportDetailsProps & {
  selectedReportResults: iStudentReportResult[];
};
export const StudentAcademicSubjectPageHeader = ({
  student,
  selectedReportResults
}: iSubjectPageParams) => {
  return (
    <>
      <div className={"d-table"}>
        <h4 className={"title"}>
          {getStudentReportClassname(selectedReportResults[0])}
        </h4>
        <div className={"pull-right d-table-cell"}>
          <FlexContainer
            className={"withGap justify-content flex-end align-items center"}
          >
            <StudentStatusBadge student={student} />
            <h4>
              {student.StudentGiven1} {student.StudentSurname} (
              {student.StudentID})
            </h4>
          </FlexContainer>
        </div>
      </div>

      <PageTitleDivider
        student={student}
        studentReportResult={selectedReportResults[0]}
      />

      <SubjectDescriptionDiv result={selectedReportResults[0]} />
    </>
  );
};

const StudentAcademicSubjectPage = ({
  student,
  studentReportYear,
  selectedReportResults
}: iSubjectPageParams) => {
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

      <ComparativeSection
        results={selectedReportResultList}
        studentReportYear={studentReportYear}
      />
      <OutcomesDiv results={selectedReportResultList} />
      <AssessmentTasksDiv results={selectedReportResultList} />
      <AchievementStandardsDiv results={selectedReportResultList} />

      <ApproachesToLearningDiv results={selectedReportResultList} />
      <KnowledgeAndSkillsDiv results={selectedReportResultList} />
      <AttitudeAndManagementDiv results={selectedReportResultList} />
      <LearningBehavioursDiv results={selectedReportResultList} />

      <ReflectionDiv
        results={selectedReportResultList}
        title={"Student Reflection"}
      />
      <CommentsDiv result={selectedReportResultList[0]} />
      <TeachersDiv results={selectedReportResultList} />
    </SubjectPageWrapper>
  );
};

export default StudentAcademicSubjectPage;
