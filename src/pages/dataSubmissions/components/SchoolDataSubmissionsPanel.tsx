import styled from "styled-components";
import SchoolCensusDataPanel from "./SchoolCensusData/SchoolCensusDataPanel";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import AcaraDataPanel from "./ACARA/AcaraDataPanel";
import StudentStatusMatrix from "./StudentStatus/StudentStatusMatrix";
import VRQAPanel from './VRQA/VRQAPanel';


enum TabNames {
  Census = "census",
  Acara = "Acara",
  Matrix = "Matrix",
  VRTQA = "VRTQA",
}

const Wrapper = styled.div``;
const SchoolDataSubmissionsPanel = () => {
  const [selectedTab, setSelectedTab] = useState<TabNames>(TabNames.Census);

  return (
    <Wrapper>
      <Tabs
        unmountOnExit
        activeKey={selectedTab}
        onSelect={k => setSelectedTab(k as TabNames || TabNames.Census)}
        className="mb-3"
      >
        <Tab eventKey={TabNames.Census} title={"Census"}>
          <SchoolCensusDataPanel />
        </Tab>

        <Tab eventKey={TabNames.Acara} title={"ACARA / SFOE"}>
          <AcaraDataPanel />
        </Tab>

        <Tab
          eventKey={TabNames.Matrix}
          title={"Student Status Matrix"}
        >
          <StudentStatusMatrix />
        </Tab>

        <Tab
          eventKey={TabNames.VRTQA}
          title={"Future Enrolments"}
        >
          <VRQAPanel />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default SchoolDataSubmissionsPanel;
