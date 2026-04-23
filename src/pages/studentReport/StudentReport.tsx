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
import PageNotFound from "../../components/PageNotFound";
import ContactSupportPopupBtn from "../../components/support/ContactSupportPopupBtn";
import Page from "../../layouts/Page";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
import {
  STUDENT_CONTACT_TYPE_SC1,
  STUDENT_CONTACT_TYPE_SC2,
  STUDENT_CONTACT_TYPE_SC3
} from "../../types/Synergetic/Student/iStudentContact";
import SynCommunityService from '../../services/Synergetic/Community/SynCommunityService';
import {OP_OR} from '../../helper/ServiceHelper';
import * as _ from 'lodash';
import StudentContactService from '../../services/Synergetic/Student/StudentContactService';

const StudentReport = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState<iVStudent | null>(
    null
  );
  const [isModuleUser, setIsModuleUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedSynId = urlParams.get('synId');
    let isCancelled = false;
    if (!user || (user?.isStudent !== true && requestedSynId ==='')) {
      return;
    }

    const isRequestStudentUnderCurrentUser = async (): Promise<boolean> => {
      if (user?.isParent !== true || `${requestedSynId || ''}`.trim() === '') {
        return false;
      }
      const parentsProfiles = await SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({[OP_OR]: [{SpouseID: user?.synergyId}, {ID: user?.synergyId}]})
      });
      const parentIds: number[] = [];
      parentsProfiles.data.map(community => { // @ts-ignore
        parentIds.push(Number(community.ID));
        parentIds.push(Number(community.SpouseID));
        return null;
      });

      const results = await StudentContactService.getStudentContacts({
        where: JSON.stringify({
          LinkedID: _.uniq(parentIds),
          ID: requestedSynId,
          ContactType: [
            STUDENT_CONTACT_TYPE_SC1,
            STUDENT_CONTACT_TYPE_SC2,
            STUDENT_CONTACT_TYPE_SC3
          ],
        }),
      })
      return (results.data || []).length > 0;
    }

    setIsLoading(true);
    Promise.all([
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({StudentID: user?.isStudent === true ? user?.synergyId : (requestedSynId || '')}),
        perPage: 1,
        sort: 'FileYear:DESC,FileSemester:DESC'
      }),
      // get the current requested student's parent
      ...((user?.isParent !== true || `${requestedSynId || ''}`.trim() === '') ? [] : [isRequestStudentUnderCurrentUser()])
    ])
      .then(resp => {
        if (isCancelled) {
          return;
        }
        const students = resp[0].data || [];
        if (user?.isParent === true && resp.length > 1 && resp[1] !== true) {
          return;
        }
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
        setIsModuleUser(
          Object.values(resp).filter(userRole => userRole.canAccess === true)
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
    if (user?.isTeacher === true || isModuleUser === true) {
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
