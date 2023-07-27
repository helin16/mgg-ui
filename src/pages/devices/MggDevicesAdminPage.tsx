import styled from "styled-components";
import { FlexContainer } from "../../styles";
import * as Icons from "react-bootstrap-icons";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useState } from "react";
import ModuleUserList from "../../components/module/ModuleUserList";
import { MGGS_MODULE_ID_MGG_APP_DEVICES } from "../../types/modules/iModuleUser";
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';

const Wrapper = styled.div``;
type iMggDevicesAdminPage = {
  onNavBack?: () => void;
};
const TAB_USER = "users";
const TAB_ADMIN = "admins";
const MggDevicesAdminPage = ({ onNavBack }: iMggDevicesAdminPage) => {
  const [selectedTab, setSelectedTab] = useState(TAB_USER);

  return (
    <Wrapper>
      <FlexContainer className={"with-gap"}>
        <Button
          variant={"link"}
          onClick={() => onNavBack && onNavBack()}
          size={"sm"}
        >
          <Icons.ArrowLeft />
        </Button>
        <h3>MGG Internal App Devices - Admin</h3>
      </FlexContainer>

      <Tabs
        activeKey={selectedTab}
        className="mb-3"
        onSelect={k => setSelectedTab(k || TAB_USER)}
        unmountOnExit
      >
        <Tab eventKey={TAB_USER} title={"Users"}>
          <ModuleUserList
            roleId={ROLE_ID_NORMAL}
            moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}
            showDeletingBtn
            showCreatingPanel
          />
        </Tab>

        <Tab eventKey={TAB_ADMIN} title={"Admins"}>
          <ModuleUserList
            roleId={ROLE_ID_ADMIN}
            moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}
            showDeletingBtn
            showCreatingPanel
          />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default MggDevicesAdminPage;
