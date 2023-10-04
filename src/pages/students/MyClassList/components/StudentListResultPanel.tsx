import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import iVStudent from '../../../../types/Synergetic/iVStudent';
import {Image, Table} from 'react-bootstrap';
import styled from 'styled-components';
import iSynVStudentClass from '../../../../types/Synergetic/iSynVStudentClass';
import StudentListExportBtn from './StudentListExportBtn';
import moment from 'moment-timezone';

type iStudentListResultPanel = {
  isLoading: boolean;
  students: iVStudent[];
  studentClassCodeMap: { [key: number]: iSynVStudentClass[] };
}

const Wrapper = styled.div`
  td.photo {
    width: 80px;
    img {
      width: 100%;
      height: auto;
    }
  }
`;

const StudentListResultPanel = ({isLoading = false, students, studentClassCodeMap}: iStudentListResultPanel) => {
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Table striped size={'sm'} hover>
        <thead>
          <tr>
            <th className={'photo'}></th>
            <th className={'id'}>Student ID</th>
            <th className={'name'}>Name</th>
            <th className={'dob'}>DOB</th>
            <th className={'form'}>Form</th>
            <th className={'year-level'}>Year Level</th>
            <th className={'house'}>House</th>
            <th className={'email'}>email</th>
            <th className={'classes'}>
              classes
              <StudentListExportBtn
                students={students}
                studentClassCodeMap={studentClassCodeMap}
                className={'float-end'}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {
            students.map(student => {
              return (
                <tr key={student.StudentID}>
                  <td className={'photo'}>
                    <Image src={student.profileUrl} />
                  </td>
                  <td className={'id'}>{student.StudentID}</td>
                  <td className={'name'}>{student.StudentNameInternal}</td>
                  <td className={'dob'}>{moment(student.StudentBirthDate).format('DD/MMM/YYYY')}</td>
                  <td className={'form'}>{student.StudentForm}</td>
                  <td className={'year-level'}>{student.StudentYearLevel}</td>
                  <td className={'house'}>{student.StudentHouse}</td>
                  <td className={'email'}>{student.StudentOccupEmail}</td>
                  <td className={'classes'}>{
                    (student.StudentID in studentClassCodeMap ? studentClassCodeMap[student.StudentID] : [])
                      .map(studentClass => studentClass.ClassCode)
                      .join(' | ')
                  }</td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </Wrapper>
  );
}

export default StudentListResultPanel;
