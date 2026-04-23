import React from "react";
import StudentReport from "../../pages/studentReport/StudentReport";
import ModuleAccessWrapper from "../../components/module/ModuleAccessWrapper";
import {
  MGGS_MODULE_ID_ADMISSIONS,
  MGGS_MODULE_ID_CAMPUS_DISPLAY,
  MGGS_MODULE_ID_ENROLLMENTS,
  MGGS_MODULE_ID_FINANCE,
  MGGS_MODULE_ID_HOUSE_AWARDS, MGGS_MODULE_ID_HOY_CHAT_EMAIL,
  MGGS_MODULE_ID_MGG_APP_DEVICES,
  MGGS_MODULE_ID_ONLINE_DONATION,
  MGGS_MODULE_ID_POWER_BI_REPORT,
  MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION,
  MGGS_MODULE_ID_STAFF_LIST,
  MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE
} from "../../types/modules/iModuleUser";
import HouseAwardsPage from "../../pages/houseAwards/HouseAwardsPage";
import MedicalReportPage from "../../pages/medicalReports/MedicalReportPage";
import CustomScriptUrlGenPage from "../../pages/tools/CustomScriptUrlGenPage";
import MyClassListPage from "../../pages/students/MyClassList/MyClassListPage";
import BudgetTrackerPage from "../../pages/BudgetTracker/BudgetTrackerPage";
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
import {URL_POWER_BI_DISPLAY} from '../../Url';
import PageNotFound from '../../components/PageNotFound';
import AdmissionsPage from '../../pages/AttendanceBulk/AdmissionsPage';
import HOYChatManagePage from '../../pages/HOYChat/HOYChatManagePage';
import HOYChatForm from '../../pages/HOYChat/components/HOYChatForm';
import StudentSubjectList from '../../components/timeTable/StudentSubjectList';
import {useSearchParams} from 'react-router-dom';
import SchoolBoxUrls from './SchoolBoxUrls';

const schoolBoxIframeElementId = "remote";
const SchoolBoxRouter = ({
  path,
  remoteUrl
}: {
  path: string;
  remoteUrl: string;
}) => {
  const [searchParams] = useSearchParams();
  const removeSchoolBoxIframe = () => {
    const schoolBoxIframeElement = document.querySelector(
      `iframe#${schoolBoxIframeElementId}`
    );
    if (schoolBoxIframeElement) {
      schoolBoxIframeElement.remove();
    }
  };

  // /powerbi/report/:reportId
  if (path.startsWith(URL_POWER_BI_DISPLAY.replace(':reportId', ''))) {
    removeSchoolBoxIframe();
    const paths = path.split('/');
    return <PowerBIReportViewingPage reportId={paths[paths.length - 1]} />;
  }

  switch (path) {
    case SchoolBoxUrls.BudgetTracker: {
      removeSchoolBoxIframe();
      return <BudgetTrackerPage />;
    }
    case SchoolBoxUrls.ParentDirectory: {
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
    case SchoolBoxUrls.HouseAwards: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_HOUSE_AWARDS}>
          <HouseAwardsPage />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.MedicalActionPlans: {
      removeSchoolBoxIframe();
      return <MedicalReportPage />;
    }
    case SchoolBoxUrls.ModuleUrlHelper: {
      removeSchoolBoxIframe();
      return (
        <CustomScriptUrlGenPage customUrl={remoteUrl} customUrlPath={path} />
      );
    }
    case SchoolBoxUrls.MyClassList: {
      removeSchoolBoxIframe();
      return <MyClassListPage />;
    }
    case SchoolBoxUrls.DataSubmission: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION}>
          <SchoolDataSubmissionsPage />
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
    case SchoolBoxUrls.MobileAppDevices: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}>
          <MggDevicesPage />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.Finance: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_FINANCE}>
          <FinancePage />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.OnlineDonationAdmin: {
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
    case SchoolBoxUrls.Enrolments: {
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
    case SchoolBoxUrls.CampusDisplayAdmin: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_CAMPUS_DISPLAY}>
          <CampusDisplayManagementPage />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.PowerBI: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_POWER_BI_REPORT}>
          <PowerBIReportManagerPage />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.Admissions: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_ADMISSIONS}>
          <AdmissionsPage />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.HOYChatAdmin: {
      removeSchoolBoxIframe();
      return (
        <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_HOY_CHAT_EMAIL}>
          <HOYChatManagePage customFormPath={'/hoyChatForm'} customUrl={remoteUrl} />
        </ModuleAccessWrapper>
      );
    }
    case SchoolBoxUrls.HOYChatForm: {
      removeSchoolBoxIframe();
      return (
        <HOYChatForm />
      );
    }
    case SchoolBoxUrls.StudentBookList: {
      removeSchoolBoxIframe();
      return (
        //@ts-ignore
        <StudentSubjectList studentSynId={`${searchParams.get('synId') || ''}`.trim()} />
      );
    }
    default: {
      removeSchoolBoxIframe();
      return <PageNotFound />;
    }
  }
};

export default SchoolBoxRouter;
