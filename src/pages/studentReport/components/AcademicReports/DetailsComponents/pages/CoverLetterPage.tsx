import {Col, Image, Row} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import React from 'react';
import PanelTitle from '../../../../../../components/PanelTitle';
import SectionDiv from '../sections/SectionDiv';
import styled from 'styled-components';
import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';

const Wrapper = styled.div`
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
      <Row>
        <Col>
          <h3>Academic Reports</h3>
        </Col>
        <Col className={'text-right'}>
          <h3>{student.StudentGiven1} {student.StudentSurname}</h3>
        </Col>
      </Row>

      <PanelTitle>
        <Row>
          <Col>
            House: {student.StudentHouseDescription}
          </Col>
          <Col className={'text-right'}>
            {studentReportResult?.StudentForm || ''}
          </Col>
        </Row>
      </PanelTitle>

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
