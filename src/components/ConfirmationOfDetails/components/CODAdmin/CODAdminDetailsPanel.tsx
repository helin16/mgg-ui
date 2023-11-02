import styled from "styled-components";
import { Tab, Tabs } from "react-bootstrap";
import {useEffect, useState} from "react";
import iConfirmationOfDetailsResponse from "../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import CODAdminStudentDetailsPanel from "./DetailsPanel/CODAdminStudentDetailsPanel";
import PageLoadingSpinner from '../../../common/PageLoadingSpinner';

const Wrapper = styled.div``;

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
  onRefreshList,
}: iCODAdminDetailsPanel) => {
  const defaultSelectedTab = defaultTabKey || TAB_STUDENT_DETAILS;
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const [editingResponse, setEditingResponse] = useState<iConfirmationOfDetailsResponse | null>(null);

  useEffect(() => {
    setEditingResponse({...response});
  }, [response]);

  const handleSaved = (saved: iConfirmationOfDetailsResponse) => {
    setEditingResponse(saved);
    onSaved && onSaved(saved);
  }

  if (!editingResponse) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <Tabs
        activeKey={selectedTab}
        onSelect={k => setSelectedTab(k || defaultSelectedTab)}
        unmountOnExit
      >
        <Tab title={TAB_STUDENT_DETAILS} eventKey={TAB_STUDENT_DETAILS}>
          <CODAdminStudentDetailsPanel
            response={editingResponse}
            onCancel={() => onCancel && onCancel()}
            onRefreshList={onRefreshList}
            onSaved={handleSaved}
          />
        </Tab>

        <Tab title={TAB_PARENT_DETAILS} eventKey={TAB_PARENT_DETAILS}>
          {TAB_PARENT_DETAILS}
        </Tab>

        <Tab title={TAB_COURT_ORDERS} eventKey={TAB_COURT_ORDERS}>
          {TAB_COURT_ORDERS}
        </Tab>

        <Tab title={TAB_MEDICAL_DETAILS} eventKey={TAB_MEDICAL_DETAILS}>
          {TAB_MEDICAL_DETAILS}
        </Tab>

        <Tab title={TAB_SIBLINGS} eventKey={TAB_SIBLINGS}>
          {TAB_SIBLINGS}
        </Tab>

        <Tab title={TAB_GOVERNMENT_FUNDING} eventKey={TAB_GOVERNMENT_FUNDING}>
          {TAB_GOVERNMENT_FUNDING}
        </Tab>

        <Tab title={TAB_PERMISSIONS} eventKey={TAB_PERMISSIONS}>
          {TAB_PERMISSIONS}
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default CODAdminDetailsPanel;
