import React from 'react';
import StudentReport from '../../pages/studentReport/StudentReport';
import OperooSafetyAlertsPage from '../../pages/operoo/OperooSafetyAlertsPage';
import ModuleAccessWrapper from '../../components/module/ModuleAccessWrapper';
import {
  MGGS_MODULE_ID_ALUMNI_REQUEST, MGGS_MODULE_ID_FINANCE,
  MGGS_MODULE_ID_FUNNEL,
  MGGS_MODULE_ID_HOUSE_AWARDS, MGGS_MODULE_ID_MGG_APP_DEVICES,
  MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS, MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION,
} from '../../types/modules/iModuleUser';
import HouseAwardsPage from '../../pages/houseAwards/HouseAwardsPage';
import MedicalReportPage from '../../pages/medicalReports/MedicalReportPage';
import CustomScriptUrlGenPage from '../../pages/tools/CustomScriptUrlGenPage';
import MyClassListPage from '../../pages/students/MyClassListPage';
import BudgetTrackerPage from '../../pages/BudgetTracker/BudgetTrackerPage';
import FunnelPage from '../../pages/funnel/FunnelPage';
import AlumniRequestPage from '../../pages/alumni/AlumniRequestPage';
import ParentDirectoryPage from '../../pages/parent/ParentDirectoryPage';
import SchoolDataSubmissionsPage from '../../pages/dataSubmissions/SchoolDataSubmissionsPage';
import StudentAbsenceParentSubmissionForm from '../../components/StudentAbsence/StudentAbsenceParentSubmissionForm';
import StudentAbsencePage from '../../pages/studentAbsences/StudentAbsencePage';
import MggDevicesPage from '../../pages/devices/MggDevicesPage';
import FinancePage from '../../pages/Finance/FinancePage';
// import PageNotFound from '../../components/PageNotFound';

const schoolBoxIframeElementId = 'remote';
const SchoolBoxRouter = ({path, remoteUrl}: {path: string, remoteUrl: string}) => {

  const removeSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.querySelector(`iframe#${schoolBoxIframeElementId}`);
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.remove();
    }
  }

  const showSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.querySelector(`iframe#${schoolBoxIframeElementId}`);
    if (schoolBoxIframeElement) {
      // @ts-ignore
      schoolBoxIframeElement.style.display = 'block';
    }
  }

  switch (path) {
    case '/bt': {
      removeSchoolBoxIframe();
      return <BudgetTrackerPage />
    }
    case '/parent/directory': {
      removeSchoolBoxIframe();
      return <ParentDirectoryPage />
    }
    case '/reports/student': {
      removeSchoolBoxIframe();
      return <StudentReport />;
    }
    case '/operoo/safetyAlerts': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS}><OperooSafetyAlertsPage /></ModuleAccessWrapper>;
    }
    case '/houseAwards': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_HOUSE_AWARDS}><HouseAwardsPage /></ModuleAccessWrapper>;
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
    case '/funnel': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_FUNNEL}><FunnelPage /></ModuleAccessWrapper>
    }
    case '/school_data_submission': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION}><SchoolDataSubmissionsPage /></ModuleAccessWrapper>
    }
    case '/alumni/admin': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}><AlumniRequestPage /></ModuleAccessWrapper>
    }
    case 'student_absence_parent_form': {
      removeSchoolBoxIframe();
      return <StudentAbsenceParentSubmissionForm />
    }
    // case '/student_inout/home': {
    case '/student_absence/home': {
      removeSchoolBoxIframe();
      return <StudentAbsencePage />
    }
    case '/mobile_devices': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}><MggDevicesPage /></ModuleAccessWrapper>
    }
    case '/finance': {
      removeSchoolBoxIframe();
      return <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_FINANCE}><FinancePage /></ModuleAccessWrapper>
    }
    default: {
      showSchoolBoxIframe();
      return null; //<PageNotFound />
    }
  }
}

export default SchoolBoxRouter;
