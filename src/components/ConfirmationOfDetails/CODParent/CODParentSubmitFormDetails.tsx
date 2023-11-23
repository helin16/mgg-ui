import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import { Alert, Tab, Tabs } from "react-bootstrap";
import PageNotFound from "../../PageNotFound";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import ConfirmationOfDetailsResponseService from "../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import Toaster from "../../../services/Toaster";
import CODFormHelper from "../CODFormHelper";
import MathHelper from '../../../helper/MathHelper';

const Wrapper = styled.div``;

type iCODParentSubmitFormDetails = {
  response: iConfirmationOfDetailsResponse;
};
const CODParentSubmitFormDetails = ({
  response
}: iCODParentSubmitFormDetails) => {
  const steps = CODFormHelper.getSteps();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [editingResponse, setEditingResponse] = useState<
    iConfirmationOfDetailsResponse
  >({ ...response });
  const [isCanceled, setIsCanceled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditingResponse({ ...response });
  }, [response, currentUser]);

  const handleSaved = (
    resp: iConfirmationOfDetailsResponse,
    onSuccess?: (saved: iConfirmationOfDetailsResponse) => void
  ) => {
    setIsSubmitting(true);
    ConfirmationOfDetailsResponseService.update(resp.id, resp)
      .then(res => {
        setEditingResponse(res);
        onSuccess && onSuccess(res);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getCancelBtn = (
    resp: iConfirmationOfDetailsResponse,
    responseFieldName: string,
    isLoading?: boolean
  ) => {
    return (
      <LoadingBtn
        isLoading={isLoading === true || isSubmitting === true}
        variant={"link"}
        onClick={() => {
          handleSaved(resp, () => setIsCanceled(true));
        }}
      >
        <Icons.Save /> Save for later
      </LoadingBtn>
    );
  };

  const getSubmitBtn = (
    resp: iConfirmationOfDetailsResponse,
    responseFieldName: string,
    isLoading?: boolean,
    preSubmitFn?: (data: any) => boolean
  ) => {
    const editingResponse =
      // @ts-ignore
      responseFieldName in response ? response[responseFieldName] : {};
    return (
      <LoadingBtn
        isLoading={isLoading === true || isSubmitting === true}
        variant={"primary"}
        onClick={() => {
          if (preSubmitFn && preSubmitFn(editingResponse) !== true) {
            return;
          }
          handleSaved(resp, () => {
            setSelectedTabIndex(MathHelper.add(selectedTabIndex, 1))
          });
        }}
      >
        <Icons.Send /> Next
      </LoadingBtn>
    );
  };

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
          Note: Changes submitted through the confirmation form will take effect
          only after School approval.
        </Alert>
        <Tabs
          activeKey={steps[selectedTabIndex].key}
          onSelect={k => setSelectedTabIndex(steps.findIndex(step => step.key === k))}
          unmountOnExit
        >
          {steps.map(Step => {
            return (
              <Tab
                title={Step.key}
                eventKey={Step.key}
                key={Step.key}
              >
                <Step.Component
                  response={editingResponse}
                  getCancelBtn={getCancelBtn}
                  getSubmitBtn={getSubmitBtn}
                  responseFieldName={Step.responseFieldName}
                  isForParent={true}
                />
              </Tab>
            );
          })}
        </Tabs>
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODParentSubmitFormDetails;
