import React, {useState} from 'react';
import OnlineDonationListPanel from './components/OnlineDonationListPanel';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_ONLINE_DONATION} from '../../types/modules/iModuleUser';
import OnlineDonationAdminPage from './OnlineDonationAdminPage';

const OnlineDonationMangerPage = () => {
  const [showingAdminPage, setShowingAdminPage] = useState(false);


  if (showingAdminPage) {
    return <OnlineDonationAdminPage onNavBack={() => setShowingAdminPage(false)} />
  }

  return (
    <>
      <h3>
        Online Donation Manager
        <ModuleAdminBtn moduleId={MGGS_MODULE_ID_ONLINE_DONATION} className={'pull-right'} onClick={() => {
          setShowingAdminPage(true);
        }}/>
      </h3>
      <OnlineDonationListPanel />
    </>
  )
}

export default OnlineDonationMangerPage;
