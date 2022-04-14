import iVStudent from '../../../types/Synergetic/iVStudent';
import PageTitle from '../../../components/PageTitle';
import {Button, Spinner, Tab, Tabs} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import iStudentReportYear from '../../../types/Synergetic/iStudentReportYear';
import ReportedYearsList from './AcademicReports/ReportedYearsList';
import StudentAcademicReportDetails from './AcademicReports/StudentAcademicReportDetails';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import StudentReportService from '../../../services/Synergetic/StudentReportService';
import {iPowerBiReportMap} from '../../../types/student/iPowerBIReports';
import PowerBIReportViewer from '../../../components/powerBI/PowerBIReportViewer';
import AssessmentGraph from './AssessmentGraph/AssessmentGraph';
import {mainBlue} from '../../../AppWrapper';

const TAB_ACADEMIC_REPORTS = 'academicReports';
const TAB_STUDENT_PARTICIPATION = 'studentParticipation';
const TAB_STANDARDISED_TESTS = 'standardisedTests';
const TAB_SCHOOL_BASED_ASSESSMENTS = 'schoolBasedAssessments';
const TAB_WELL_BEING = 'wellBeing';

const REPORT_ID_ASSESSMENT_GRAPH = 'ASSESSMENT_GRAPH';


const Wrapper = styled.div`
  font-size: 14px;
  .main-tabs {
    color: #fff;
    background-color: ${mainBlue};
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
`;


const StudentDetailsPage = ({student ,onClearSelectedStudent}: {student: iVStudent; onClearSelectedStudent: () => void}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedTab, setSelectedTab] = useState(TAB_ACADEMIC_REPORTS);
  const [selectedStudentReportYear, setSelectedStudentReportYear] = useState<iStudentReportYear | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [powerBIReports, setPowerBIReports] = useState<iPowerBiReportMap>({});

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true)
    StudentReportService.getPowerBIReports(student.StudentID)
      .then(resp => {
        if (isCancelled === true) { return; }
        setPowerBIReports(resp);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    }
  }, [student]);

  const getTabs = () => {
    const reportKeys = Object.keys(powerBIReports);
    return (
      <Tabs defaultActiveKey={selectedTab}
        className={'main-tabs'}
        activeKey={selectedTab}
        onSelect={(tabKey) => setSelectedTab(`${tabKey}`)}
      >
        <Tab eventKey={TAB_ACADEMIC_REPORTS} title={'Academic Reports'} />
        {reportKeys.map(reportKey => {
          return <Tab key={reportKey} eventKey={reportKey} title={powerBIReports[reportKey].name} />
        })}
      </Tabs>
    )
  }

  const getTabContent = () => {
    if (selectedTab === TAB_STUDENT_PARTICIPATION) {
      return <PowerBIReportViewer reportId={powerBIReports[selectedTab].reportId || ''} student={student}/>
    }
    if (selectedTab === TAB_STANDARDISED_TESTS) {
      return <PowerBIReportViewer reportId={powerBIReports[selectedTab].reportId || ''} student={student}/>
    }
    if (selectedTab === TAB_SCHOOL_BASED_ASSESSMENTS) {
      if (powerBIReports[selectedTab].reportId === REPORT_ID_ASSESSMENT_GRAPH) {
        return <AssessmentGraph student={student} />
      }
      return <PowerBIReportViewer reportId={powerBIReports[selectedTab].reportId || ''} student={student}/>
    }
    if (selectedTab === TAB_WELL_BEING) {
      return <PowerBIReportViewer reportId={powerBIReports[selectedTab].reportId || ''} student={student}/>
    }
    return <ReportedYearsList student={student} onSelect={(studentReportYear) => setSelectedStudentReportYear(studentReportYear)}/>
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />;
    }
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

        {getTabs()}
        {getTabContent()}
      </>
    )
  }

  return <Wrapper className={'student-details-page'}>{getContent()}</Wrapper>;
};

export default StudentDetailsPage;
