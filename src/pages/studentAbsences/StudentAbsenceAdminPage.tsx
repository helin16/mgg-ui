import ModuleUserList from "../../components/module/ModuleUserList";
import iModuleUser, {
  MGGS_MODULE_ID_STUDENT_ABSENCES
} from "../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN, ROLE_ID_NORMAL } from "../../types/modules/iRole";
import ExplanationPanel from "../../components/ExplanationPanel";
import SectionDiv from "../../components/common/SectionDiv";
import { useState } from "react";
import SchoolManagementTable from "../../components/SchoolManagement/SchoolManagementTable";
import { SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR } from "../../types/Synergetic/iSchoolManagementTeam";
import StudentAbsenceModuleEditPanel from "./components/StudentAbsenceModuleEditPanel";
import MessageListPanel from "../../components/common/Message/MessageListPanel";
import { MESSAGE_TYPE_ABSENCE_SYNC_TO_SYNERGETIC } from "../../types/Message/iMessage";
import { iTableColumn } from "../../components/common/Table";
import ToggleBtn from "../../components/common/ToggleBtn";
import UserService from "../../services/UserService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../services/Toaster";
import MathHelper from "../../helper/MathHelper";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";

type iStudentAbsenceAdminPage = {
  onNavBack: () => void;
};

const StudentAbsenceAdminPage = ({ onNavBack }: iStudentAbsenceAdminPage) => {
  const [, setIsUpdating] = useState(false);
  const [count, setCount] = useState(0);

  const setEmailNotificationForAUser = (
    user: iModuleUser,
    checked: boolean
  ) => {
    setIsUpdating(true);
    UserService.updateUser(user.ModuleID, user.RoleID, user.SynergeticID, {
      settings: {
        ...(user.settings || {}),
        ignoreEmailNotificationFlag: checked
      }
    })
      .then(resp => {
        Toaster.showToast("Updated", TOAST_TYPE_SUCCESS);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsUpdating(false);
        setCount(MathHelper.add(count, 1));
      });
  };

  return (
    <AdminPage
      title={<h3>Student Absence Admin</h3>}
      moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
      onNavBack={onNavBack}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
        usersTab={
          <SectionDiv>
            <ExplanationPanel
              text={
                <>
                  Normal users will receive notifications when an absence
                  submitted or updated.
                  <div>
                    <b>
                      All Head of Years will be included into normal users
                      automatically. but they will only operate on the same year
                      level of the student
                    </b>
                  </div>
                </>
              }
            />
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
              roleId={ROLE_ID_NORMAL}
              showDeletingBtn
              showCreatingPanel
              forceReload={count}
              extraColumns={[
                {
                  key: "EmailNotification",
                  header: "Noti?",
                  cell: (column: iTableColumn<iModuleUser>, data: iModuleUser) => {
                    return (
                      <td key={column.key}>
                        <ToggleBtn
                          size={"sm"}
                          on={"Yes"}
                          off={"No"}
                          checked={
                            data.settings?.ignoreEmailNotificationFlag !== true
                          }
                          onChange={value =>
                            setEmailNotificationForAUser(data, !value)
                          }
                        />
                      </td>
                    );
                  }
                }
              ]}
            />

            <SectionDiv>
              <h5>Head Of Years</h5>
              <SchoolManagementTable
                roleCodes={[SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR]}
                viewOnly
                showExplanation={false}
                showSearchPanel={false}
              />
            </SectionDiv>
          </SectionDiv>
        }
        adminsTab={
          <SectionDiv>
            <ExplanationPanel
              text={
                "Admin users will not receive notifications when an absence submitted or updated. Admin users is designed to config this module"
              }
            />
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
              roleId={ROLE_ID_ADMIN}
              showDeletingBtn
              showCreatingPanel
            />
          </SectionDiv>
        }
        extraTabs={[
          {
            key: "settings",
            title: "Settings",
            component: (
              <SectionDiv>
                <StudentAbsenceModuleEditPanel />
              </SectionDiv>
            )
          }, {
            key: "logs",
            title: "Logs",
            component: (
              <SectionDiv>
                <MessageListPanel type={MESSAGE_TYPE_ABSENCE_SYNC_TO_SYNERGETIC} />
              </SectionDiv>
            )
          }
        ]}
      />
    </AdminPage>
  );
};

export default StudentAbsenceAdminPage;
