import Page from '../../layouts/Page';
import {MGGS_MODULE_ID_ENROLLMENTS} from '../../types/modules/iModuleUser';
import EnrolmentManagementAdminPage from './EnrolmentManagementAdminPage';
import {Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import SectionDiv from '../../components/common/SectionDiv';
import ExpiringPassportsAndVisas from '../../components/Enrollments/ExpiringPassportsAndVisas';
import moment from 'moment-timezone';
import StudentNumberForecastDashboard
  from '../../components/reports/StudentNumberForecast/StudentNumberForecastDashboard';
import MathHelper from '../../helper/MathHelper';
import VRQAPanel from '../dataSubmissions/components/VRQA/VRQAPanel';
import AttendancesListWithSearchPanel from '../../components/Attendance/AttendancesListWithSearchPanel';
import EnrolmentDashboardPanel from '../../components/Enrollments/EnrolmentDashboardPanel';

enum TabNames {
  STUDENT_NUMBERS = 'STUDENT_NUMBERS',
  EXPIRING_PASSPORTS = 'EXPIRING_PASSPORTS',
  FORECAST_NEXT_YEAR = 'FORECAST_NEXT_YEAR',
  VRQA = 'VRQA',
  Attendances = 'Attendances',
}

const EnrolmentManagementPage = () => {
  const [selectedTab, setSelectedTab] = useState(TabNames.STUDENT_NUMBERS);
  return (
    <Page title={<h3>Enrolments</h3>} AdminPage={EnrolmentManagementAdminPage} moduleId={MGGS_MODULE_ID_ENROLLMENTS}>
      <Tabs
        activeKey={selectedTab}
        onSelect={(k) => setSelectedTab(k as TabNames)}
        unmountOnExit
      >
        <Tab title={`Enrolment Numbers`}  eventKey={TabNames.STUDENT_NUMBERS}>
          <SectionDiv>
            <EnrolmentDashboardPanel />
          </SectionDiv>
        </Tab>

        <Tab title={`Attendances`}  eventKey={TabNames.Attendances}>
          <SectionDiv>
            <AttendancesListWithSearchPanel />
          </SectionDiv>
        </Tab>

        <Tab title={'Expiring Passports/Visas'}  eventKey={TabNames.EXPIRING_PASSPORTS}>
          <SectionDiv>
            <ExpiringPassportsAndVisas />
          </SectionDiv>
        </Tab>

        <Tab title={`Forecast ${MathHelper.add(moment().year(), 1)}`}  eventKey={TabNames.FORECAST_NEXT_YEAR}>
          <SectionDiv>
            <StudentNumberForecastDashboard />
          </SectionDiv>
        </Tab>

        <Tab title={`VRQA`}  eventKey={TabNames.VRQA}>
          <SectionDiv>
            <VRQAPanel />
          </SectionDiv>
        </Tab>
      </Tabs>
    </Page>
  );
}

export default EnrolmentManagementPage;
