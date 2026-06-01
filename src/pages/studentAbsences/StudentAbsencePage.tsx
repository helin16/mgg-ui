import React from "react";

import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_STUDENT_ABSENCES } from "../../types/modules/iModuleUser";
import StudentAbsenceAdminPage from "./StudentAbsenceAdminPage";
import StudentAbsenceList from "./components/StudentAbsenceList";

const StudentAbsencePage = () => {
  return (
    <Page
      title={<h3>Student Absence(s)</h3>}
      moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
      AdminPage={StudentAbsenceAdminPage}
    >
      <StudentAbsenceList />
    </Page>
  );
};

export default StudentAbsencePage;
