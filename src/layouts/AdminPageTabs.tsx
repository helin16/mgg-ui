import {useState} from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import ModuleUserList from '../components/module/ModuleUserList';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../types/modules/iRole';

type iAdminPageTab = {
  title: string;
  key: string;
  component: any;
}
type iAdminPageTabs = {
  moduleId: number;
  defaultTabKey?: string;
  extraTabs?: iAdminPageTab[];
  usersTab?: any;
  adminsTab?: any;
}

const TAB_USERS = 'Users';
const TAB_ADMINS = 'Admins';
const AdminPageTabs = ({moduleId, defaultTabKey, usersTab, adminsTab, extraTabs = []}: iAdminPageTabs) => {
  const defaultSelectedTab = defaultTabKey || TAB_USERS;
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);

  return (
    <Tabs
      activeKey={selectedTab}
      onSelect={k => setSelectedTab(k || defaultSelectedTab)}
      unmountOnExit
    >
      <Tab title={TAB_USERS} eventKey={TAB_USERS}>
        {usersTab || <ModuleUserList moduleId={moduleId} roleId={ROLE_ID_NORMAL} showDeletingBtn showCreatingPanel />}
      </Tab>
      <Tab title={TAB_ADMINS} eventKey={TAB_ADMINS}>
        {adminsTab || <ModuleUserList moduleId={moduleId} roleId={ROLE_ID_ADMIN} showDeletingBtn showCreatingPanel />}
      </Tab>
      {extraTabs.map(extraTab => {
        return <Tab key={extraTab.key} title={extraTab.title} eventKey={extraTab.key}>{extraTab.component}</Tab>
      })}
    </Tabs>
  )
}

export default AdminPageTabs;
