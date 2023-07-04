import React, {useState} from 'react';
import {FlexContainer} from '../../styles';
import {Button, Tab, Tabs} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import ModuleUserList from '../../components/module/ModuleUserList';
import {MGGS_MODULE_ID_ONLINE_DONATION} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';
import ExplanationPanel from '../../components/ExplanationPanel';
import OnlineDonationModuleSettingsPanel from './components/OnlineDonationModuleSettingsPanel';

type iOnlineDonationAdminPage = {
  onNavBack: () => void;
}

const TAB_USERS = 'users';
const TAB_ADMIN_USERS = 'admin_users';
const TAB_SETTINGS = 'notifications';

const OnlineDonationAdminPage = ({onNavBack}: iOnlineDonationAdminPage) => {
  const [selectedTab, setSelectedTab] = useState(TAB_USERS)
  return (
    <>
      <FlexContainer className={'with-gap'}>
        <Button size={'sm'} variant={'link'} onClick={() => onNavBack()}>
          <Icons.ArrowLeft />
        </Button>
        <h3>
          Online Donation Manager - Admin
        </h3>
      </FlexContainer>

      <Tabs
        activeKey={selectedTab}
        onSelect={(tabKey) => setSelectedTab(`${tabKey}`)}
        // unmountOnExit
      >
        <Tab title={'Users'} eventKey={TAB_USERS}>
          <h6>Users</h6>
          <ExplanationPanel text={'User who can access this module'} />
          <ModuleUserList moduleId={MGGS_MODULE_ID_ONLINE_DONATION} roleId={ROLE_ID_NORMAL} showDeletingBtn showCreatingPanel />
        </Tab>

        <Tab title={'Admin Users'} eventKey={TAB_ADMIN_USERS}>
          <h6>Admin Users</h6>
          <ExplanationPanel text={'User who can manage this module'} />
          <ModuleUserList moduleId={MGGS_MODULE_ID_ONLINE_DONATION} roleId={ROLE_ID_ADMIN} showDeletingBtn showCreatingPanel />
        </Tab>

        <Tab title={'Settings'} eventKey={TAB_SETTINGS}>
          <OnlineDonationModuleSettingsPanel />
        </Tab>
      </Tabs>
    </>
  )
}

export default OnlineDonationAdminPage;
