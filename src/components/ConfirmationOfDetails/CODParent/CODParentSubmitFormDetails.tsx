import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import { Alert, Tab, Tabs } from "react-bootstrap";
import {
  COD_TAB_COURT_ORDERS,
  COD_TAB_GOVERNMENT_FUNDING,
  COD_TAB_MEDICAL_DETAILS,
  COD_TAB_PARENT_DETAILS,
  COD_TAB_PERMISSIONS,
  COD_TAB_SIBLINGS,
  COD_TAB_STUDENT_DETAILS
} from "../DetailsPanel/iCODDetailsEditPanel";
import CODStudentDetailsPanel from "../DetailsPanel/CODStudentDetailsPanel";
import CODParentsDetailsPanel from "../DetailsPanel/CODParentsDetailsPanel";
import CODLegalPanel from "../DetailsPanel/CODLegalPanel";
import CODMedicalDetailsPanel from "../DetailsPanel/CODMedicalDetailsPanel";
import CODSiblingsPanel from "../DetailsPanel/CODSiblingsPanel";
import CODGovernmentFundingPanel from "../DetailsPanel/CODGovernmentFundingPanel";
import CODPermissionsPanel from "../DetailsPanel/CODPermissionsPanel";
import PageNotFound from "../../PageNotFound";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import ConfirmationOfDetailsResponseService
  from '../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService';
import Toaster from '../../../services/Toaster';

const Wrapper = styled.div``;

type iCODParentSubmitFormDetails = {
  response: iConfirmationOfDetailsResponse;
};
const CODParentSubmitFormDetails = ({
  response
}: iCODParentSubmitFormDetails) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedTab, setSelectedTab] = useState(COD_TAB_STUDENT_DETAILS);
  const [editingResponse, setEditingResponse] = useState<
    iConfirmationOfDetailsResponse
  >({ ...response });
  const [isCanceled, setIsCanceled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditingResponse({ ...response });
  }, [response, currentUser]);

  const handleSaved = (resp: iConfirmationOfDetailsResponse) => {
    setIsSubmitting(true);
    ConfirmationOfDetailsResponseService.update(resp.id, resp)
      .then(res => {
        setEditingResponse(res);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  };

  const getCancelBtn = (resp: iConfirmationOfDetailsResponse, responseFieldName: string, isLoading?: boolean) => {
    return (
      <LoadingBtn
        isLoading={isLoading === true || isSubmitting === true}
        variant={"link"}
        onClick={() => {
          handleSaved(resp);
        }}
      >
        <Icons.Save /> Save for later
      </LoadingBtn>
    );
  };

  const getSubmitBtn = (resp: iConfirmationOfDetailsResponse, responseFieldName: string, isLoading?: boolean) => {
    return <LoadingBtn
      isLoading={isLoading === true || isSubmitting === true}
      variant={"primary"}
      onClick={() => {
        handleSaved(resp);
      }}
    >
      <Icons.Send /> Next
    </LoadingBtn>
  }

  const getContent = () => {
    if (isCanceled) {
      return (
        <PageNotFound
          title={"Form Saved"}
          description={
            "Your form has been saved for later, you can refresh the page to continue with the form."
          }
          secondaryBtn={<></>}
        />
      );
    }

    return (
      <>
        <Alert variant={"warning"}>
          Note: When you submit changes through the confirmation of details form
          they must be approved by the school. The changes will only take effect
          once they have been approved by the school.
        </Alert>
        <Tabs
          activeKey={selectedTab}
          onSelect={k => setSelectedTab(k || COD_TAB_STUDENT_DETAILS)}
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
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODParentSubmitFormDetails;
