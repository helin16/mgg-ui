import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import TimeTableImportPopupBtn from "../../../components/timeTable/TimeTableImportPopupBtn";
import Page401 from "../../../components/Page401";
import Page from "../../../layouts/Page";
import { MGGS_MODULE_ID_MY_CLASS_LIST } from "../../../types/modules/iModuleUser";
import MyClassListAdminPage from "./MyClassLisAdminPage";
import MyClassList from "./components/MyClassList";
import ExplanationPanel from "../../../components/ExplanationPanel";
import ModuleAccessWrapper from "../../../components/module/ModuleAccessWrapper";

const MyClassListPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const errorMsg = (
    <>
      Only <b>Teachers</b> and selected <b>Users of this Module</b> will have
      access to this page
    </>
  );
  const moduleId = MGGS_MODULE_ID_MY_CLASS_LIST;

  const getContent = () => {
    return (
      <Page
        title={<h3>My Class List</h3>}
        AdminPage={MyClassListAdminPage}
        moduleId={moduleId}
        extraBtns={[<TimeTableImportPopupBtn btnPros={{ size: "sm" }} key={'tt-import-btn'}/>]}
      >
        <ExplanationPanel
          text={
            <>
              This page is designed for teachers export student list, in order
              to import them into external tools like: Education Perfect. Data
              is pulled from Synergetic directly.
              <h6 className={"text-danger text-capitalize"}>{errorMsg}</h6>
            </>
          }
        />

        <MyClassList />
      </Page>
    );
  };

  if (user?.isStaff === true) {
    return (
      <ModuleAccessWrapper
        moduleId={moduleId}
        accessDenyPanel={
          user?.isTeacher === true ? (
            getContent()
          ) : (
            <Page401 description={errorMsg} />
          )
        }
      >
        {getContent()}
      </ModuleAccessWrapper>
    );
  }

  return <Page401 description={errorMsg} />;
};

export default MyClassListPage;
