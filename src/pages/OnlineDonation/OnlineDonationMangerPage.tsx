import React, {useState} from 'react';
import OnlineDonationListPanel from './components/OnlineDonationListPanel';
import {MGGS_MODULE_ID_ONLINE_DONATION} from '../../types/modules/iModuleUser';
import OnlineDonationAdminPage from './OnlineDonationAdminPage';
import Page from '../../layouts/Page';
import {Tab, Tabs} from 'react-bootstrap';
import DonorReceiptList from './components/DonorReceiptList';

const TAB_ONLINE_DONATIONS = "ONLINE_DONATIONS";
const TAB_DONATION_RECEIPTS = "DONATION_RECEIPTS";
const OnlineDonationMangerPage = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_ONLINE_DONATIONS);
  return (
    <Page moduleId={MGGS_MODULE_ID_ONLINE_DONATION} AdminPage={OnlineDonationAdminPage} title={<h3>Donation Manager</h3>}>
      <Tabs
        activeKey={selectedTab}
        className="mb-3"
        onSelect={k => setSelectedTab(k || TAB_ONLINE_DONATIONS)}
        unmountOnExit
      >
        <Tab eventKey={TAB_ONLINE_DONATIONS} title={"Online Donations"}>
          <OnlineDonationListPanel />
        </Tab>

        <Tab eventKey={TAB_DONATION_RECEIPTS} title={`Donation Receipts`}>
          <DonorReceiptList />
        </Tab>

      </Tabs>
    </Page>
  )
}

export default OnlineDonationMangerPage;
