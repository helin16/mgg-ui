import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { iCODPermissionsResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import { FlexContainer } from "../../../styles";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
import Toaster, {TOAST_TYPE_ERROR} from "../../../services/Toaster";
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
import FormErrorDisplay, {iErrorMap} from '../../form/FormErrorDisplay';
import {mainRed} from '../../../AppWrapper';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import {MGGS_MODULE_ID_COD} from '../../../types/modules/iModuleUser';

const Wrapper = styled.div`
  .input-div {
    .btn.btn-link {
      margin: 0px;
      text-align: left;
      padding: 0px;
      text-decoration: underline !important;
    }
  }
  
  .invalid-tooltip {
    display: block;
    * {
      color: white !important;
    }
  }
  
  .signature {
    &.has-error {
      canvas {
        border: 2px ${mainRed} solid;
      }
    }
  }
`;

type iCommunityMap = { [key: number | string]: iSynCommunity };
type iUrlMap = { [key: string]: string };
const CODPermissionsPanel = ({
  response,
  isDisabled,
  isForParent,
  getCancelBtn,
  getSubmitBtn,
  responseFieldName
}: ICODDetailsEditPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODPermissionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const [urlMap, setUrlMap] = useState<iUrlMap>({});
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
    const res = response?.response || {};
    // @ts-ignore
    const existingResp = responseFieldName in res ? res[responseFieldName] : {};
    setEditingResponse({
      ...existingResp,
      // force the default value,
      //...(existingResp.agreeSchoolCommitment === undefined ? {agreeSchoolCommitment: true} : {}),
    });
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
      }),
      MggsModuleService.getModule(MGGS_MODULE_ID_COD),
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

        const urls = resp[4].settings?.permissionUrls || {};
        setUrlMap(urls);
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
  }, [response, currentUser, responseFieldName]);

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
        be current yet. <b>PLEASE MANUALLY UPDATE HER RECORD</b> in Synergetic
        after Sync.
      </Alert>
    );
  };

  const getToggleBtn = (onChange: (checked: boolean) => void, value?: boolean) => {
    if (value === undefined) {
      return <Button className={'check-box-no-value-yet'} variant={'outline-secondary'} size={'sm'} onClick={() => onChange(true)}>click here provide your answer</Button>
    }
    return (
      <ToggleBtn
        isDisabled={isReadOnly === true}
        on={"Yes"}
        off={"No"}
        size={"sm"}
        checked={value === true}
        onChange={onChange}
      />
    )
  }

  const preSubmit = (submittingData?: iCODPermissionsResponse) => {
    const errors: iErrorMap = {};

    if (`${submittingData?.excursionChecked || ''}`.trim() === '') {
      errors.excursionChecked = 'Excursion permission: answer is required.';
    }
    if (`${submittingData?.allowParentAssociation || ''}`.trim() === '') {
      errors.allowParentAssociation = `Parents' Association: answer is required.`;
    }
    if (`${submittingData?.allowReceivingSMS || ''}`.trim() === '') {
      errors.allowReceivingSMS = `Greet to receive SMS: answer is required.`;
    }
    if (`${submittingData?.agreeParentConsent || ''}`.trim() === '') {
      errors.agreeParentConsent = `Parent Consent: answer is required.`;
    }
    if (submittingData?.agreeSchoolCommitment !== true) {
      errors.agreeSchoolCommitment = `Need to read and agree to our School Commitment.`;
    }
    if (submittingData?.agreeLawfulAuthority !== true) {
      errors.agreeLawfulAuthority = `Need to read and agree to our Lawful Authority.`;
    }
    if (submittingData?.agreePrivacyPolicy !== true) {
      errors.agreePrivacyPolicy = `Need to read and agree to our Privacy Policy.`;
    }
    if (`${submittingData?.signature || ''}`.trim() === '') {
      errors.signature = `Signature is required.`;
    }

    setErrorMap(errors);
    const hasPassed = Object.keys(errors).length <= 0;
    if (hasPassed !== true) {
      Toaster.showToast(
        "Some errors in the form, please correct them before submit.",
        TOAST_TYPE_ERROR
      );
    }
    return hasPassed;
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
              isRequired
              value={editingResponse?.excursionChecked === true ? "YES" : "NO"}
              errMsg={'excursionChecked' in errorMap ? errorMap['excursionChecked'] : null}
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
                        (isSameFromDB !== true || 'excursionChecked' in errorMap) ? "text-danger" : ""
                      }`}
                    >
                      <div>I/We have read and agree with</div>
                      <Button
                        target="_blank"
                        href={urlMap.excursion || ''}
                        size={"sm"}
                        variant={"link"}
                      >
                        Excursion Permission
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    {getToggleBtn(checked =>
                        updatePermissionResponse("excursionChecked", checked),
                        editingResponse?.excursionChecked
                    )}
                  </FlexContainer>
                );
              }}
            />
            {getWarningPanel()}

            <hr />
            <CODAdminInputPanel
              isRequired
              label={"Parents' Association:"}
              errMsg={'allowParentAssociation' in errorMap ? errorMap['allowParentAssociation'] : null}
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
                    <div className={(isSameFromDB !== true || 'allowParentAssociation' in errorMap) ? "text-danger" : ""}>
                      I/We agree to share my/our contact details with Mentone
                      Girls' Grammar Parents' Association
                    </div>
                    {getToggleBtn(checked =>
                        updatePermissionResponse("allowParentAssociation", checked),
                      editingResponse?.allowParentAssociation
                    )}
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
              isRequired
              errMsg={'allowReceivingSMS' in errorMap ? errorMap['allowReceivingSMS'] : null}
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
                    {getToggleBtn(checked =>
                        updatePermissionResponse("allowReceivingSMS", checked),
                      editingResponse?.allowReceivingSMS
                    )}
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              isRequired
              errMsg={'agreeParentConsent' in errorMap ? errorMap['agreeParentConsent'] : null}
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
                        href={urlMap.imageConsent || ''}
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Parental Consent for Use of Images
                      </Button>
                      <div>and agree to give my / our consent.</div>
                    </FlexContainer>
                    {getToggleBtn(checked =>
                        updatePermissionResponse("agreeParentConsent", checked),
                      editingResponse?.agreeParentConsent
                    )}
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              isRequired
              errMsg={'agreeSchoolCommitment' in errorMap ? errorMap['agreeSchoolCommitment'] : null}
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
                        href={urlMap.schoolCommitment || ''}
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Commitment to Mentone Girls' Grammar School
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    {getToggleBtn(checked =>
                        updatePermissionResponse("agreeSchoolCommitment", checked),
                      editingResponse?.agreeSchoolCommitment
                    )}
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              isRequired
              errMsg={'agreeLawfulAuthority' in errorMap ? errorMap['agreeLawfulAuthority'] : null}
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
                        href={urlMap.lawfulAuthority || ''}
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Lawful Authority
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    {getToggleBtn(checked =>
                        updatePermissionResponse("agreeLawfulAuthority", checked),
                      editingResponse?.agreeLawfulAuthority
                    )}
                  </FlexContainer>
                );
              }}
            />

            <hr />
            <CODAdminInputPanel
              isRequired
              errMsg={'agreePrivacyPolicy' in errorMap ? errorMap['agreePrivacyPolicy'] : null}
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
                        href={urlMap.privacyPolicy || ''}
                        target="_blank"
                        variant={"link"}
                        size={"sm"}
                      >
                        Privacy Policy
                      </Button>
                      <div>.</div>
                    </FlexContainer>
                    {getToggleBtn(checked =>
                        updatePermissionResponse("agreePrivacyPolicy", checked),
                      editingResponse?.agreePrivacyPolicy
                    )}
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
                , a person with lawful authority of{" "}
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
                className={`signature ${'signature' in errorMap ? 'has-error' : ''}`}
                setCanvas={canvas => setSignatureCanvas(canvas)}
                signature={editingResponse?.signature || ""}
                onClear={() => {
                  updatePermissionResponse("signature", undefined);
                }}
              />
              <div style={{position: 'relative'}}>
                <FormErrorDisplay errorsMap={errorMap} fieldName={'signature'} className={'invalid-tooltip'}/>
              </div>
            </SectionDiv>
          </Col>
        </Row>
        <CODAdminDetailsSaveBtnPanel
          isLoading={isLoading}
          responseFieldName={responseFieldName}
          editingResponse={{
            ...response,
            // @ts-ignore
            response: {
              ...(response?.response || {}),
              // @ts-ignore
              [responseFieldName]: editingResponse
            }
          }}
          getCancelBtn={getCancelBtn}
          getSubmitBtn={(res) =>
            getSubmitBtn &&
            getSubmitBtn({
              ...response,
              // @ts-ignore
              response: {
                ...(response?.response || {}),
                // @ts-ignore
                [responseFieldName]: {
                  ...editingResponse,
                  signature: (signatureCanvas?.isEmpty() !== true ? signatureCanvas?.toDataURL() : undefined),
                }
              }
            }, responseFieldName, isLoading, preSubmit)
          }
        />
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODPermissionsPanel;
