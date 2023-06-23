import styled from "styled-components";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ExpiringCreditCardsPanel from "./components/SynDebtorPaymentMethod/ExpiringCreditCardsPanel";
import ModuleAdminBtn from "../../components/module/ModuleAdminBtn";
import { MGGS_MODULE_ID_FINANCE } from "../../types/modules/iModuleUser";
import FinanceAdminPage from "./FinanceAdminPage";

const Wrapper = styled.div``;
const TAB_EXPIRING_CREDIT_CARDS = "EXPIRING_CREDIT_CARDS";
const FinancePage = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_EXPIRING_CREDIT_CARDS);
  const [showingAdminPage, setShowingAdminPage] = useState(false);

  if (showingAdminPage === true) {
    return <FinanceAdminPage onNavBack={() => setShowingAdminPage(false)} />;
  }

  return (
    <Wrapper>
      <h3>
        Finance
        <ModuleAdminBtn
          moduleId={MGGS_MODULE_ID_FINANCE}
          className={"pull-right"}
          onClick={() => setShowingAdminPage(true)}
        />
      </h3>
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
    </Wrapper>
  );
};

export default FinancePage;
