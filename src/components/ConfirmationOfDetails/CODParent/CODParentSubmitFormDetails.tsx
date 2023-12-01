import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import {Alert, Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import PageNotFound from "../../PageNotFound";
import LoadingBtn from "../../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import ConfirmationOfDetailsResponseService from "../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import Toaster, {TOAST_TYPE_ERROR} from "../../../services/Toaster";
import CODFormHelper from "../CODFormHelper";
import MathHelper from "../../../helper/MathHelper";
import ContactSupportPopupBtn from '../../support/ContactSupportPopupBtn';

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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    const isLastStep = selectedTabIndex >= MathHelper.sub(steps.length, 1);

    return (
      <LoadingBtn
        isLoading={isLoading === true || isSubmitting === true}
        variant={"primary"}
        onClick={() => {
          const sameSteps = steps.filter((s) => s.responseFieldName === responseFieldName);
          const sameStep = sameSteps.length > 0 ? sameSteps[0] : null;
          const editingResp =
            // @ts-ignore
            responseFieldName in (resp.response || {}) ? resp.response[responseFieldName] : {};
          if (preSubmitFn && preSubmitFn(editingResp) !== true) {
            return;
          }

          const responseWithSuccessFlag= sameStep?.isRequired === true ? {...resp, response: {
            ...(resp.response || {}),
            [responseFieldName]: {
              ...editingResp,
              readyForSubmission: true,
            },
          }} : resp;

          // Loop through all steps to find out any steps that not ready for submission
          const inCompleteSteps = steps.filter(step => {
            const savedResp =
              // @ts-ignore
              step.responseFieldName in (responseWithSuccessFlag.response || {}) ? responseWithSuccessFlag.response[step.responseFieldName] : {};
            if (step.isRequired === true && savedResp?.readyForSubmission !== true) {
              return true;
            }
            return false;
          })

          handleSaved(responseWithSuccessFlag, (saved: iConfirmationOfDetailsResponse) => {
            if (isLastStep !== true) {
              setSelectedTabIndex(MathHelper.add(selectedTabIndex, 1));
              return;
            }

            if (inCompleteSteps.length > 0) {
              Toaster.showToast(`Please finish the section "${inCompleteSteps[0].key}", before you submit.`, TOAST_TYPE_ERROR)
              setSelectedTabIndex(steps.findIndex(step => step.key === inCompleteSteps[0].key));
              return;
            }
            setIsSubmitted(true);
          });
        }}
      >
        {isLastStep === true ? <><Icons.Send /> Submit</> : <>Next <Icons.CaretRightFill /></>}
      </LoadingBtn>
    );
  };

  const getIsStepFinished = (step: any, showingResponse: iConfirmationOfDetailsResponse) => {
    const showingResp =
      // @ts-ignore
      step.responseFieldName in (showingResponse.response || {}) ? showingResponse.response[step.responseFieldName] : {};
    if (step.isRequired === true && showingResp?.readyForSubmission !== true) {
      return <Icons.CircleFill className={'text-danger'} style={{fontSize: '9px'}}/>;
    }
    return null;
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

    if (isSubmitted === true) {
      return (
        <PageNotFound
          title={<div className={"text-success"}>Form Submitted</div>}
          description={
            <Row className="justify-content-md-center">
              <Col md={6} >
                <Alert variant={"success"}>
                  <div><Icons.HandThumbsUpFill style={{fontSize: '42px', margin: '0.3rem 0'}}/></div>
                  You've submitted the form, we will start process your details
                  soon.
                  <div>In the meantime, feel free to contact us.</div>
                </Alert>
              </Col>
            </Row>
          }
          secondaryBtn={<Button variant={'success'} href={'/'}>Back to mConnect</Button>}
          primaryBtn={
            <ContactSupportPopupBtn variant={'link'}>
              Contact Us
            </ContactSupportPopupBtn>
          }
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
          activeKey={steps[selectedTabIndex]?.key || ""}
          onSelect={k =>
            setSelectedTabIndex(steps.findIndex(step => step.key === k))
          }
          unmountOnExit
        >
          {steps.map(Step => {
            return (
              <Tab title={<>{Step.key}{' '}{getIsStepFinished(Step, editingResponse)}</>} eventKey={Step.key} key={Step.key}>
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
