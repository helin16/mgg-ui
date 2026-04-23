import {Alert, Image} from 'react-bootstrap';
import {StudentAcademicReportDetailsProps} from '../../StudentAcademicReportDetails';
import React from 'react';
import SectionDiv from '../../../../../../components/common/SectionDiv';
import styled from 'styled-components';
import iStudentReportResult from '../../../../../../types/Synergetic/Student/iStudentReportResult';
import PageTitleDivider from '../sections/PageTitleDivider';
import StudentStatusBadge from '../../StudentStatusBadge';
import {FlexContainer} from '../../../../../../styles';

const Wrapper = styled.div`
  .d-table {
    width: 100%;
    .title {
      display: inline-block;
    }
  }
  .cover-letter {
    table {
      td {
        border-width: initial !important;
      }
    }
  }
`

const CoverLetterPage = ({student, studentReportYear, studentReportResult}: StudentAcademicReportDetailsProps & {studentReportResult: iStudentReportResult | null}) => {

  const getImage = () => {
    return (
      <Image
        src={student.profileUrl}
        rounded
        className={'pull-right'}
        style={{padding: '1.4rem', width: '15rem', height: 'auto'}}
      />
    )
  }

  const getCoverLetterContent = () => {
    if (`${studentReportYear.HideResultsToIds || ""}`
      .trim()
      .split(",")
      .map(id => Number(`${id || ""}`.trim()))
      .indexOf(student.StudentID) >= 0) {
      return <FlexContainer className={'p-3 gap-2 align-items-start justify-content-between flex-wrap'}>
        <Alert variant={'warning'}>Academic result has been marked as hidden. Further enquiries please contact school.</Alert>
        {getImage()}
      </FlexContainer>
    }
    return (
      <>
        {getImage()}
        <div dangerouslySetInnerHTML={{__html: studentReportYear.LetterOfExplanation || ''}}/>
      </>
    )
  }

  return (
    <Wrapper className={'cover-letter-wrapper'}>
      <div className={'d-table'}>
        <h4 className={'title'}>Academic Reports</h4>
        <div className={'pull-right d-table-cell'}>
          <FlexContainer className={'withGap justify-content flex-end align-items center'}>
            <StudentStatusBadge student={student} />
            <h4>{student.StudentGiven1} {student.StudentSurname} ({student.StudentID})</h4>
          </FlexContainer>
        </div>
      </div>

      <PageTitleDivider student={student} studentReportResult={studentReportResult} />

      <SectionDiv className={'cover-letter'}>

        {getCoverLetterContent()}
      </SectionDiv>
    </Wrapper>
  )
};

export default CoverLetterPage;
