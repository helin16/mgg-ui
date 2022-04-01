import PanelTitle from '../../../../../../components/PanelTitle';
import React from 'react';
import iVStudent from '../../../../../../types/student/iVStudent';
import iStudentReportResult from '../../../../../../types/student/iStudentReportResult';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`
const PageTitleDivider = ({student, studentReportResult}: {student: iVStudent, studentReportResult: iStudentReportResult | null}) => {
  return (
    <PanelTitle>
      <Wrapper className={'d-table'}>
        House: {student.StudentHouseDescription}
        <div className={'d-table-cell text-right'}>
          {studentReportResult?.StudentFormHomeRoom || ''}
        </div>
      </Wrapper>
    </PanelTitle>
  )
}

export default PageTitleDivider;
