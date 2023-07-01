import StudentAttendanceRateReport from "./components/StudentAttendanceRateReport";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import React, {useEffect, useState} from "react";
import StudentAttendanceRateReportAdminPage, {
  canAccessModuleSMTRoleCodes
} from "./StudentAttendanceRateReportAdminPage";
import ModuleAdminBtn from "../../../components/module/ModuleAdminBtn";
import { MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE } from "../../../types/modules/iModuleUser";
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import AuthService from '../../../services/AuthService';
import SchoolManagementTeamService from '../../../services/Synergetic/SchoolManagementTeamService';
import Toaster from '../../../services/Toaster';
import Page401 from '../../../components/Page401';

const StudentAttendanceRateReportPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showingAdminPage, setShowingAdminPage] = useState(false);
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
      AuthService.canAccessModule(MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE),
      SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          FileYear: user.SynCurrentFileSemester.FileYear,
          FileSemester: user.SynCurrentFileSemester.FileSemester,
          SSTStaffID: user.synergyId,
          SchoolRoleCode: canAccessModuleSMTRoleCodes,
        })
      })
    ]).then(resp => {
      if (isCanceled) return;
      const moduleRoles = resp[0];
      // @ts-ignore
      const canAccessRoles = Object.keys(moduleRoles).filter((roleId: number) => moduleRoles[roleId].canAccess === true);
      setCanAccess(canAccessRoles.length > 0 || resp[1].length > 0 );
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }

  }, [user])


  if (isLoading) {
    return <PageLoadingSpinner text={<h6>Checking access....</h6>}/>
  }

  if (canAccess !== true) {
    return <Page401 description={<h4>Please contact IT or Module Admins for assistant</h4>} />
  }

  if (showingAdminPage) {
    return (
      <StudentAttendanceRateReportAdminPage
        onNavBack={() => setShowingAdminPage(false)}
      />
    );
  }

  return (
    <StudentAttendanceRateReport
      adminBtn={
        <div className={"pull-right"}>
          <ModuleAdminBtn
            onClick={() => setShowingAdminPage(true)}
            moduleId={MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE}
          />
        </div>
      }
    />
  );
};

export default StudentAttendanceRateReportPage;
