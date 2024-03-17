import React, { useEffect, useState } from "react";
import SearchPage from "./components/SearchPage";
import iVStudent from "../../types/Synergetic/Student/iVStudent";
import StudentDetailsPage from "./components/StudentDetailsPage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/makeReduxStore";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import Page401 from "../../components/Page401";
import StudentGridForAParent from "../../components/student/StudentGridForAParent";
import AuthService from "../../services/AuthService";
import { MGGS_MODULE_ID_STUDENT_REPORT } from "../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN } from "../../types/modules/iRole";
import PageNotFound from "../../components/PageNotFound";
import ContactSupportPopupBtn from "../../components/support/ContactSupportPopupBtn";
import Page from "../../layouts/Page";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
import {
  STUDENT_CONTACT_TYPE_SC1,
  STUDENT_CONTACT_TYPE_SC2,
  STUDENT_CONTACT_TYPE_SC3
} from "../../types/Synergetic/Student/iStudentContact";

const StudentReport = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState<iVStudent | null>(
    null
  );
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!user || user?.isStudent !== true) {
      return;
    }
    setIsLoading(true);
    SynVStudentService.getVPastAndCurrentStudentAll({
      where: JSON.stringify({StudentID: user?.synergyId || ''}),
      perPage: 1,
    })
      .then(resp => {
        if (isCancelled) {
          return;
        }
        const students = resp.data || [];
        setSelectedStudent(students.length > 0 ? students[0] : null);
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || user?.isStaff !== true) {
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    AuthService.canAccessModule(MGGS_MODULE_ID_STUDENT_REPORT)
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setIsAdminUser(
          // @ts-ignore
          Object.keys(resp).filter(roleId => `${roleId}` === `${ROLE_ID_ADMIN}` && resp[`${roleId || ''}`].canAccess === true)
            .length > 0
        );
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [user]);

  if (!user) {
    return null;
  }

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  const getMainPage = () => {
    if (selectedStudent) {
      return (
        <StudentDetailsPage
          student={selectedStudent}
          onClearSelectedStudent={() => setSelectedStudent(null)}
        />
      );
    }
    if (user?.isParent === true) {
      return (
        <StudentGridForAParent
          parentSynId={user?.synergyId}
          onSelect={student => setSelectedStudent(student)}
          contactTypes={[
            STUDENT_CONTACT_TYPE_SC1,
            STUDENT_CONTACT_TYPE_SC2,
            STUDENT_CONTACT_TYPE_SC3
          ]}
        />
      );
    }
    if (user?.isTeacher === true || isAdminUser === true) {
      return <SearchPage onSelect={student => setSelectedStudent(student)} />;
    }
    if (user?.isStudent === true && !selectedStudent) {
      return (
        <PageNotFound
          title={`Oops, we can NOT find your profile.`}
          description={
            <span>
              Sorry we can't find your profile as a current student. <br />
              This may be caused by your session timed out, please try to
              refresh this page to reconnect <br />
              If you believe there is an issue, please report this to the
              School.<br />
              If you are student left the school, please click on "Report this issue" button,
              we will email you a copy of your report.
            </span>
          }
          secondaryBtn={
            <ContactSupportPopupBtn variant="link">
              Report this issue
            </ContactSupportPopupBtn>
          }
        />
      );
    }

    return <Page401 />;
  };

  return <Page className={"student-report-wrapper"}>{getMainPage()}</Page>;
};

export default StudentReport;
