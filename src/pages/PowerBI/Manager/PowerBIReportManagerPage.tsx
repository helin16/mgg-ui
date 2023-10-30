import Page from '../../../layouts/Page';
import {
  MGGS_MODULE_ID_POWER_BI_REPORT,
} from '../../../types/modules/iModuleUser';
import React from 'react';
import ExplanationPanel from '../../../components/ExplanationPanel';
import PowerBIReportManagerAdminPage from './PowerBIReportManagerAdminPage';
import PowerBIListPanel from '../../../components/powerBI/PowerBIListPanel';

const PowerBIReportManagerPage = () => {
  return (
    <Page
      title={<h3>Power BI Manager</h3>}
      moduleId={MGGS_MODULE_ID_POWER_BI_REPORT}
      AdminPage={PowerBIReportManagerAdminPage}
    >
      <ExplanationPanel text={'This is the management page for managing all integrating Power BI report into mConnect.'} />
      <PowerBIListPanel />
    </Page>
  )
}

export default PowerBIReportManagerPage
