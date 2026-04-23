import React, {useState} from 'react';
import OnlineDonationListPanel from './components/OnlineDonationListPanel';
import {MGGS_MODULE_ID_ONLINE_DONATION} from '../../types/modules/iModuleUser';
import OnlineDonationAdminPage from './OnlineDonationAdminPage';
import Page from '../../layouts/Page';
import {Tab, Tabs} from 'react-bootstrap';
import DonorReceiptList from './components/DonorReceiptList';
import MessageListPanel from '../../components/common/Message/MessageListPanel';
import {MESSAGE_TYPE_DONATION_RECEIPT_EMAIL} from '../../types/Message/iMessage';

const TAB_ONLINE_DONATIONS = "ONLINE_DONATIONS";
const TAB_DONATION_RECEIPTS = "DONATION_RECEIPTS";
const TAB_DONATION_RECEIPTS_EMAIL_LOGS = "DONATION_RECEIPTS_EMAIL_LOGS";
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

        <Tab eventKey={TAB_DONATION_RECEIPTS_EMAIL_LOGS} title={`Donation Receipts Email Logs`}>
          <MessageListPanel type={MESSAGE_TYPE_DONATION_RECEIPT_EMAIL} />
        </Tab>

      </Tabs>
    </Page>
  )
}

export default OnlineDonationMangerPage;
