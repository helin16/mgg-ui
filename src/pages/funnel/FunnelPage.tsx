import React from "react";
import StudentNumberForecastDashboard from "../../components/reports/StudentNumberForecast/StudentNumberForecastDashboard";
import Page from "../../layouts/Page";
import {MGGS_MODULE_ID_FUNNEL} from '../../types/modules/iModuleUser';
import FunnelAdminPage from './FunnelAdminPage';

const FunnelPage = () => {
  return (
    <Page title={<h3>Funnel</h3>} moduleId={MGGS_MODULE_ID_FUNNEL} AdminPage={FunnelAdminPage}>
      <StudentNumberForecastDashboard />
    </Page>
  );
};

export default FunnelPage;
