import ExplanationPanel from "../../components/ExplanationPanel";
import SectionDiv from "../../components/common/SectionDiv";
import MggDeviceList from "./components/MggDeviceList";
import { MGGS_MODULE_ID_MGG_APP_DEVICES } from "../../types/modules/iModuleUser";
import MggDevicesAdminPage from "./MggDevicesAdminPage";
import Page from "../../layouts/Page";

const MggDevicesPage = () => {
  return (
    <Page
      title={<h3>MGG Internal App Devices</h3>}
      moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}
      AdminPage={MggDevicesAdminPage}
    >
      <ExplanationPanel
        variant={"info"}
        text={
          <>
            <b>MGG Devices App Registry</b>
            <div>
              You need to register your app, before you sign into the MGG
              Internal APP.
            </div>
          </>
        }
      />
      <SectionDiv>
        <MggDeviceList />
      </SectionDiv>
    </Page>
  );
};

export default MggDevicesPage;
