import iVStudent, {
  SYN_STUDENT_STATUS_ID_LEAVING,
  SYN_STUDENT_STATUS_ID_LEFT
} from '../../../../types/Synergetic/Student/iVStudent';
import {Badge} from 'react-bootstrap';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  .StudentStatusBadge-div {
    font-size: 10px;
  }
`
type iStudentStatusBadge = {
  student: iVStudent;
  className?: string;
}
const StudentStatusBadge = ({student, className}: iStudentStatusBadge) => {
  if ([SYN_STUDENT_STATUS_ID_LEAVING, SYN_STUDENT_STATUS_ID_LEFT].indexOf(student.StudentStatus) < 0) {
    return null;
  }
  return (
    <Wrapper>
      <Badge bg={'danger'} className={`StudentStatusBadge-div ${className || ''}`}>
        {student.StudentStatusDescription}
      </Badge>
    </Wrapper>
  )
}

export default StudentStatusBadge;
