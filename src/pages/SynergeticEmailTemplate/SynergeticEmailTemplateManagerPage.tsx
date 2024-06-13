import Page from "../../layouts/Page";
import SynergeticEmailTemplateList from "./components/SynergeticEmailTemplateList";
import SynergeticEmailTemplateManagerAdminPage from "./SynergeticEmailTemplateManagerAdminPage";
import { MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE } from "../../types/modules/iModuleUser";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import MessageListPanel from '../../components/common/Message/MessageListPanel';
import {
  MESSAGE_TYPE_MAIL_GUN_EMAIL, MESSAGE_TYPE_SMTP_EMAIL,
} from '../../types/Message/iMessage';

const TAB_TEMPLATES = "TAB_TEMPLATES";
const TAB_LOGS = "TAB_LOGS";
const SynergeticEmailTemplateManagerPage = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_TEMPLATES);

  return (
    <Page
      title={<h3>Synergetic Email Template Manager</h3>}
      AdminPage={SynergeticEmailTemplateManagerAdminPage}
      moduleId={MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE}
    >
      <Tabs
        activeKey={selectedTab}
        unmountOnExit
        defaultActiveKey={TAB_TEMPLATES}
        onSelect={key => setSelectedTab(key || TAB_TEMPLATES)}
      >
        <Tab eventKey={TAB_TEMPLATES} title={`Email Templates`}>
          <SynergeticEmailTemplateList />
        </Tab>

        <Tab eventKey={TAB_LOGS} title={`Logs`}>
          <MessageListPanel type={[MESSAGE_TYPE_MAIL_GUN_EMAIL, MESSAGE_TYPE_SMTP_EMAIL]} />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default SynergeticEmailTemplateManagerPage;
