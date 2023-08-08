import Page from '../../layouts/Page';
import {MGGS_MODULE_ID_ENROLMENTS} from '../../types/modules/iModuleUser';
import EnrolmentManagementAdminPage from './EnrolmentManagementAdminPage';
import {Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import SectionDiv from '../../components/common/SectionDiv';
import ExpiringPassportsAndVisas from '../../components/Enrolments/ExpiringPassportsAndVisas';

const TAB_EXPIRING_PASSPORTS = 'Expiring Passports/Visas'
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
      </Tabs>
    </Page>
  );
}

export default EnrolmentManagementPage;
