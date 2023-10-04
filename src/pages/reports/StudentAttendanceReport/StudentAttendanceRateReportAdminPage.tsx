import SectionDiv from "../../../components/common/SectionDiv";
import ExplanationPanel from "../../../components/ExplanationPanel";
import ModuleUserList from "../../../components/module/ModuleUserList";
import { MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE } from "../../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN, ROLE_ID_NORMAL } from "../../../types/modules/iRole";
import SchoolManagementTable from "../../../components/SchoolManagement/SchoolManagementTable";
import React from "react";
import {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
} from "../../../types/Synergetic/iSchoolManagementTeam";
import AdminPage from "../../../layouts/AdminPage";
import AdminPageTabs from "../../../layouts/AdminPageTabs";
import StudentAttendanceRateReportModuleSettings from './components/StudentAttendanceRateReportModuleSettings';

type iStudentAttendanceRateReportAdminPage = {
  onNavBack: () => void;
};

export const canAccessModuleSMTRoleCodes = [
  SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL
];
const StudentAttendanceRateReportAdminPage = ({
  onNavBack
}: iStudentAttendanceRateReportAdminPage) => {
  return (
    <AdminPage
      title={<h3>Student Attendance Rate Report - Admin </h3>}
      moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
      onNavBack={onNavBack}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
        usersTab={
          <SectionDiv>
            <h5>Users</h5>
            <ExplanationPanel
              text={
                "all users below, head of years and head of schools can access this module"
              }
            />
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
              roleId={ROLE_ID_NORMAL}
              showCreatingPanel
              showDeletingBtn
            />
            <SectionDiv>
              <h6>Head Of Years / Head of Schools</h6>
              <SchoolManagementTable
                viewOnly={true}
                showExplanation={false}
                showSearchPanel={false}
                roleCodes={canAccessModuleSMTRoleCodes}
              />
            </SectionDiv>
          </SectionDiv>
        }
        adminsTab={
          <SectionDiv>
            <h5>Admin Users</h5>
            <ExplanationPanel text={"Managing this module"} />
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
              roleId={ROLE_ID_ADMIN}
              showCreatingPanel
            />
          </SectionDiv>
        }
        extraTabs={[{
          title: 'Settings',
          key: 'settings',
          component: <StudentAttendanceRateReportModuleSettings />
        }]}
      />
    </AdminPage>
  );
};

export default StudentAttendanceRateReportAdminPage;
