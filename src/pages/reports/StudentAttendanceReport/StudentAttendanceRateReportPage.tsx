import StudentAttendanceRateReport from "./components/StudentAttendanceRateReport";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import React, { useEffect, useState } from "react";
import StudentAttendanceRateReportAdminPage, {
  canAccessModuleSMTRoleCodes
} from "./StudentAttendanceRateReportAdminPage";
import { MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE } from "../../../types/modules/iModuleUser";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import AuthService from "../../../services/AuthService";
import SchoolManagementTeamService from "../../../services/Synergetic/SchoolManagementTeamService";
import Toaster from "../../../services/Toaster";
import Page401 from "../../../components/Page401";
import Page from "../../../layouts/Page";

const StudentAttendanceRateReportPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.SynCurrentFileSemester) {
      setCanAccess(false);
      return;
    }

    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      AuthService.canAccessModule(
        MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE
      ),
      SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          FileYear: user.SynCurrentFileSemester.FileYear,
          FileSemester: user.SynCurrentFileSemester.FileSemester,
          SSTStaffID: user.synergyId,
          SchoolRoleCode: canAccessModuleSMTRoleCodes
        })
      })
    ])
      .then(resp => {
        if (isCanceled) return;
        const moduleRoles = resp[0];
        const canAccessRoles = Object.keys(moduleRoles).filter(
          // @ts-ignore
          (roleId: number) => moduleRoles[roleId].canAccess === true
        );
        setCanAccess(canAccessRoles.length > 0 || resp[1].length > 0);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [user]);

  if (isLoading) {
    return <PageLoadingSpinner text={<h6>Checking access....</h6>} />;
  }

  if (canAccess !== true) {
    return (
      <Page401
        description={<h4>Please contact IT or Module Admins for assistant</h4>}
      />
    );
  }

  return (
    <Page
      title={<h3>Student Attendance Rate Report</h3>}
      moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
      AdminPage={StudentAttendanceRateReportAdminPage}
    >
      <StudentAttendanceRateReport />
    </Page>
  );
};

export default StudentAttendanceRateReportPage;
