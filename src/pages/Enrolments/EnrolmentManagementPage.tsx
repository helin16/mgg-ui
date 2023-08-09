import Page from '../../layouts/Page';
import {MGGS_MODULE_ID_ENROLMENTS} from '../../types/modules/iModuleUser';
import EnrolmentManagementAdminPage from './EnrolmentManagementAdminPage';
import {Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import SectionDiv from '../../components/common/SectionDiv';
import ExpiringPassportsAndVisas from '../../components/Enrolments/ExpiringPassportsAndVisas';
import moment from 'moment-timezone';
import StudentNumberForecastDashboard
  from '../../components/reports/StudentNumberForecast/StudentNumberForecastDashboard';

const TAB_EXPIRING_PASSPORTS = 'EXPIRING_PASSPORTS';
const TAB_FORECAST_NEXT_YEAR = 'FORECAST_NEXT_YEAR';
const EnrolmentManagementPage = () => {
  const defaultSelectedTab = TAB_EXPIRING_PASSPORTS;
  const [selectedTab, setSelectedTab] = useState(TAB_EXPIRING_PASSPORTS)
  return (
    <Page title={<h3>Enrolments Manager</h3>} AdminPage={EnrolmentManagementAdminPage} moduleId={MGGS_MODULE_ID_ENROLMENTS}>
      <Tabs
        activeKey={selectedTab}
        onSelect={k => setSelectedTab(k || defaultSelectedTab)}
        unmountOnExit
      >
        <Tab title={'Expiring Passports/Visas'}  eventKey={TAB_EXPIRING_PASSPORTS}>
          <SectionDiv>
            <ExpiringPassportsAndVisas />
          </SectionDiv>
        </Tab>

        <Tab title={`Forecast ${moment().year()}`}  eventKey={TAB_FORECAST_NEXT_YEAR}>
          <SectionDiv>
            <StudentNumberForecastDashboard />
          </SectionDiv>
        </Tab>
      </Tabs>
    </Page>
  );
}

export default EnrolmentManagementPage;
