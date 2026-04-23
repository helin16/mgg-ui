import iVStudent from '../../../types/Synergetic/Student/iVStudent';
import PageTitle from '../../../components/PageTitle';
import {Button, Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import iStudentReportYear from '../../../types/Synergetic/Student/iStudentReportYear';
import ReportedYearsList from './AcademicReports/ReportedYearsList';
import StudentAcademicReportDetails from './AcademicReports/StudentAcademicReportDetails';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import {mainBlue} from '../../../AppWrapper';
import StudentStatusBadge from './AcademicReports/StudentStatusBadge';
import {FlexContainer} from '../../../styles';
import WellBeingGraphPanel from './WellBeingGraphs/WellBeingGraphPanel';
import StudentParticipationPanel from './StudentParticipation/StudentParticipationPanel';

const TAB_STUDENT_PARTICIPATION = 'studentParticipation';
const TAB_WELL_BEING = 'wellBeing';

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


type iStudentDetailsPage = {student: iVStudent; onClearSelectedStudent?: () => void; showTitle?: boolean}

const StudentDetailsPage = ({student ,onClearSelectedStudent, showTitle = true}: iStudentDetailsPage) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedTab, setSelectedTab] = useState(TAB_STUDENT_PARTICIPATION);
  const [selectedStudentReportYear, setSelectedStudentReportYear] = useState<iStudentReportYear | null>(null);

  const getTabs = () => {
    return (
      <Tabs
        className={'main-tabs'}
        activeKey={selectedTab}
        onSelect={(tabKey) => setSelectedTab(`${tabKey}`)}
      >
        <Tab key={TAB_STUDENT_PARTICIPATION} eventKey={TAB_STUDENT_PARTICIPATION} title={'Student Participation (Staff Only)'} />
        <Tab key={TAB_WELL_BEING} eventKey={TAB_WELL_BEING} title={'WellBeing (Staff Only)'} />
      </Tabs>
    )
  }

  const getTabContent = () => {
    if (selectedTab === TAB_STUDENT_PARTICIPATION) {
      return <StudentParticipationPanel student={student}/>
      // return <PowerBIReportViewer reportId={powerBIReports[selectedTab].reportId || ''} student={student}/>
    }
    if (selectedTab === TAB_WELL_BEING) {
      return <WellBeingGraphPanel student={student}/>
    }
    return <ReportedYearsList student={student} onSelect={(studentReportYear) => setSelectedStudentReportYear(studentReportYear)}/>
  }

  const getContent = () => {
    if (selectedStudentReportYear !== null) {
      return (
        <StudentAcademicReportDetails
          student={student}
          studentReportYear={selectedStudentReportYear}
          onClearReportYear={() => setSelectedStudentReportYear(null) }
          onClearSelectedStudent={onClearSelectedStudent }
        />
      );
    }

    const getBackToMainBtn = () => {
      if (user?.isStudent === true) {
        return null;
      }

      if (onClearSelectedStudent) {
        return (
          <Button variant={'link'} title={'back to search'} size={'sm'} onClick={() => onClearSelectedStudent()}>
            <Icon.ArrowLeft />
          </Button>
        )
      }
    }

    const getPageTitle = () => {
      if (showTitle !== true) {
        return null;
      }

      return (
        <PageTitle
          operations={
            <FlexContainer className={'withGap justify-content flex-end align-items center'}>
              <StudentStatusBadge student={student} />
              <h3 className={'text-right'}>
                {student.StudentGiven1} {' '}
                {student.StudentSurname} {' '}
                ({student.StudentID})
              </h3>
            </FlexContainer>
          }
        >
          <h3>
            {getBackToMainBtn()}
          </h3>
        </PageTitle>
      )
    }

    return (
      <>
        {getPageTitle()}
        {getTabs()}
        {getTabContent()}
      </>
    )
  }

  return <Wrapper className={'student-details-page'}>{getContent()}</Wrapper>;
};

export default StudentDetailsPage;
