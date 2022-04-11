import iVStudent from '../../../types/student/iVStudent';
import PageTitle from '../../../components/PageTitle';
import {Button, Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import iStudentReportYear from '../../../types/student/iStudentReportYear';
import ReportedYearsList from './AcademicReports/ReportedYearsList';
import StudentAcademicReportDetails from './AcademicReports/StudentAcademicReportDetails';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';

const TAB_ACADEMIC_REPORTS = 'academicReports';
const TAB_STUDENT_PARTICIPATION = 'studentParticipation';
const TAB_STANDARDISED_TESTS = 'standardisedTests';
const TAB_SCHOOL_BASED_ASSESSMENTS = 'schoolBasedAssessments';
const TAB_WELL_BEING = 'wellBeing';

const Wrapper = styled.div`
  font-size: 14px;
  .main-tabs {
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
    border-radius: 4px;
    margin-bottom: 20px;
    margin-left: 0px;
    padding: 6px 10px 0 10px;
    
    > li > button {
      color: white !important;
      &.active {
        color: #337ab7 !important;
      }
    }
  }
`

const StudentDetailsPage = ({student ,onClearSelectedStudent}: {student: iVStudent; onClearSelectedStudent: () => void}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedTab] = useState(TAB_ACADEMIC_REPORTS);
  const [selectedStudentReportYear, setSelectedStudentReportYear] = useState<iStudentReportYear | null>(null);

  const getContent = () => {
    if (selectedStudentReportYear !== null) {
      return (
        <StudentAcademicReportDetails
          student={student}
          studentReportYear={selectedStudentReportYear}
          onClearReportYear={() => setSelectedStudentReportYear(null) }
          onClearSelectedStudent={() => onClearSelectedStudent() }
        />
      );
    }

    const getBackToMainBtn = () => {
      if (user?.isStudent === true) {
        return null;
      }
      return (
        <Button variant={'link'} title={'back to search'} size={'sm'} onClick={() => onClearSelectedStudent()}>
          <Icon.ArrowLeft />
        </Button>
      )
    }

    return (
      <>
        <PageTitle
          operations={
            <h3 className={'text-right'}>
              {student.StudentGiven1} {' '}
              {student.StudentSurname} {' '}
              ({student.StudentID}) {' '}
              {student.StudentFormHomeRoom}
            </h3>
          }
        >
          <h3>
            {getBackToMainBtn()}
            Reports
          </h3>
        </PageTitle>

        <Tabs defaultActiveKey={selectedTab} className={'main-tabs'}>
          <Tab eventKey={TAB_ACADEMIC_REPORTS} title={'Academic Reports'} >
            <ReportedYearsList student={student} onSelect={(studentReportYear) => setSelectedStudentReportYear(studentReportYear)}/>
          </Tab>
          <Tab eventKey={TAB_STUDENT_PARTICIPATION} title={'Student Participation'}>
            Student Participation
          </Tab>
          <Tab eventKey={TAB_STANDARDISED_TESTS} title={'Standardised Tests'}>
            standardisedTests
          </Tab>
          <Tab eventKey={TAB_SCHOOL_BASED_ASSESSMENTS} title={'School-based Assessments'}>
            School-based Assessments
          </Tab>
          <Tab eventKey={TAB_WELL_BEING} title={'wellBeing(Staff Only)'}>
            WellBeing (Staff Only)
          </Tab>
        </Tabs>
      </>
    )
  }

  return <Wrapper className={'student-details-page'}>{getContent()}</Wrapper>;
};

export default StudentDetailsPage;
