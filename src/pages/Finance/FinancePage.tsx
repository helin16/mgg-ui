import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ExpiringCreditCardsPanel from "./components/SynDebtorPaymentMethod/ExpiringCreditCardsPanel";
import { MGGS_MODULE_ID_FINANCE } from "../../types/modules/iModuleUser";
import FinanceAdminPage from "./FinanceAdminPage";
import Page from '../../layouts/Page';
import moment from 'moment-timezone';
import MathHelper from '../../helper/MathHelper';
import BudgetForecastPanel from '../../components/reports/BudgetForecast/BudgetForecastPanel';
import MonthlyBillingReportPanel from './components/MonthlyBilling/MonthlyBillingReportPanel';

const TAB_EXPIRING_CREDIT_CARDS = "EXPIRING_CREDIT_CARDS";
const TAB_MONTHLY_BILLING_REPORT = "MONTHLY_BILLING_REPORT";
const TAB_EXPIRING_FORECAST = "FORECAST_NEXT_YEAR";
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

        <Tab eventKey={TAB_MONTHLY_BILLING_REPORT} title={"Monthly Billing"}>
          <MonthlyBillingReportPanel />
        </Tab>

        <Tab eventKey={TAB_EXPIRING_FORECAST} title={`Forecast ${MathHelper.add(moment().year(), 1)}`}>
          <BudgetForecastPanel />
        </Tab>

      </Tabs>
    </Page>
  );
};

export default FinancePage;
