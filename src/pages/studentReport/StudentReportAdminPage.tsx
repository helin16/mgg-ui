import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import AdminReportList from "./components/Admin/AdminReportList";
import iStudentReportYear from "../../types/Synergetic/Student/iStudentReportYear";
import AdminEditReportYear from "./components/Admin/AdminEditReportYear";
import AdminEditingLockList from "./components/Admin/AdminEditingLockList";
import { MGGS_MODULE_ID_STUDENT_REPORT } from "../../types/modules/iModuleUser";
import SchoolManagementPanel from "../../components/SchoolManagement/SchoolManagementPanel";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import GenComparativePopupBtn from "./components/Admin/GenComparativePopupBtn";
import ExplanationPanel from "../../components/ExplanationPanel";
import { FlexContainer } from "../../styles";
import ReportsUploader from './components/Admin/ReportsUploader';

const StudentReportAdminPage = ({
  backToReportFn
}: {
  backToReportFn?: () => void;
}) => {
  const [editingReportYear, setEditingReportYear] = useState<
    iStudentReportYear | null | undefined
  >(undefined);

  const getReportingYears = () => {
    if (editingReportYear !== undefined) {
      return (
        <AdminEditReportYear
          reportYear={editingReportYear}
          onCancel={() => setEditingReportYear(undefined)}
        />
      );
    }

    return (
      <AdminReportList onSelected={report => setEditingReportYear(report)} />
    );
  };

  return (
    <AdminPage
      title={<h3>Student Wellbeing Module Admin</h3>}
      moduleId={MGGS_MODULE_ID_STUDENT_REPORT}
      onNavBack={() => backToReportFn && backToReportFn()}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_STUDENT_REPORT}
        defaultTabKey={"ReportYears"}
        className={"top-gap"}
        extraTabs={[
          {
            key: "ReportYears",
            title: "Report Years",
            component: getReportingYears()
          },
          {
            key: "genComp",
            title: "Gen Comparative",
            component: (
              <FlexContainer className={"justify-content-center"}>
                <div className={"text-center"}>
                  <ExplanationPanel
                    text={
                      "You are about to generate comparative result for all students"
                    }
                  />
                  <GenComparativePopupBtn />
                </div>
              </FlexContainer>
            )
          },
          {
            key: "SMT",
            title: "SMT",
            component: <SchoolManagementPanel />
          },
          {
            key: "synEditingLocks",
            title: "Synergetic Report Editing Locks",
            component: (
              <div>
                <div>
                  <small>
                    Below is a list of editing locks done by the teacher during
                    reports time, please click{" "}
                    <b className={"text-danger"}>Unlock</b> to release
                    Synergetic lock
                  </small>
                  <Alert variant={"warning"}>
                    <div>
                      <b>THIS MAY CAUSE DATA LOST</b>
                    </div>
                    The lock will be automatically unlocked after the expiry
                    time. Manual unlocking can ONLY be done when teachers are
                    blocked and seeking for help
                  </Alert>
                </div>
                <AdminEditingLockList />
              </div>
            )
          },
          {
            key: "synReportsUploader",
            title: "Upload Reports to Synergetic",
            component: (
              <ReportsUploader />
            )
          }
        ]}
      />
    </AdminPage>
  );
};

export default StudentReportAdminPage;
