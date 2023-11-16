import styled from "styled-components";
import { Alert, Tab, Tabs } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import CODStudentDetailsPanel from "../DetailsPanel/CODStudentDetailsPanel";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import CODParentsDetailsPanel from "../DetailsPanel/CODParentsDetailsPanel";
import CODLegalPanel from "../DetailsPanel/CODLegalPanel";
import CODMedicalDetailsPanel from "../DetailsPanel/CODMedicalDetailsPanel";
import CODSiblingsPanel from "../DetailsPanel/CODSiblingsPanel";
import CODGovernmentFundingPanel from '../DetailsPanel/CODGovernmentFundingPanel';
import CODPermissionsPanel from '../DetailsPanel/CODPermissionsPanel';

const Wrapper = styled.div`
  .cod-submit-btns-wrapper {
    margin-top: 2rem;
  }
`;

const TAB_STUDENT_DETAILS = "Student Details";
const TAB_PARENT_DETAILS = "Parent Details";
const TAB_COURT_ORDERS = "Court Orders";
const TAB_MEDICAL_DETAILS = "Medical Details";
const TAB_SIBLINGS = "Siblings";
const TAB_GOVERNMENT_FUNDING = "Government Funding";
const TAB_PERMISSIONS = "Permissions";

type iCODAdminDetailsPanel = {
  defaultTabKey?: string;
  response: iConfirmationOfDetailsResponse;
  onCancel?: () => void;
  onRefreshList?: () => void;
  onSaved?: (response: iConfirmationOfDetailsResponse) => void;
};
const CODAdminDetailsPanel = ({
  defaultTabKey,
  response,
  onCancel,
  onSaved,
  onRefreshList
}: iCODAdminDetailsPanel) => {
  const defaultSelectedTab = defaultTabKey || TAB_STUDENT_DETAILS;
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iConfirmationOfDetailsResponse | null>(null);

  useEffect(() => {
    setEditingResponse({ ...response });
  }, [response]);

  const handleSaved = (
    saved: iConfirmationOfDetailsResponse,
    externalSave = false
  ) => {
    setEditingResponse(saved);
    if (externalSave === true && onSaved) {
      onSaved(saved);
    }
  };

  if (!editingResponse) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Tabs
        activeKey={selectedTab}
        onSelect={k => setSelectedTab(k || defaultSelectedTab)}
        unmountOnExit
      >
        <Tab title={TAB_STUDENT_DETAILS} eventKey={TAB_STUDENT_DETAILS}>
          <CODStudentDetailsPanel
            response={editingResponse}
            onCancel={onCancel}
            onSaved={resp => {
              setSelectedTab(TAB_PARENT_DETAILS);
              handleSaved(resp);
            }}
            isForParent={false}
            onNextStep={() => setSelectedTab(TAB_PARENT_DETAILS)}
          />
        </Tab>

        <Tab title={TAB_PARENT_DETAILS} eventKey={TAB_PARENT_DETAILS}>
          <CODParentsDetailsPanel
            response={editingResponse}
            onCancel={onCancel}
            isForParent={false}
            onSaved={resp => {
              setSelectedTab(TAB_COURT_ORDERS);
              handleSaved(resp);
            }}
            onNextStep={() => setSelectedTab(TAB_COURT_ORDERS)}
          />
        </Tab>

        <Tab title={TAB_COURT_ORDERS} eventKey={TAB_COURT_ORDERS}>
          <CODLegalPanel
            response={editingResponse}
            onCancel={onCancel}
            isForParent={false}
            onSaved={resp => {
              setSelectedTab(TAB_MEDICAL_DETAILS);
              handleSaved(resp);
            }}
            onNextStep={() => setSelectedTab(TAB_MEDICAL_DETAILS)}
          />
        </Tab>

        <Tab title={TAB_MEDICAL_DETAILS} eventKey={TAB_MEDICAL_DETAILS}>
          <CODMedicalDetailsPanel
            response={editingResponse}
            onCancel={onCancel}
            isForParent={false}
            onSaved={resp => {
              setSelectedTab(TAB_MEDICAL_DETAILS);
              handleSaved(resp);
            }}
            onNextStep={() => setSelectedTab(TAB_MEDICAL_DETAILS)}
          />
        </Tab>

        <Tab title={TAB_SIBLINGS} eventKey={TAB_SIBLINGS}>
          <CODSiblingsPanel
            response={editingResponse}
            onCancel={onCancel}
            onNextStep={() => setSelectedTab(TAB_GOVERNMENT_FUNDING)}
            isDisabled={true}
            isForParent={false}
            description={
              <Alert variant={"warning"}>
                As the restrictions in Synergetic, please manually copy and
                paste the information below into Synergetic and click on the
                button "Next" below.
              </Alert>
            }
          />
        </Tab>

        <Tab title={TAB_GOVERNMENT_FUNDING} eventKey={TAB_GOVERNMENT_FUNDING}>
          <CODGovernmentFundingPanel
            response={editingResponse}
            onCancel={onCancel}
            isForParent={false}
            onSaved={resp => {
              setSelectedTab(TAB_PERMISSIONS);
              handleSaved(resp);
            }}
            onNextStep={() => setSelectedTab(TAB_PERMISSIONS)}
          />
        </Tab>

        <Tab title={TAB_PERMISSIONS} eventKey={TAB_PERMISSIONS}>
          <CODPermissionsPanel
            response={editingResponse}
            onCancel={onCancel}
            isForParent={false}
            onSaved={resp => {
              handleSaved(resp);
            }}
          />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default CODAdminDetailsPanel;
