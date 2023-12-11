import styled from "styled-components";
import { Tab, Tabs } from "react-bootstrap";
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
import {
  COD_TAB_COURT_ORDERS, COD_TAB_GOVERNMENT_FUNDING, COD_TAB_MEDICAL_DETAILS,
  COD_TAB_PARENT_DETAILS, COD_TAB_PERMISSIONS, COD_TAB_SIBLINGS,
  COD_TAB_STUDENT_DETAILS
} from '../DetailsPanel/iCODDetailsEditPanel';
import LoadingBtn from '../../common/LoadingBtn';
import * as Icons from "react-bootstrap-icons";
import moment from 'moment-timezone';
import {FlexContainer} from '../../../styles';

const Wrapper = styled.div`
  .cod-submit-btns-wrapper {
    margin-top: 2rem;
  }
`;


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
}: iCODAdminDetailsPanel) => {
  const defaultSelectedTab = defaultTabKey || COD_TAB_STUDENT_DETAILS;
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iConfirmationOfDetailsResponse | null>(null);

  useEffect(() => {
    setEditingResponse({ ...response });
  }, [response]);

  // const handleSaved = (
  //   saved: iConfirmationOfDetailsResponse,
  //   externalSave = false
  // ) => {
  //   setEditingResponse(saved);
  //   if (externalSave === true && onSaved) {
  //     onSaved(saved);
  //   }
  // };

  const getCancelBtn = (editingResponse: iConfirmationOfDetailsResponse, responseFieldName: string, isLoading?: boolean) => {
    if (!onCancel) {
      return null;
    }

    return <LoadingBtn isLoading={isLoading === true} onClick={() => onCancel && onCancel()} variant={'link'}>
      <Icons.XLg /> Cancel
    </LoadingBtn>
  }

  const getSubmitBtn = (editingResponse: iConfirmationOfDetailsResponse, responseFieldName: string, isLoading?: boolean) => {
    if (
      `${editingResponse.syncToSynAt || ""}`.trim() !== "" ||
      `${editingResponse.syncToSynById || ""}`.trim() !== ""
    ) {
      return (
        <FlexContainer
          className={"justify-content-end with-gap lg-gap align-items-baseline"}
        >
          <small className={"text-muted"}>
            Sync'd @ {moment(editingResponse.syncToSynAt).format("lll")} By{" "}
            {editingResponse.SyncToSynBy?.NameInternal || ""}
          </small>
          {getCancelBtn && getCancelBtn(editingResponse, responseFieldName, isLoading)}
        </FlexContainer>
      );
    }
  }

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
        <Tab title={COD_TAB_STUDENT_DETAILS} eventKey={COD_TAB_STUDENT_DETAILS}>
          <CODStudentDetailsPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'student'}
            isForParent={false}
          />
        </Tab>

        <Tab title={COD_TAB_PARENT_DETAILS} eventKey={COD_TAB_PARENT_DETAILS}>
          <CODParentsDetailsPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'parents'}
            isForParent={false}
          />
        </Tab>

        <Tab title={COD_TAB_COURT_ORDERS} eventKey={COD_TAB_COURT_ORDERS}>
          <CODLegalPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'courtOrder'}
            isForParent={false}
          />
        </Tab>

        <Tab title={COD_TAB_MEDICAL_DETAILS} eventKey={COD_TAB_MEDICAL_DETAILS}>
          <CODMedicalDetailsPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'medicalDetails'}
            isForParent={false}
          />
        </Tab>

        <Tab title={COD_TAB_SIBLINGS} eventKey={COD_TAB_SIBLINGS}>
          <CODSiblingsPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'siblings'}
            isForParent={false}
          />
        </Tab>

        <Tab title={COD_TAB_GOVERNMENT_FUNDING} eventKey={COD_TAB_GOVERNMENT_FUNDING}>
          <CODGovernmentFundingPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'governmentFunding'}
            isForParent={false}
          />
        </Tab>

        <Tab title={COD_TAB_PERMISSIONS} eventKey={COD_TAB_PERMISSIONS}>
          <CODPermissionsPanel
            response={editingResponse}
            getCancelBtn={getCancelBtn}
            getSubmitBtn={getSubmitBtn}
            responseFieldName={'permissions'}
            isForParent={false}
          />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default CODAdminDetailsPanel;
