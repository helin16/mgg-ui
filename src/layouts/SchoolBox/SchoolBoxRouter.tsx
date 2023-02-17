import React from 'react';
import StudentReport from '../../pages/studentReport/StudentReport';
import OperooSafetyAlertsPage from '../../pages/operoo/OperooSafetyAlertsPage';
import ModuleAccessWrapper from '../../components/module/ModuleAccessWrapper';
import {MODULE_ID_HOUSE_AWARDS, MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../types/modules/iModuleUser';
import HouseAwardsPage from '../../pages/houseAwards/HouseAwardsPage';
import MedicalReportPage from '../../pages/medicalReports/MedicalReportPage';
import CustomScriptUrlGenPage from '../../pages/tools/CustomScriptUrlGenPage';
import MyClassListPage from '../../pages/students/MyClassListPage';
import BudgetTrackerPage from '../../pages/BudgetTracker/BudgetTrackerPage';
// import PageNotFound from '../../components/PageNotFound';

const schoolBoxIframeElementId = 'remote';
const SchoolBoxRouter = ({path, remoteUrl}: {path: string, remoteUrl: string}) => {

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
    case '/bt': {
      removeSchoolBoxIframe();
      return <BudgetTrackerPage />
    }
    case '/reports/student': {
      removeSchoolBoxIframe();
      return <StudentReport />;
    }
    case '/operoo/safetyAlerts': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS}><OperooSafetyAlertsPage /></ModuleAccessWrapper>;
    }
    case '/houseAwards': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MODULE_ID_HOUSE_AWARDS}><HouseAwardsPage /></ModuleAccessWrapper>;
    }
    case '/medial/action_plan': {
      removeSchoolBoxIframe();
      return <MedicalReportPage />
    }
    case '/helper/url/mconnect': {
      removeSchoolBoxIframe();
      return <CustomScriptUrlGenPage customUrl={remoteUrl} customUrlPath={path}/>
    }
    case '/my_student': {
      removeSchoolBoxIframe();
      return <MyClassListPage />
    }
    default: {
      showSchoolBoxIframe();
      return null; //<PageNotFound />
    }
  }
}

export default SchoolBoxRouter;
