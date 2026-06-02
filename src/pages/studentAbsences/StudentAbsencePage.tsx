import React from "react";

import SectionDiv from "../../components/common/SectionDiv";
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
      <SectionDiv className={"margin-top"}>
        <StudentAbsenceList />
      </SectionDiv>
    </Page>
  );
};

export default StudentAbsencePage;
