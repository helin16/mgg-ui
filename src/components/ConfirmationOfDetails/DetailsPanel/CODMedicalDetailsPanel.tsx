import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { iCODMedicalResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import moment from "moment-timezone";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import FlagSelector from "../../form/FlagSelector";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
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
import FormErrorDisplay, { iErrorMap } from "../../form/FormErrorDisplay";

const Wrapper = styled.div`
  .file-uploader-desc {
    .btn {
      margin: 0px;
      padding: 0px;
      text-align: left;
      height: auto;
      font-size: 11px;
    }

    ul {
      margin-bottom: 0px;
    }
  }
`;
const CODMedicalDetailsPanel = ({
  response,
  isDisabled,
  responseFieldName,
  getCancelBtn,
  getSubmitBtn,
  isForParent
}: ICODDetailsEditPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODMedicalResponse | null>(null);
  const [
    medicalDetailsFromDB,
    setMedicalDetailsFromDB
  ] = useState<iSynMedicalDetails | null>(null);
  const [
    communityConsentFromDB,
    setCommunityConsentFromDB
  ] = useState<iSynCommunityConsent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});

  useEffect(() => {
    const studentId = 41198; //response.StudentID,
    const res = response?.response || {};
    // @ts-ignore
    const resp = responseFieldName in res ? res[responseFieldName] : {};

    const setEditingResponseForParentForm = (
      med?: iSynMedicalDetails | null,
      comConsent?: iSynCommunityConsent | null
    ) => {
      if (isForParent !== true || Object.keys(resp).length > 0) {
        return;
      }
      setEditingResponse({
        allowIbuprofen: comConsent !== null && comConsent !== undefined,
        immunisation: {
          hasSetOutToAusSchedule: med?.ImmunisationFormFlag === true,
          ImmunisationFormDate:
            `${med?.ImmunisationFormDate || ""}`.trim() === ""
              ? ""
              : moment(`${med?.ImmunisationFormDate || ""}`.trim())
                  .utc()
                  .format("YYYY-MM-DD"),
          ImmunisationFormStatus: `${med?.ImmunisationFormStatus || ""}`.trim(),
          ImmunisationOtherDetails: `${med?.ImmunisationOtherDetails ||
            ""}`.trim(),
          historyStatementFiles: [],
          gpLetterFiles: []
        }
      });
      return;
    };

    setEditingResponse(resp);
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynMedicalDetailsService.getAll({
        where: JSON.stringify({
          ID: studentId,
          ImmunisationFormFlag: true
        }),
        sort: "ImmunisationFormDate:DESC",
        perPage: 1,
        currentPage: 1
      }),
      SynCommunityConsentService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
          ID: studentId,
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
        const medicalDetailArr = resp[0].data || [];
        const medicalDetails =
          medicalDetailArr.length > 0 ? medicalDetailArr[0] : null;
        const communityConsents = resp[1].data || [];
        const communityConsent =
          communityConsents.length > 0 ? communityConsents[0] : null;

        setMedicalDetailsFromDB(medicalDetails);
        setCommunityConsentFromDB(communityConsent);
        setEditingResponseForParentForm(medicalDetails, communityConsent);
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
  }, [response, isForParent, responseFieldName]);

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
          <SectionDiv>
            {editingResponse?.immunisation?.hasSetOutToAusSchedule === false ? (
              <div className={"file-uploader-desc"}>
                Please provide a letter from the a registered medical
                practitioner stating the child has a medical condition
                preventing them from bing fully vaccinated OR they are on the
                vaccine catch-up schedule.
              </div>
            ) : (
              <div className={"file-uploader-desc"}>
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
              title={
                editingResponse?.immunisation?.hasSetOutToAusSchedule === false
                  ? "GP Letter(s)"
                  : "Immunisation History Statement(s)"
              }
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
              <>
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
                <FormErrorDisplay
                  errorsMap={errorMap}
                  fieldName={
                    editingResponse?.immunisation?.hasSetOutToAusSchedule ===
                    false
                      ? `gpLetterFiles`
                      : "historyStatementFiles"
                  }
                />
              </>
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
        <Col md={3} sm={12}>
          <CODAdminInputPanel
            label={"Immunisation Form Date:"}
            isRequired
            errMsg={
              "ImmunisationFormDate" in errorMap
                ? errorMap["ImmunisationFormDate"]
                : null
            }
            value={
              `${editingResponse?.immunisation?.ImmunisationFormDate ||
                ""}`.trim() === ""
                ? ""
                : moment
                    .tz(
                      `${editingResponse?.immunisation?.ImmunisationFormDate ||
                        ""}`.trim(),
                      moment.tz.guess()
                    )
                    .format("DD MMM YYYY")
            }
            valueFromDB={
              `${medicalDetailsFromDB?.ImmunisationFormDate || ""}`.trim() ===
              ""
                ? ""
                : moment(
                    `${medicalDetailsFromDB?.ImmunisationFormDate || ""}`.trim()
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
        <Col md={3} sm={12}>
          <CODAdminInputPanel
            label={"Immunisation Form Status:"}
            isRequired
            errMsg={
              "ImmunisationFormStatus" in errorMap
                ? errorMap["ImmunisationFormStatus"]
                : null
            }
            value={`${editingResponse?.immunisation?.ImmunisationFormStatus ||
              ""}`.trim()}
            valueFromDB={`${medicalDetailsFromDB?.ImmunisationFormStatus ||
              ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <SynLuImmunisationFormStatusSelector
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  isDisabled={isReadOnly === true}
                  values={
                    `${editingResponse?.immunisation?.ImmunisationFormStatus ||
                      ""}`.trim() === ""
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
        <Col md={12}>
          <CODAdminInputPanel
            label={"Immunisation Details:"}
            value={`${editingResponse?.immunisation?.ImmunisationOtherDetails ||
              ""}`.trim()}
            valueFromDB={`${medicalDetailsFromDB?.ImmunisationOtherDetails ||
              ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <FormControl
                  disabled={isReadOnly === true}
                  rows={3}
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
      </>
    );
  };

  const preSubmit = () => {
    const errors: iErrorMap = {};

    if (getIsImmunised() === true) {
      if (
        `${editingResponse?.immunisation?.ImmunisationFormDate ||
          ""}`.trim() === ""
      ) {
        errors.ImmunisationFormDate = "Immunisation Form Date is required";
      }
      if (
        `${editingResponse?.immunisation?.ImmunisationFormStatus ||
          ""}`.trim() === ""
      ) {
        errors.ImmunisationFormStatus = "Immunisation Form Status is required";
      }
      // if (
      //   (editingResponse?.immunisation?.historyStatementFiles || []).length <= 0
      // ) {
      //   errors.historyStatementFiles =
      //     "Immunisation History Statement File(s) is required";
      // }
    }
    // else {
    //   if ((editingResponse?.immunisation?.gpLetterFiles || []).length <= 0) {
    //     errors.gpLetterFiles = "GP Letter File(s) is required";
    //   }
    // }

    setErrorMap(errors);
    const hasPassed = Object.keys(errors).length <= 0;
    if (hasPassed !== true) {
      Toaster.showToast(
        "Some errors in the form, please correct them before you move to the next step.",
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
              errMsg={
                "allowIbuprofen" in errorMap ? errorMap["allowIbuprofen"] : null
              }
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
        <Row>
          <Col>
            <CODAdminInputPanel
              isRequired
              label={
                "Has the child been immunised as set out in the Australian Immunisation Schedule?"
              }
              value={getIsImmunised() ? "YES" : "NO"}
              valueFromDB={
                medicalDetailsFromDB?.ImmunisationFormFlag === true
                  ? "YES"
                  : "NO"
              }
              errMsg={
                "ImmunisationFormFlag" in errorMap
                  ? errorMap["ImmunisationFormFlag"]
                  : null
              }
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
          {getImmunisationPanel()}
        </Row>
        {getFileContents()}
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
          getSubmitBtn={(res, fName) =>
            getSubmitBtn &&
            getSubmitBtn(res, responseFieldName, isLoading, preSubmit)
          }
        />
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODMedicalDetailsPanel;
