import React from "react";
import StudentReport from "../../pages/studentReport/StudentReport";
import OperooSafetyAlertsPage from "../../pages/operoo/OperooSafetyAlertsPage";
import ModuleAccessWrapper from "../../components/module/ModuleAccessWrapper";
import {
  MGGS_MODULE_ID_ALUMNI_REQUEST, MGGS_MODULE_ID_CAMPUS_DISPLAY, MGGS_MODULE_ID_COD,
  MGGS_MODULE_ID_ENROLLMENTS,
  MGGS_MODULE_ID_FINANCE,
  MGGS_MODULE_ID_FUNNEL,
  MGGS_MODULE_ID_HOUSE_AWARDS,
  MGGS_MODULE_ID_MGG_APP_DEVICES,
  MGGS_MODULE_ID_ONLINE_DONATION,
  MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS, MGGS_MODULE_ID_POWER_BI_REPORT,
  MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION,
  MGGS_MODULE_ID_STAFF_LIST,
  MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE
} from "../../types/modules/iModuleUser";
import HouseAwardsPage from "../../pages/houseAwards/HouseAwardsPage";
import MedicalReportPage from "../../pages/medicalReports/MedicalReportPage";
import CustomScriptUrlGenPage from "../../pages/tools/CustomScriptUrlGenPage";
import MyClassListPage from "../../pages/students/MyClassList/MyClassListPage";
import BudgetTrackerPage from "../../pages/BudgetTracker/BudgetTrackerPage";
import FunnelPage from "../../pages/funnel/FunnelPage";
import AlumniRequestPage from "../../pages/alumni/AlumniRequestPage";
import ParentDirectoryPage from "../../pages/parent/ParentDirectoryPage";
import SchoolDataSubmissionsPage from "../../pages/dataSubmissions/SchoolDataSubmissionsPage";
import StudentAbsenceParentSubmissionForm from "../../components/StudentAbsence/StudentAbsenceParentSubmissionForm";
import StudentAbsencePage from "../../pages/studentAbsences/StudentAbsencePage";
import MggDevicesPage from "../../pages/devices/MggDevicesPage";
import FinancePage from "../../pages/Finance/FinancePage";
import StudentAttendanceRateReportPage from "../../pages/reports/StudentAttendanceReport/StudentAttendanceRateReportPage";
import OnlineDonationMangerPage from "../../pages/OnlineDonation/OnlineDonationMangerPage";
import StaffListPage from "../../pages/Staff/StaffListPage";
import EnrolmentManagementPage from "../../pages/Enrollments/EnrolmentManagementPage";
import StudentListPage from "../../pages/students/StudentList/StudentListPage";
import SynergeticEmailTemplateManagerPage from "../../pages/SynergeticEmailTemplate/SynergeticEmailTemplateManagerPage";
import CampusDisplayManagementPage from '../../pages/CampusDisplay/CampusDisplayManagementPage';
import PowerBIReportViewingPage from '../../pages/PowerBI/PowerBIReportViewingPage';
import PowerBIReportManagerPage from '../../pages/PowerBI/Manager/PowerBIReportManagerPage';
import {URL_POWER_BI_DISPLAY, URL_STUDENT_REPORT_SCHOOL_BOX_ID} from '../../Url';
import CODManagerPage from '../../pages/ConfirmationOfDetails/CODManagerPage';
import CODParentPage from '../../pages/ConfirmationOfDetails/CODParentPage';
import AcademicReportsForSchoolBoxId from '../../pages/studentReport/components/AcademicReportsForSchoolBoxId';
// import PageNotFound from '../../components/PageNotFound';

const schoolBoxIframeElementId = "remote";
const SchoolBoxRouter = ({
  path,
  remoteUrl
}: {
  path: string;
  remoteUrl: string;
}) => {
  const removeSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.querySelector(
      `iframe#${schoolBoxIframeElementId}`
    );
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.remove();
    }
  };

  const showSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.querySelector(
      `iframe#${schoolBoxIframeElementId}`
    );
    if (schoolBoxIframeElement) {
      // @ts-ignore
      schoolBoxIframeElement.style.display = "block";
    }
  };
  // /powerbi/report/:reportId
  if (path.startsWith(URL_POWER_BI_DISPLAY.replace(':reportId', ''))) {
    removeSchoolBoxIframe();
    const paths = path.split('/');
    return <PowerBIReportViewingPage reportId={paths[paths.length - 1]} />;
  }

  // /reports/student/:schoolBoxId
  if (path.startsWith(URL_STUDENT_REPORT_SCHOOL_BOX_ID.replace(':schoolBoxId', ''))) {
    removeSchoolBoxIframe();
    const paths = path.split('/');
    return <AcademicReportsForSchoolBoxId  schoolBoxId={paths[paths.length - 1]} />;
  }

  switch (path) {
    case "/bt": {
      removeSchoolBoxIframe();
      return <BudgetTrackerPage />;
    }
    case "/parent/directory": {
      removeSchoolBoxIframe();
      return <ParentDirectoryPage />;
    }
    case "/reports/student": {
      removeSchoolBoxIframe();
      return <StudentReport />;
    }
    case "/reports/student_attendance": {
      removeSchoolBoxIframe();
      return <StudentAttendanceRateReportPage />;
    }
    case "/operoo/safetyAlerts": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS}>
          <OperooSafetyAlertsPage />
        </ModuleAccessWrapper>
      );
    }
    case "/houseAwards": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_HOUSE_AWARDS}>
          <HouseAwardsPage />
        </ModuleAccessWrapper>
      );
    }
    case "/medial/action_plan": {
      removeSchoolBoxIframe();
      return <MedicalReportPage />;
    }
    case "/helper/url/mconnect": {
      removeSchoolBoxIframe();
      return (
        <CustomScriptUrlGenPage customUrl={remoteUrl} customUrlPath={path} />
      );
    }
    case "/my_student": {
      removeSchoolBoxIframe();
      return <MyClassListPage />;
    }
    case "/funnel": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_FUNNEL}>
          <FunnelPage />
        </ModuleAccessWrapper>
      );
    }
    case "/school_data_submission": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION}>
          <SchoolDataSubmissionsPage />
        </ModuleAccessWrapper>
      );
    }
    case "/alumni/admin": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}>
          <AlumniRequestPage />
        </ModuleAccessWrapper>
      );
    }
    case "student_absence_parent_form": {
      removeSchoolBoxIframe();
      return <StudentAbsenceParentSubmissionForm />;
    }

    case "/student_inout/home": {
      removeSchoolBoxIframe();
      return <StudentAbsencePage />;
    }
    case "/mobile_devices": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}>
          <MggDevicesPage />
        </ModuleAccessWrapper>
      );
    }
    case "/finance": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_FINANCE}>
          <FinancePage />
        </ModuleAccessWrapper>
      );
    }
    case "/online_donation/admin": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_ONLINE_DONATION}>
          <OnlineDonationMangerPage />
        </ModuleAccessWrapper>
      );
    }
    case "/staff/list": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_STAFF_LIST}>
          <StaffListPage />
        </ModuleAccessWrapper>
      );
    }
    case "/ENROLLMENTS_admin": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_ENROLLMENTS}>
          <EnrolmentManagementPage />
        </ModuleAccessWrapper>
      );
    }
    case "/student/list": {
      removeSchoolBoxIframe();
      return <StudentListPage />;
    }
    case "/synergetic/emailTemplateManager": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE}>
          <SynergeticEmailTemplateManagerPage />
        </ModuleAccessWrapper>
      );
    }
    case "/campusDisplay/manage": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}>
          <CampusDisplayManagementPage />
        </ModuleAccessWrapper>
      );
    }
    case "/powerbi/manager": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_POWER_BI_REPORT}>
          <PowerBIReportManagerPage />
        </ModuleAccessWrapper>
      );
    }
    case "/confirmation_of_details/admin_new": {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_COD}>
          <CODManagerPage />
        </ModuleAccessWrapper>
      );
    }
    case "/confirmation_of_details/register": {
      removeSchoolBoxIframe();
      return (
        <CODParentPage />
      );
    }
    default: {
      showSchoolBoxIframe();
      return null; //<PageNotFound />
    }
  }
};

export default SchoolBoxRouter;
