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
import { Alert, Button, Col, Row } from "react-bootstrap";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import ToggleBtn from "../../common/ToggleBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import SectionDiv from "../../common/SectionDiv";
import SignaturePad, { iSignatureCanvas } from "../../common/SignaturePad";
import SynCommunityLegalService from "../../../services/Synergetic/Community/SynCommunityLegalService";
import iSynCommunityLegal from "../../../types/Synergetic/Community/iSynCommunityLegal";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import SynStudentStaticService from "../../../services/Synergetic/Student/SynStudentStaticService";
import iSynStudentStatics from "../../../types/Synergetic/Student/iSynStudentStatics";
import SynStudentYearService from "../../../services/Synergetic/Student/SynStudentYearService";
import iSynStudentYear from "../../../types/Synergetic/Student/iSynStudentYear";
import { SYN_LU_LEARNING_PATHWAY_IB } from "../../../types/Synergetic/Lookup/iSynLuLearningPathway";

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

type iCommunityMap = { [key: number | string]: iSynCommunity };
const CODPermissionsPanel = ({
  response,
  isDisabled,
  isForParent,
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
  const [
    signatureCanvas,
    setSignatureCanvas
  ] = useState<iSignatureCanvas | null>(null);
  const [
    communityLegalFromDB,
    setCommunityLegalFromDB
  ] = useState<iSynCommunityLegal | null>(null);
  const [
    studentStaticFromDB,
    setStudentStaticFromDB
  ] = useState<iSynStudentStatics | null>(null);
  const [
    studentYearFromDB,
    setStudentYearFromDB
  ] = useState<iSynStudentYear | null>(null);
  const [parentCommunityMapFromDB, setPrentCommunityMapFromDB] = useState<
    iCommunityMap
  >({});

  useEffect(() => {
    setEditingResponse(response?.response?.permissions || null);
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynCommunityLegalService.getAll({
        where: JSON.stringify({ ID: response.StudentID }),
        perPage: 1,
        sort: "ModifiedDate:DESC"
      }),
      SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({
          ID: [currentUser?.synergyId, currentUser?.SynCommunity?.SpouseID]
        })
      }),
      SynStudentStaticService.getAll({
        where: JSON.stringify({
          ID: response.StudentID
        }),
        perPage: 1
      }),
      SynStudentYearService.getAll({
        where: JSON.stringify({
          ID: response.StudentID
        }),
        perPage: 1
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const communityLegals = resp[0].data || [];
        setCommunityLegalFromDB(
          communityLegals.length <= 0 ? null : communityLegals[0]
        );

        const parents = resp[1].data || [];
        setPrentCommunityMapFromDB(
          parents.reduce(
            (map, parent) => ({
              ...map,
              [parent.ID]: parent
            }),
            {}
          )
        );

        const studentStatics = resp[2].data || [];
        setStudentStaticFromDB(
          studentStatics.length > 0 ? studentStatics[0] : null
        );

        const studentYears = resp[3].data || [];
        setStudentYearFromDB(studentYears.length > 0 ? studentYears[0] : null);
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
  }, [response, currentUser]);

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

  const getWarningPanel = () => {
    if (studentYearFromDB) {
      return null;
    }
    return (
      <Alert variant={"warning"}>
        Can't find any records in the StudentYears table, this student may not
        be current yet. <b>PLEASE MANUALLY UPDATE HER RECORD</b> in Synergetic after Sync.
      </Alert>
    );
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
              valueFromDB={
                !studentStaticFromDB
                  ? undefined
                  : studentYearFromDB?.IBFlag === true &&
                    studentYearFromDB?.LearningPathway ===
                      SYN_LU_LEARNING_PATHWAY_IB
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={`with-gap align-items-center ${
                        isSameFromDB !== true ? "text-danger" : ""
                      }`}
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
                      size={"sm"}
                      checked={editingResponse?.excursionChecked === true}
                      onChange={checked =>
                        updatePermissionResponse("excursionChecked", checked)
                      }
                    />
                  </FlexContainer>
                );
              }}
            />
            {getWarningPanel()}

            <hr />
            <CODAdminInputPanel
              label={"Parents' Association:"}
              value={
                editingResponse?.allowParentAssociation === true ? "YES" : "NO"
              }
              valueFromDB={
                Object.values(parentCommunityMapFromDB).filter(
                  community => community.DirectoryIncludeFlag !== true
                ).length <= 0
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={`with-gap lg-gap align-items-center`}
                  >
                    <div className={isSameFromDB !== true ? "text-danger" : ""}>
                      I/We agree to share my/our contact details with Mentone
                      Girls' Grammar Parents' Association
                    </div>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      size={"sm"}
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
              valueFromDB={
                studentStaticFromDB?.TertiaryAchievedFlag === true
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={`with-gap lg-gap align-items-center`}
                  >
                    <div className={isSameFromDB !== true ? "text-danger" : ""}>
                      To Manage student attendance and/or in the event of an
                      emergency (eg. fires, critical incidents), I/We agree to
                      the School using my mobile phone number to broadcast SMS
                      messages.
                    </div>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      size={"sm"}
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
              value={
                editingResponse?.agreeParentConsent === true ? "YES" : "NO"
              }
              valueFromDB={
                communityLegalFromDB?.PhotoPromFlag === true &&
                communityLegalFromDB?.PhotoPublicationFlag === true &&
                communityLegalFromDB?.PhotoWebFlag === true
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={`with-gap align-items-center ${
                        isSameFromDB !== true ? "text-danger" : ""
                      }`}
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
                      <div>and agree to give my / our consent.</div>
                    </FlexContainer>
                    <ToggleBtn
                      isDisabled={isReadOnly === true}
                      on={"Yes"}
                      off={"No"}
                      size={"sm"}
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
              valueFromDB={
                studentStaticFromDB?.EnrolmentContractFlag === true
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={`with-gap align-items-center ${
                        isSameFromDB !== true ? "text-danger" : ""
                      }`}
                    >
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
                      size={"sm"}
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
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={`with-gap align-items-center ${
                        isSameFromDB !== true ? "text-danger" : ""
                      }`}
                    >
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
                      size={"sm"}
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
              valueFromDB={
                communityLegalFromDB?.PrivacyPolicyAgreedFlag === true
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlexContainer
                    className={"with-gap lg-gap align-items-center"}
                  >
                    <FlexContainer
                      className={`with-gap align-items-center ${
                        isSameFromDB !== true ? "text-danger" : ""
                      }`}
                    >
                      <div>I / We have read and agree with</div>
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
                      size={"sm"}
                      checked={editingResponse?.agreePrivacyPolicy === true}
                      onChange={checked =>
                        updatePermissionResponse("agreePrivacyPolicy", checked)
                      }
                    />
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <SectionDiv>
              <div>
                I,{" "}
                <b>
                  {currentUser?.firstName || ""} {currentUser?.lastName}
                </b>
                , A person with lawful authority of{" "}
                <b>{response?.Student?.StudentNameExternal || ""}</b>,
              </div>
              <ul>
                <li>
                  Declare that the information in this enrolment form is true
                  and undertake to immediately inform Metone Girls' Grammar
                  School in the event of any change to this information.
                </li>
                <li>
                  Agree to collect or make arrangements for the collection of{" "}
                  <b>{response?.Student?.StudentNameExternal || ""}</b> if she
                  becomes unwell at the School.
                </li>
                <li>
                  Consent to the educator to seek medical treatment for{" "}
                  <b>{response?.Student?.StudentNameExternal || ""}</b> from a
                  registered medical practitioner, hospital or ambulance service
                  and seek transportation of{" "}
                  <b>{response?.Student?.StudentNameExternal || ""}</b> by an
                  ambulance service.
                </li>
                <li>
                  I am responsible for any necessary expenses incurred during a
                  medical emergency in relation to{" "}
                  <b>{response?.Student?.StudentNameExternal || ""}</b>.
                </li>
                <li>
                  Understand that in an emergency situation or fire drill where
                  evacuation is necessary that{" "}
                  <b>{response?.Student?.StudentNameExternal || ""}</b> may need
                  to leave Mentone Girls' Grammar School under the direction and
                  supervision of educators.
                </li>
                <li>
                  Have read and understood the Mentone Girls' Grammar School
                  policies and fees.
                </li>
              </ul>
              <div className="alert alert-warning">
                Please note that your signature will not be saved on drafts and
                you will need to sign on your final submission
              </div>
              <div>Please sign below in the box:</div>
              <SignaturePad
                isDisabled={isReadOnly === true || isForParent !== true}
                className={"signature"}
                setCanvas={canvas => setSignatureCanvas(canvas)}
                signature={editingResponse?.signature || ""}
                onClear={() => {
                  updatePermissionResponse("signature", undefined);
                }}
              />
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
                permissions: {
                  ...editingResponse,
                  ...(signatureCanvas ? {signature: signatureCanvas.toDataURL()} : {}),
                }
              }
            }}
            onCancel={onCancel}
            syncFn={resp =>
              ConfirmationOfDetailsResponseService.update(resp.id, {
                ...resp,
                response: {
                  ...(resp.response || {}),
                  permissions: {
                    ...editingResponse,
                    ...(signatureCanvas ? {signature: signatureCanvas.toDataURL()} : {}),
                  }
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
