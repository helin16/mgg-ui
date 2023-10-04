import React from 'react';
import OnlineDonationListPanel from './components/OnlineDonationListPanel';
import {MGGS_MODULE_ID_ONLINE_DONATION} from '../../types/modules/iModuleUser';
import OnlineDonationAdminPage from './OnlineDonationAdminPage';
import Page from '../../layouts/Page';

const OnlineDonationMangerPage = () => {
  return (
    <Page moduleId={MGGS_MODULE_ID_ONLINE_DONATION} AdminPage={OnlineDonationAdminPage} title={<h3>Online Donation Manager</h3>}>
      <OnlineDonationListPanel />
    </Page>
  )
}

export default OnlineDonationMangerPage;
