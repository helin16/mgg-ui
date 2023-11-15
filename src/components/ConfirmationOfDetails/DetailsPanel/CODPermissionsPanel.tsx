import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { iCODPermissionsResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import { FlexContainer } from "../../../styles";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
import ConfirmationOfDetailsResponseService from "../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import moment from "moment-timezone";
import Toaster from "../../../services/Toaster";
import { Button, Col, Row } from "react-bootstrap";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import ToggleBtn from "../../common/ToggleBtn";
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import SectionDiv from '../../common/SectionDiv';

const Wrapper = styled.div`
  .input-div {
    .btn.btn-link {
      margin: 0px;
      text-align: left;
      padding: 0px;
      text-decoration: underline !important;
    }
  }
`;
const CODPermissionsPanel = ({
  response,
  isDisabled,
  onSaved,
  onCancel,
  onNextStep
}: ICODDetailsEditPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODPermissionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    setEditingResponse(response?.response?.permissions || null);
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([])
      .then(resp => {
        if (isCanceled) {
          return;
        }
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [response]);

  useEffect(() => {
    const hasBeenSyncd =
      `${editingResponse?.syncToSynAt || ""}`.trim() !== "" &&
      `${editingResponse?.syncToSynById || ""}`.trim() !== "";
    setIsReadOnly(hasBeenSyncd === true || isDisabled === true);
  }, [editingResponse, isDisabled]);

  const updatePermissionResponse = (fieldName: string, newValue: any) => {
    const resp = editingResponse || {};
    // @ts-ignore
    setEditingResponse({
      ...resp,
      [fieldName]: newValue
    });
  };

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }
    return (
      <>
        <Row>
          <Col>
            <CODAdminInputPanel
              label={"Excursion Permission:"}
              value={editingResponse?.excursionChecked === true ? "YES" : "NO"}
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={"with-gap align-items-center"}
                    >
                      <div>I/We have read and agree with</div>
                      <Button
                        target="_blank"
                        href="https://mconnect.mentonegirls.vic.edu.au/send.php?id=87102"
                        size={"sm"}
                        variant={"link"}
                      >
                        Excursion Permission
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.excursionChecked === true}
                      onChange={checked =>
                        updatePermissionResponse("excursionChecked", checked)
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              label={"Parents' Association:"}
              value={
                editingResponse?.allowParentAssociation === true ? "YES" : "NO"
              }
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <div>
                      I/We agree to share my/our contact details with Mentone
                      Girls' Grammar Parents' Association
                    </div>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.allowParentAssociation === true}
                      onChange={checked =>
                        updatePermissionResponse(
                          "allowParentAssociation",
                          checked
                        )
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              label={"Greet to receive SMS:"}
              value={editingResponse?.allowReceivingSMS === true ? "YES" : "NO"}
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <div>
                      To Manage student attendance and/or in the event of an
                      emergency (eg. fires, critical incidents), I/We agree to
                      the School using my mobile phone number to broadcast SMS
                      messages.
                    </div>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.allowReceivingSMS === true}
                      onChange={checked =>
                        updatePermissionResponse("allowReceivingSMS", checked)
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              label={"Parent Consent:"}
              value={editingResponse?.allowReceivingSMS === true ? "YES" : "NO"}
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={"with-gap align-items-center"}
                    >
                      <div>I/We have read</div>
                      <Button
                        href="https://mconnect.mentonegirls.vic.edu.au/send.php?id=87099"
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Parental Consent for Use of Images
                      </Button>
                      <div>and agree to give my/our consent.</div>
                    </FlexContainer>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.agreeParentConsent === true}
                      onChange={checked =>
                        updatePermissionResponse("agreeParentConsent", checked)
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              label={"School Commitment:"}
              value={
                editingResponse?.agreeSchoolCommitment === true ? "YES" : "NO"
              }
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer className={"with-gap align-items-center"}>
                      <div>I/We have read and agree with</div>
                      <Button
                        href="https://mconnect.mentonegirls.vic.edu.au/send.php?id=56899"
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Commitment to Mentone Girls' Grammar School
                      </Button>
                      <div>.</div>
                    </FlexContainer>

                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.agreeSchoolCommitment === true}
                      onChange={checked =>
                        updatePermissionResponse(
                          "agreeSchoolCommitment",
                          checked
                        )
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              label={"Lawful Authority:"}
              value={
                editingResponse?.agreeLawfulAuthority === true ? "YES" : "NO"
              }
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer className={"with-gap align-items-center"}>
                      <div>I/We have read and agree with</div>
                      <Button
                        href="https://mconnect.mentonegirls.vic.edu.au/send.php?id=56898"
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Lawful Authority
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.agreeLawfulAuthority === true}
                      onChange={checked =>
                        updatePermissionResponse(
                          "agreeLawfulAuthority",
                          checked
                        )
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              label={"Privacy Policy:"}
              value={
                editingResponse?.agreePrivacyPolicy === true ? "YES" : "NO"
              }
              valueFromDB={""}
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer className={"with-gap align-items-center"}>
                      <div>I/We have read and agree with</div>
                      <Button
                        href="https://www.mentonegirls.vic.edu.au/uploaded/documents/About/guiding_principals/Privacy_Policy_Jan_2018.pdf"
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Privacy Policy
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      checked={editingResponse?.agreePrivacyPolicy === true}
                      onChange={checked =>
                        updatePermissionResponse(
                          "agreePrivacyPolicy",
                          checked
                        )
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <SectionDiv>
              <div>
                I, {currentUser?.firstName || ''} {currentUser?.lastName},
                A person with lawful authority of {response?.Student?.StudentNameExternal || ''},
              </div>
              <ul>
                <li>Declare that the information in this enrolment form is true and undertake to immediately inform Metone Girls' Grammar School in the event of any change to this information.</li>
                <li>Agree to collect or make arrangements for the collection of <b>{response?.Student?.StudentNameExternal || ''}</b> if she becomes unwell at the School.</li>
                <li>Consent to the educator to seek medical treatment for <b>{response?.Student?.StudentNameExternal || ''}</b> from a registered medical practitioner, hospital or ambulance service and seek transportation of <b>{response?.Student?.StudentNameExternal || ''}</b> by an ambulance service.</li>
                <li>I am responsible for any necessary expenses incurred during a medical emergency in relation to <b>{response?.Student?.StudentNameExternal || ''}</b>.</li>
                <li>Understand that in an emergency situation or fire drill where evacuation is necessary that <b>{response?.Student?.StudentNameExternal || ''}</b> may need to leave Mentone Girls' Grammar School under the direction and supervision of educators.</li>
                <li>Have read and understood the Mentone Girls' Grammar School policies and fees.</li>
              </ul>
              <div className="alert alert-warning">Please note that your signature will not be saved on drafts and you will need to sign on your final submission</div>
              <div>Please sign below in the box:</div>
            </SectionDiv>
          </Col>
        </Row>
        <FlexContainer className={"justify-content-between"}>
          <div />
          <CODAdminDetailsSaveBtnPanel
            onNext={onNextStep}
            syncdLabel={
              isReadOnly !== true
                ? undefined
                : `Details Already Sync'd @ ${moment(
                    editingResponse?.syncToSynAt
                  ).format("lll")} By ${editingResponse?.syncToSynById}`
            }
            editingResponse={{
              ...response,
              // @ts-ignore
              response: {
                ...(response?.response || {}),
                // @ts-ignore
                permissions: editingResponse
              }
            }}
            onCancel={onCancel}
            syncFn={resp =>
              ConfirmationOfDetailsResponseService.update(resp.id, {
                ...resp,
                response: {
                  ...(resp.response || {}),
                  permissions: editingResponse
                }
              })
            }
          />
        </FlexContainer>
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODPermissionsPanel;
