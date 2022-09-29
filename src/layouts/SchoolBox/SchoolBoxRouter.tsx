import React from 'react';
import StudentReport from '../../pages/studentReport/StudentReport';
import OperooSafetyAlertsPage from '../../pages/operoo/OperooSafetyAlertsPage';
import ModuleAccessWrapper from '../../components/module/ModuleAccessWrapper';
import {MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';
// import PageNotFound from '../../components/PageNotFound';

const schoolBoxIframeElementId = 'remote';
const SchoolBoxRouter = ({path}: {path: string}) => {

  const removeSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.getElementById(schoolBoxIframeElementId);
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.remove();
    }
  }

  const showSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.getElementById(schoolBoxIframeElementId);
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.style.display = 'block';
    }
  }

  switch (path) {
    case '/reports/student': {
      removeSchoolBoxIframe();
      return <StudentReport />;
    }
    case '/operoo/safetyAlerts': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS}><OperooSafetyAlertsPage /></ModuleAccessWrapper>;
    }
    default: {
      showSchoolBoxIframe();
      return null; //<PageNotFound />
    }
  }
}

export default SchoolBoxRouter;
