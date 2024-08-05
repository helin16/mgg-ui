import styled from "styled-components";
import SchoolCensusDataPanel from "./SchoolCensusData/SchoolCensusDataPanel";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import AcaraDataPanel from "./ACARA/AcaraDataPanel";
import StudentStatusMatrix from "./StudentStatus/StudentStatusMatrix";

const TAB_NAME_CENSUS = "census";
const TAB_NAME_ACARA = "ACARA";
const TAB_NAME_STUDENT_STATUS_MATRIX = "STUDENT_STATUS_MATRIX";

const Wrapper = styled.div``;
const SchoolDataSubmissionsPanel = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_NAME_CENSUS);

  return (
    <Wrapper>
      <Tabs
        unmountOnExit
        activeKey={selectedTab}
        onSelect={k => setSelectedTab(k || TAB_NAME_CENSUS)}
        className="mb-3"
      >
        <Tab eventKey={TAB_NAME_CENSUS} title={"Census"}>
          <SchoolCensusDataPanel />
        </Tab>

        <Tab eventKey={TAB_NAME_ACARA} title={"ACARA / SFOE"}>
          <AcaraDataPanel />
        </Tab>

        <Tab
          eventKey={TAB_NAME_STUDENT_STATUS_MATRIX}
          title={"Student Status Matrix"}
        >
          <StudentStatusMatrix />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default SchoolDataSubmissionsPanel;
