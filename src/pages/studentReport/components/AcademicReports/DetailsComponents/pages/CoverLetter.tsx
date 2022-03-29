import {Col, Image, Row} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import React from 'react';
import PanelTitle from '../../../../../../components/PanelTitle';
import SectionDiv from '../sections/SectionDiv';

const CoverLetter = ({student, studentReportYear}: StudentAcademicReportDetailsProps) => {
  return (
    <div className={'cover-letter-wrapper'}>
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
            {student.StudentForm}
          </Col>
        </Row>
      </PanelTitle>

      <SectionDiv>
        <Image
          src={student.profileUrl}
          rounded
          className={'pull-right'} />
        <div dangerouslySetInnerHTML={{__html: studentReportYear.LetterOfExplanation || ''}} />
      </SectionDiv>
    </div>
  )
};

export default CoverLetter;
