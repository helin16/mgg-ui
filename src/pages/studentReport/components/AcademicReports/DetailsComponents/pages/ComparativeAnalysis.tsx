import {Col, Row, Spinner} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import React, {useEffect, useState} from 'react';
import PanelTitle from '../../../../../../components/PanelTitle';
import SectionDiv from '../sections/SectionDiv';
import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import {
  iStudentReportComparativeResultMapRow
} from '../../../../../../types/student/iStudentReportComparativeResult';
import iStudentReportComparativeResultMap from '../../../../../../types/student/iStudentReportComparativeResult';
import StudentReportService from '../../../../../../services/StudentReportService';
import styled from 'styled-components';
import MathHelper from '../../../../../../helper/MathHelper';


const Wrapper = styled.div`
  .result-row {
    display: flex;
    padding: 0.4rem 0;
    justify-content: space-between;
    border-bottom:1px solid #ddd;
    &.result-title {
      font-weight: bold;
      background-color: transparent !important;
    }
    :nth-child(2n+1) {
      background-color: #f9f9f9;
    }
  }
`;

const ComparativeAnalysis = ({
  student, studentReportYear, studentReportResult
}: StudentAcademicReportDetailsProps & {studentReportResult: iStudentReportResult | null}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comparativeResults, setComparativeResults] = useState<iStudentReportComparativeResultMap>({});

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    StudentReportService.getStudentReportComparativeResultForAStudent(`${student.ID}`, `${studentReportYear.ID}`)
      .then(resp => {
        setComparativeResults(resp);
        if (isCancelled === true) { return }
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    };
  }, [JSON.stringify(student), JSON.stringify(studentReportYear)]);

  if (studentReportResult === null) {
    return null;
  }


  const getComparativeResultTable = (title: string, row: iStudentReportComparativeResultMapRow) => {
    return (
      <SectionDiv key={title}>
        <div className={'result-row result-title'}>
          <div>{title}</div>
          <div>Percentage of Cohort</div>
        </div>
        {
          Object.keys(row)
            .sort((code1, code2) => code1 > code2 ? 1 : -1)
            .map((code) => {
              return (
                <div className={'result-row'}>
                  <div>The expected standards were {row[code].name}</div>
                  <div>{MathHelper.mul(MathHelper.div(row[code].count, row[code].total), 100)} %</div>
                </div>
              )
            })
        }
      </SectionDiv>
    )
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }
    return Object.keys(comparativeResults)
      .sort((res1, res2) => res1 > res2 ? 1 : -1)
      .map(assessHeading => {
        return getComparativeResultTable(assessHeading, comparativeResults[assessHeading])
      })
  }


  return (
    <Wrapper className={'cover-letter-wrapper'}>
      <Row>
        <Col>
          <h3>Comparative Analysis</h3>
        </Col>
        <Col className={'text-right'}>
          <h3>{student.StudentGiven1} {student.StudentSurname}</h3>
        </Col>
      </Row>

      <div>
        <PanelTitle>
          Overview
        </PanelTitle>
        <p>
          The information provided on this page is designed to give you an understanding of your daughter's performance
          relative to her cohort in the key learning areas of English,
          Humanities, Languages, Mathematics, Science and The Arts.
          The tables below indicate the percentage of students in Year {studentReportResult.StudentYearLevelDescription} who were awarded
          the various levels on our five point scale for overall progress in relation to standards.
        </p>
      </div>

      <SectionDiv>
        <PanelTitle>
          How To Use This Information
        </PanelTitle>
        <p>
          Your daughter's overall achievement in relation to standards in a subject is reported on her individual subject report.
          The information below provides the percentage distribution of the overall ratings for all students
          in all subjects comprising each key learning area.
          By comparing your daughter's overall achievement in a subject with the percentage distribution in that subject,
          you will be able to make a judgement about her progress in relation to her cohort in that subject area.
        </p>
      </SectionDiv>

      <SectionDiv>
        {getContent()}
      </SectionDiv>
    </Wrapper>
  )
};

export default ComparativeAnalysis;
