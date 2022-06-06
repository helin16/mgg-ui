import {Image} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import React from 'react';
import SectionDiv from '../sections/SectionDiv';
import styled from 'styled-components';
import iStudentReportResult from '../../../../../../types/Synergetic/iStudentReportResult';
import PageTitleDivider from '../sections/PageTitleDivider';

const Wrapper = styled.div`
  .d-table {
    width: 100%;
  }
  .cover-letter {
    table {
      td {
        border: 1px solid;
        padding: 0px;
      }
    }
  }
`

const CoverLetterPage = ({student, studentReportYear, studentReportResult}: StudentAcademicReportDetailsProps & {studentReportResult: iStudentReportResult | null}) => {
  return (
    <Wrapper className={'cover-letter-wrapper'}>
      <h4 className={'d-table'}>
        Academic Reports
        <div className={'pull-right d-table-cell'}>
          {student.StudentGiven1} {student.StudentSurname} ({student.StudentID})
        </div>
      </h4>

      <PageTitleDivider student={student} studentReportResult={studentReportResult} />

      <SectionDiv className={'cover-letter'}>
        <Image
          src={student.profileUrl}
          rounded
          className={'pull-right'} />
        <div dangerouslySetInnerHTML={{__html: studentReportYear.LetterOfExplanation || ''}} />
      </SectionDiv>
    </Wrapper>
  )
};

export default CoverLetterPage;
