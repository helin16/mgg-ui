import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ExpiringCreditCardsPanel from "./components/SynDebtorPaymentMethod/ExpiringCreditCardsPanel";
import { MGGS_MODULE_ID_FINANCE } from "../../types/modules/iModuleUser";
import FinanceAdminPage from "./FinanceAdminPage";
import Page from '../../layouts/Page';

const TAB_EXPIRING_CREDIT_CARDS = "EXPIRING_CREDIT_CARDS";
const FinancePage = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_EXPIRING_CREDIT_CARDS);

  return (
    <Page title={<h3>
      Finance</h3>} moduleId={MGGS_MODULE_ID_FINANCE} AdminPage={FinanceAdminPage}>
      <Tabs
        activeKey={selectedTab}
        className="mb-3"
        onSelect={k => setSelectedTab(k || TAB_EXPIRING_CREDIT_CARDS)}
        unmountOnExit
      >
        <Tab eventKey={TAB_EXPIRING_CREDIT_CARDS} title={"Expiring Credit Cards"}>
          <ExpiringCreditCardsPanel />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default FinancePage;
