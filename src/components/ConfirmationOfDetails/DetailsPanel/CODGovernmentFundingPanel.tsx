import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  iCODGovernmentFundingParentResponse,
  iCODGovernmentFundingResponse,
  iCODStudentResponse
} from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
import { Button, Col, Row } from "react-bootstrap";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import Toaster from "../../../services/Toaster";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import SynLuLanguageSelector from "../../Community/SynLuLanguageSelector";
import SectionDiv from "../../common/SectionDiv";
import YearLevelSelector from "../../student/YearLevelSelector";
import SynLuQualificationLevelSelector from "../../Community/SynLuQualificationLevelSelector";
import SynLuOccupationPositionSelector from "../../Community/SynLuOccupationPositionSelector";

const Wrapper = styled.div``;
type iCommunityMap = { [key: number | string]: iSynCommunity };
const CODGovernmentFundingPanel = ({
  response,
  isDisabled,
  getCancelBtn,
  getSubmitBtn,
  responseFieldName,
}: ICODDetailsEditPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODGovernmentFundingResponse | null>(null);
  const [
    studentResponse,
    setStudentResponse
  ] = useState<iCODStudentResponse | null>(null);
  const [communityMap, setCommunityMap] = useState<iCommunityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const studentResp = response?.response?.student || null;
    const res = response?.response || {};
    // @ts-ignore
    const govResp = responseFieldName in res ? res[responseFieldName] : null;

    setEditingResponse(govResp);
    setStudentResponse(studentResp);
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({
          ID: [
            response.StudentID,
            `${govResp?.parent1?.ID}`.trim(),
            `${govResp?.parent2?.ID}`.trim()
          ].filter(id => `${id || ""}`.trim() !== "")
        })
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const communityProfiles = resp[0].data || [];
        setCommunityMap(
          communityProfiles.reduce((map, communityProfile) => {
            return {
              ...map,
              [communityProfile.ID]: communityProfile
            };
          }, {})
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

  const updateParentResponse = (
    fieldName: string,
    newValue: string,
    key: string
  ) => {
    const resp = editingResponse || {};
    // @ts-ignore
    const parentResponse: iCODGovernmentFundingParentResponse = resp[key];
    // @ts-ignore
    setEditingResponse({
      ...resp,
      [key]: {
        ...parentResponse,
        [fieldName]: newValue
      }
    });
  };

  const getParentDiv = (key: string) => {
    const resp = editingResponse || {};
    if (!(key in resp)) {
      return null;
    }

    // @ts-ignore
    const parentResponse: iCODGovernmentFundingParentResponse = resp[key];
    const parentFromDB =
      (parentResponse.ID || "") in communityMap
        ? communityMap[parentResponse.ID]
        : null;

    return (
      <Col key={key}>
        <SectionDiv>
          <div>
            <b>
              {parentResponse.full_name} [{parentResponse.relationship}]
            </b>
          </div>
          <CODAdminInputPanel
            label={"Home Language:"}
            value={`${parentResponse?.homeLanguageCode || ""}`.trim()}
            valueFromDB={`${parentFromDB?.HomeLanguageCode || ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <SynLuLanguageSelector
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  isDisabled={isReadOnly === true}
                  values={
                    `${parentResponse?.homeLanguageCode || ""}`.trim() === ""
                      ? []
                      : [`${parentResponse?.homeLanguageCode || ""}`.trim()]
                  }
                  onSelect={option => {
                    updateParentResponse(
                      "homeLanguageCode",
                      option === null
                        ? ""
                        : Array.isArray(option)
                        ? `${option[0].value}`
                        : `${option.value}`,
                      key
                    );
                  }}
                />
              );
            }}
          />

          <CODAdminInputPanel
            label={"Highest Secondary Education:"}
            value={`${parentResponse?.secondary || ""}`.trim()}
            valueFromDB={`${parentFromDB?.HighestSecondaryYearLevel ||
              ""}`.trim()}
            hint={
              <small>
                (For who have never attended school, select 'Year 9 or
                equivalent or below').
              </small>
            }
            getComponent={isSameFromDB => {
              return (
                <YearLevelSelector
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  limitCodes={["12", "11", "10", "9"]}
                  isDisabled={isReadOnly === true}
                  values={
                    `${parentResponse?.secondary || ""}`.trim() === ""
                      ? []
                      : [`${parentResponse?.secondary || ""}`.trim()]
                  }
                  onSelect={option => {
                    updateParentResponse(
                      "secondary",
                      option === null
                        ? ""
                        : Array.isArray(option)
                        ? `${option[0].value}`
                        : `${option.value}`,
                      key
                    );
                  }}
                />
              );
            }}
          />

          <CODAdminInputPanel
            label={"Highest Tertiary Education:"}
            value={`${parentResponse?.tertiary || ""}`.trim()}
            valueFromDB={`${parentFromDB?.HighestQualificationLevel ||
              ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <SynLuQualificationLevelSelector
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  isDisabled={isReadOnly === true}
                  values={
                    `${parentResponse?.tertiary || ""}`.trim() === ""
                      ? []
                      : [`${parentResponse?.tertiary || ""}`.trim()]
                  }
                  onSelect={option => {
                    updateParentResponse(
                      "tertiary",
                      option === null
                        ? ""
                        : Array.isArray(option)
                        ? `${option[0].value}`
                        : `${option.value}`,
                      key
                    );
                  }}
                />
              );
            }}
          />

          <CODAdminInputPanel
            label={"Occupation Group:"}
            value={`${parentResponse?.occupationGroup || ""}`.trim()}
            valueFromDB={`${parentFromDB?.OccupPositionCode || ""}`.trim()}
            hint={
              <>
                <small>
                  <div>Occupation Group Instructions:</div>
                  <div>
                    Please click on the
                    <Button
                      size={"sm"}
                      variant={"link"}
                      href="https://mconnect.mentonegirls.vic.edu.au/send.php?id=50393"
                      target="_blank"
                    >
                      occupation list
                    </Button>
                    to determine to which group you belong.
                  </div>
                  <div>
                    <ul>
                      <li>
                        If the person is not currently in <u>paid</u> work but
                        has had a job in the last 12 months or has retired in
                        the last 12 months, please use the person's last
                        occupation.
                      </li>
                      <li>
                        If the person has not been in <u>paid</u> work in the
                        last 12 months, please contact the School.
                      </li>
                    </ul>
                  </div>
                </small>
              </>
            }
            getComponent={isSameFromDB => {
              return (
                <SynLuOccupationPositionSelector
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  isDisabled={isReadOnly === true}
                  values={
                    `${parentResponse?.occupationGroup || ""}`.trim() === ""
                      ? []
                      : [`${parentResponse?.occupationGroup || ""}`.trim()]
                  }
                  onSelect={option => {
                    updateParentResponse(
                      "occupationGroup",
                      option === null
                        ? ""
                        : Array.isArray(option)
                        ? `${option[0].value}`
                        : `${option.value}`,
                      key
                    );
                  }}
                />
              );
            }}
          />
        </SectionDiv>
      </Col>
    );
  };

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }
    const studentFromDB =
      response.StudentID in communityMap
        ? communityMap[response.StudentID]
        : null;
    return (
      <>
        <Row>
          <Col>
            <CODAdminInputPanel
              label={"Student Home Language:"}
              value={`${studentResponse?.HomeLanguageCode || ""}`.trim()}
              valueFromDB={`${studentFromDB?.HomeLanguageCode || ""}`.trim()}
              getComponent={isSameFromDB => {
                return (
                  <SynLuLanguageSelector
                    className={`form-control ${
                      isSameFromDB === true ? "" : "is-invalid"
                    }`}
                    isDisabled={isReadOnly === true}
                    values={
                      `${studentResponse?.HomeLanguageCode || ""}`.trim() === ""
                        ? []
                        : [`${studentResponse?.HomeLanguageCode || ""}`.trim()]
                    }
                    onSelect={option => {
                      setStudentResponse({
                        ...(studentResponse || {}),
                        // @ts-ignore
                        HomeLanguageCode:
                          option === null
                            ? null
                            : Array.isArray(option)
                            ? `${option[0].value}`
                            : `${option.value}`
                      });
                    }}
                  />
                );
              }}
            />
          </Col>
        </Row>
        <Row>{["parent1", "parent2"].map(key => getParentDiv(key))}</Row>
        {isReadOnly === true ? null : (
          <CODAdminDetailsSaveBtnPanel
            getSubmitBtn={getSubmitBtn}
            getCancelBtn={getCancelBtn}
            isLoading={isLoading}
            responseFieldName={responseFieldName}
            editingResponse={{
              ...response,
              // @ts-ignore
              response: {
                ...(response?.response || {}),
                // @ts-ignore
                [responseFieldName]: editingResponse,
                // @ts-ignore
                student: studentResponse
              }
            }}
          />
        )}
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODGovernmentFundingPanel;
