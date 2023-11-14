import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { iCODMedicalResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";
import moment from "moment-timezone";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import FlagSelector from "../../form/FlagSelector";
import { FlexContainer } from "../../../styles";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
import ConfirmationOfDetailsResponseService from "../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import iSynMedicalDetails from "../../../types/Synergetic/Medical/iSynMedicalDetails";
import iSynCommunityConsent from "../../../types/Synergetic/Community/iSynCommunityConsent";
import SynCommunityConsentService from "../../../services/Synergetic/Community/SynCommunityConsentService";
import SynMedicalDetailsService from "../../../services/Synergetic/Medical/SynMedicalDetailsService";
import { SYN_CONSENT_CODE_PARACETAMOL } from "../../../types/Synergetic/Lookup/iSynLuConsentType";
import DateTimePicker from "../../common/DateTimePicker";
import SynLuImmunisationFormStatusSelector from "../../Community/SynLuImmunisationFormStatusSelector";
import SectionDiv from "../../common/SectionDiv";
import CODFileListTable from "../components/CODFileListTable";
import ClientSideFileReader from "../../common/ClientSideFileReader";

const Wrapper = styled.div`
  .file-uploader-desc {
    .btn {
      margin: 0px;
      padding: 0px;
      text-align: left;
      height: auto;
    }
  }
`;
const CODMedicalDetailsPanel = ({
  response,
  isDisabled,
  onSaved,
  onCancel,
  onNextStep
}: ICODDetailsEditPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODMedicalResponse | null>(null);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [
    medicalDetailsFromDB,
    setMedicalDetailsFromDB
  ] = useState<iSynMedicalDetails | null>(null);
  const [
    communityConsentFromDB,
    setCommunityConsentFromDB
  ] = useState<iSynCommunityConsent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    setEditingResponse(response?.response?.medicalDetails || null);
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynMedicalDetailsService.getAll({
        where: JSON.stringify({
          ID: response.StudentID,
          ImmunisationFormFlag: true
        }),
        sort: "ImmunisationFormDate:DESC",
        perPage: 1,
        currentPage: 1
      }),
      SynCommunityConsentService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
          ID: response.StudentID,
          ConsentCode: SYN_CONSENT_CODE_PARACETAMOL
        }),
        perPage: 1,
        currentPage: 1
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const medicalDetails = resp[0].data || [];
        setMedicalDetailsFromDB(
          medicalDetails.length > 0 ? medicalDetails[0] : null
        );
        const communityConsents = resp[1].data || [];
        setCommunityConsentFromDB(
          communityConsents.length > 0 ? communityConsents[0] : null
        );
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

  const updateMedicalResponse = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingResponse({
      ...(editingResponse || {}),
      [fieldName]: newValue
    });
  };

  const getFileContents = () => {
    const eFiles =
      editingResponse?.immunisation?.hasSetOutToAusSchedule === false
        ? editingResponse?.immunisation?.gpLetterFiles || []
        : editingResponse?.immunisation?.historyStatementFiles || [];
    return (
      <Row>
        <Col>
          <SectionDiv >
            {editingResponse?.immunisation?.hasSetOutToAusSchedule === false ? (
              <div className={'file-uploader-desc'}>
                Please provide a letter from the a registered medical
                practitioner stating the child has a medical condition
                preventing them from bing fully vaccinated OR they are on the
                vaccine catch-up schedule.
              </div>
            ) : (
              <div className={'file-uploader-desc'}>
                Please attach the{" "}
                <strong>Immunisation History Statement</strong>
                <small>
                  The statement can be obtained from the{" "}
                  <strong>Australian Childhood Immunisation Register</strong>;
                  <ul>
                    <li>
                      Phone:{" "}
                      <Button
                        variant={"link"}
                        size={"sm"}
                        href="tel:1800 653 809"
                        target="_blank"
                      >
                        1800 653 809
                      </Button>
                    </li>
                    <li>
                      Email:{" "}
                      <Button
                        variant={"link"}
                        size={"sm"}
                        href="mailto:acir@medicareaustralia.gov.au"
                        target="_blank"
                      >
                        acir@medicareaustralia.gov.au
                      </Button>
                    </li>
                    <li>
                      Visit{" "}
                      <Button
                        variant={"link"}
                        size={"sm"}
                        href="http://www.medicareaustralia.gov.au/online"
                        target="_blank"
                      >
                        www.medicareaustralia.gov.au/online
                      </Button>
                    </li>
                    <li>Visit a Medicare service centre</li>
                  </ul>
                </small>
              </div>
            )}
            <CODFileListTable
              files={eFiles}
              isDisabled={isReadOnly === true}
              deletingFn={asset => {
                return new Promise(() =>
                  updateMedicalResponse("immunisation", {
                    ...(editingResponse?.immunisation || {}),
                    [editingResponse?.immunisation?.hasSetOutToAusSchedule ===
                    false
                      ? `gpLetterFiles`
                      : "historyStatementFiles"]: eFiles.filter(
                      file =>
                        !(
                          file.key === asset.key &&
                          file.name === asset.name &&
                          file.url === asset.url
                        )
                    )
                  })
                );
              }}
            />
            {isReadOnly === true ? null : (
              <ClientSideFileReader
                isMulti
                description={
                  <p>
                    <small>Only allow images and pdf files</small>
                  </p>
                }
                onFinished={files =>
                  updateMedicalResponse("immunisation", {
                    ...(editingResponse?.immunisation || {}),
                    [editingResponse?.immunisation?.hasSetOutToAusSchedule ===
                    false
                      ? `gpLetterFiles`
                      : "historyStatementFiles"]: [
                      ...eFiles,
                      ...files.map(file => ({
                        name: file.name,
                        url: file.url,
                        mimeType: file.mimeType,
                        size: file.size
                      }))
                    ]
                  })
                }
              />
            )}
          </SectionDiv>
        </Col>
      </Row>
    );
  };

  const getIsImmunised = () => {
    return (
      editingResponse?.immunisation?.hasSetOutToAusSchedule === true ||
      `${editingResponse?.immunisation?.hasSetOutToAusSchedule || "0"}`
        .trim()
        .toLowerCase() === "1"
    );
  };

  const getImmunisationPanel = () => {
    if (getIsImmunised() !== true) {
      return null;
    }
    return (
      <>
        <Row>
          <Col>
            <CODAdminInputPanel
              label={"Immunisation Form Date:"}
              value={
                `${editingResponse?.immunisation?.ImmunisationFormDate ||
                  ""}`.trim() === ""
                  ? "_BLANK"
                  : moment
                      .tz(
                        `${editingResponse?.immunisation
                          ?.ImmunisationFormDate || ""}`.trim(),
                        moment.tz.guess()
                      )
                      .format("DD MMM YYYY")
              }
              valueFromDB={
                `${medicalDetailsFromDB?.ImmunisationFormDate || ""}`.trim() ===
                ""
                  ? "_BLANK"
                  : moment(
                      `${medicalDetailsFromDB?.ImmunisationFormDate ||
                        ""}`.trim()
                    )
                      .utc()
                      .format("DD MMM YYYY")
              }
              getComponent={isSameFromDB => {
                return (
                  <DateTimePicker
                    isDisabled={isReadOnly === true}
                    className={`form-control ${
                      isSameFromDB === true ? "" : "is-invalid"
                    }`}
                    value={
                      `${editingResponse?.immunisation?.ImmunisationFormDate ||
                        ""}`.trim() === ""
                        ? undefined
                        : moment
                            .tz(
                              `${editingResponse?.immunisation
                                ?.ImmunisationFormDate || ""}`.trim(),
                              moment.tz.guess()
                            )
                            .format("DD MMM YYYY")
                    }
                    timeFormat={false}
                    dateFormat={"DD MMM YYYY"}
                    onChange={selected => {
                      if (typeof selected !== "object") {
                        return;
                      }
                      updateMedicalResponse("immunisation", {
                        ...(editingResponse?.immunisation || {}),
                        // @ts-ignore
                        ImmunisationFormDate: selected.format("YYYY-MM-DD")
                      });
                    }}
                  />
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <CODAdminInputPanel
              label={"Immunisation Form Status:"}
              value={
                `${editingResponse?.immunisation?.ImmunisationFormStatus ||
                  ""}`.trim() === ""
                  ? "_BLANK"
                  : `${editingResponse?.immunisation?.ImmunisationFormStatus ||
                      ""}`.trim()
              }
              valueFromDB={
                `${medicalDetailsFromDB?.ImmunisationFormStatus ||
                  ""}`.trim() === ""
                  ? "_BLANK"
                  : `${medicalDetailsFromDB?.ImmunisationFormStatus ||
                      ""}`.trim()
              }
              getComponent={isSameFromDB => {
                return (
                  <SynLuImmunisationFormStatusSelector
                    className={`form-control ${
                      isSameFromDB === true ? "" : "is-invalid"
                    }`}
                    isDisabled={isReadOnly === true}
                    values={
                      `${editingResponse?.immunisation
                        ?.ImmunisationFormStatus || ""}`.trim() === ""
                        ? []
                        : [
                            `${editingResponse?.immunisation
                              ?.ImmunisationFormStatus || ""}`.trim()
                          ]
                    }
                    onSelect={option => {
                      updateMedicalResponse("immunisation", {
                        ...(editingResponse?.immunisation || {}),
                        // @ts-ignore
                        ImmunisationFormStatus:
                          option === null
                            ? []
                            : Array.isArray(option)
                            ? option.map(opt => `${opt.value}`)
                            : [`${option.value}`]
                      });
                    }}
                  />
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <CODAdminInputPanel
              label={"Immunisation Details:"}
              value={
                `${editingResponse?.immunisation?.ImmunisationOtherDetails ||
                  ""}`.trim() === ""
                  ? "_BLANK"
                  : `${editingResponse?.immunisation
                      ?.ImmunisationOtherDetails || ""}`.trim()
              }
              valueFromDB={
                `${medicalDetailsFromDB?.ImmunisationOtherDetails ||
                  ""}`.trim() === ""
                  ? "_BLANK"
                  : `${medicalDetailsFromDB?.ImmunisationOtherDetails ||
                      ""}`.trim()
              }
              getComponent={isSameFromDB => {
                return (
                  <FormControl
                    disabled={isReadOnly === true}
                    as={"textarea"}
                    isInvalid={isSameFromDB !== true}
                    onChange={event => {
                      updateMedicalResponse("immunisation", {
                        ...(editingResponse?.immunisation || {}),
                        ImmunisationOtherDetails: `${event.target.value ||
                          ""}`.trim()
                      });
                    }}
                  />
                );
              }}
            />
          </Col>
        </Row>
      </>
    );
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        <Col>
          <CODAdminInputPanel
            isRequired
            label={
              "The School provides Ibuprofen medications, Do you give permission for you daughter to be given these under the supervision of the School Nurse?"
            }
            value={
              editingResponse?.allowIbuprofen === true ||
              `${editingResponse?.allowIbuprofen || "no"}`
                .trim()
                .toLowerCase() === "yes"
                ? "YES"
                : "NO"
            }
            valueFromDB={communityConsentFromDB !== null ? "YES" : "NO"}
            getComponent={isSameFromDB => {
              return (
                <FlagSelector
                  value={
                    editingResponse?.allowIbuprofen === true ||
                    `${editingResponse?.allowIbuprofen || "no"}`
                      .trim()
                      .toLowerCase() === "yes"
                  }
                  showAll={false}
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onSelect={option => {
                    updateMedicalResponse(
                      "allowIbuprofen",
                      // @ts-ignore
                      option?.value === true
                    );
                  }}
                />
              );
            }}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <CODAdminInputPanel
            isRequired
            label={
              "Has the child been immunised as set out in the Australian Immunisation Schedule?"
            }
            value={getIsImmunised() ? "YES" : "NO"}
            valueFromDB={communityConsentFromDB !== null ? "YES" : "NO"}
            getComponent={isSameFromDB => {
              return (
                <FlagSelector
                  value={getIsImmunised()}
                  showAll={false}
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onSelect={option => {
                    updateMedicalResponse("immunisation", {
                      ...(editingResponse?.immunisation || {}),
                      // @ts-ignore
                      hasSetOutToAusSchedule: option?.value === true
                    });
                  }}
                />
              );
            }}
          />
        </Col>
      </Row>
      {getImmunisationPanel()}
      {getFileContents()}
      <FlexContainer className={"justify-content-between"}>
        <div />
        <CODAdminDetailsSaveBtnPanel
          onSubmitting={submitting => setIsSubmitting(submitting)}
          isLoading={isLoading || isSubmitting}
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
              medicalDetails: editingResponse
            }
          }}
          onSaved={resp => {
            Toaster.showToast(`Details Sync'd.`, TOAST_TYPE_SUCCESS);
            onSaved && onSaved(resp);
          }}
          onCancel={onCancel}
          syncFn={resp =>
            ConfirmationOfDetailsResponseService.update(resp.id, {
              ...resp,
              response: {
                ...(resp.response || {}),
                student: {
                  ...(editingResponse || {}),
                  syncToSynAt: moment().toISOString(),
                  syncToSynById: currentUser?.synergyId
                }
              }
            })
          }
        />
      </FlexContainer>
    </Wrapper>
  );
};

export default CODMedicalDetailsPanel;
