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
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import SynLuLanguageSelector from "../../Community/SynLuLanguageSelector";
import SectionDiv from "../../common/SectionDiv";
import YearLevelSelector from "../../student/YearLevelSelector";
import SynLuQualificationLevelSelector from "../../Community/SynLuQualificationLevelSelector";
import SynLuOccupationPositionSelector from "../../Community/SynLuOccupationPositionSelector";
import { iErrorMap } from "../../form/FormErrorDisplay";
import SynVStudentContactsCurrentPastFutureCombinedService from "../../../services/Synergetic/Student/SynVStudentContactsCurrentPastFutureCombinedService";
import { STUDENT_CONTACT_TYPE_SC1 } from "../../../types/Synergetic/Student/iStudentContact";
import MathHelper from '../../../helper/MathHelper';
import SynRelationshipService from '../../../services/Synergetic/Community/SynRelationshipService';
import iSynRelationship from '../../../types/Synergetic/Community/iSynRelationship';

const Wrapper = styled.div``;
type iCommunityMap = { [key: number | string]: iSynCommunity };
type iRelationshipMap = { [key: number | string]: iSynRelationship };
const CODGovernmentFundingPanel = ({
  response,
  isDisabled,
  getCancelBtn,
  getSubmitBtn,
  responseFieldName,
  isForParent
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
  const [errorMap, setErrorMap] = useState<iErrorMap>({});

  useEffect(() => {
    const studentId = response?.StudentID;
    const studentResp = response?.response?.student || null;
    const res = response?.response || {};
    // @ts-ignore
    const govResp = responseFieldName in res ? res[responseFieldName] : {};

    setEditingResponse(govResp);
    setStudentResponse(studentResp);

    const getParentIds = async () => {
      if (isForParent === true) {
        const results =
          (
            await SynVStudentContactsCurrentPastFutureCombinedService.getAll({
              where: JSON.stringify({
                StudentID: studentId,
                ContactType: STUDENT_CONTACT_TYPE_SC1
              }),
              sort: "FileYear:DESC",
              perPage: 1
            })
          ).data || [];

        if (!govResp?.parent1 && results.length > 0) {
          return (
            [results[0].ContactID, results[0].StudentContactSpouseID]
              .filter(
                id =>
                  // @ts-ignore
                  `${id || ""}`.trim() !== "" &&
                  // @ts-ignore
                  `${id || ""}`.trim() !== "0"
              )
              // @ts-ignore
              .map(id => Number(id))
          );
        }
      }

      return (
        [
          `${govResp?.parent1?.ID || ""}`.trim(),
          `${govResp?.parent2?.ID || ""}`.trim()
        ]
          .filter(
            parent =>
              // @ts-ignore
              `${parent?.id || ""}`.trim() !== "" &&
              // @ts-ignore
              `${parent?.id || ""}`.trim() !== "0"
          )
          // @ts-ignore
          .map(parent => Number(parent.id))
      );
    };

    const setEditingResponseForParentForm = (
      parentIds: number[],
      comMap: iCommunityMap,
      relMap: iRelationshipMap
    ) => {
      if (isForParent !== true || Object.keys(govResp).length > 0) {
        return;
      }

      // @ts-ignore
      const governmentResponse: iCODGovernmentFundingResponse = parentIds
        .map(parentId => {
          const parent = parentId in comMap ? comMap[parentId] : null;
          if (!parent) {
            return null;
          }
          const relationship = parentId in relMap ? relMap[parentId] : null;
          return {
            ID: parentId,
            full_name: `${parent.NameInternal || ''}`.trim(),
            relationship: `${relationship?.SynLuRelationship?.Description || ''}`.trim(),
            homeLanguageCode: `${parent.HomeLanguageCode || ''}`.trim(),
            secondary: `${parent.HighestSecondaryYearLevel || ''}`.trim(),
            tertiary: `${parent.HighestQualificationLevel || ''}`.trim(),
            occupationGroup: `${parent.OccupPositionCode || ''}`.trim(),
          }
        })
        .filter(info => info !== null)
        .reduce((map, parent, currentIndex) => {
          return {
            ...map,
            [`parent${MathHelper.add(currentIndex, 1)}`]: parent
          }
        }, {})
      setEditingResponse(governmentResponse);
      return;
    };

    const getData = async () => {
      const parentIds = await getParentIds();
      const results = await Promise.all([
        SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({
            ID: [studentId, ...parentIds]
          }),
        }),
        SynRelationshipService.getAll({
          where: JSON.stringify({
            ID: studentId,
            RelatedID: parentIds,
          }),
          include: 'SynLuRelationship',
        })
      ])
      const communityProfiles = results[0].data || [];
      const relationships = results[1].data || [];

      const comMap = communityProfiles.reduce((map, communityProfile) => {
        return {
          ...map,
          [communityProfile.ID]: communityProfile
        };
      }, {});
      const relationshipMap = relationships.reduce((map, relationship) => {
        return {
          ...map,
          [relationship.RelatedID]: relationship
        };
      }, {});
      setCommunityMap(comMap);
      setEditingResponseForParentForm(parentIds, comMap, relationshipMap);
    };

    let isCanceled = false;
    setIsLoading(true);
    getData()
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
  }, [response, responseFieldName, isForParent]);

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
            isRequired
            value={`${parentResponse?.homeLanguageCode || ""}`.trim()}
            valueFromDB={`${parentFromDB?.HomeLanguageCode || ""}`.trim()}
            errMsg={`${key}_HomeLanguageCode` in errorMap ? errorMap[`${key}_HomeLanguageCode`] : null}
            getComponent={isSameFromDB => {
              return (
                <SynLuLanguageSelector
                  className={`form-control ${
                    isSameFromDB === true && !(`${key}_HomeLanguageCode` in errorMap) ? "" : "is-invalid"
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
            isRequired
            label={"Highest Secondary Education:"}
            errMsg={`${key}_HighestSecondaryYearLevel` in errorMap ? errorMap[`${key}_HighestSecondaryYearLevel`] : null}
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
                    isSameFromDB === true && !(`${key}_HighestSecondaryYearLevel` in errorMap) ? "" : "is-invalid"
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
            isRequired
            label={"Highest Tertiary Education:"}
            errMsg={`${key}_HighestQualificationLevel` in errorMap ? errorMap[`${key}_HighestQualificationLevel`] : null}
            value={`${parentResponse?.tertiary || ""}`.trim()}
            valueFromDB={`${parentFromDB?.HighestQualificationLevel ||
              ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <SynLuQualificationLevelSelector
                  className={`form-control ${
                    isSameFromDB === true && !(`${key}_HighestQualificationLevel` in errorMap) ? "" : "is-invalid"
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
            isRequired
            label={"Occupation Group:"}
            errMsg={`${key}_OccupPositionCode` in errorMap ? errorMap[`${key}_OccupPositionCode`] : null}
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
                    isSameFromDB === true && !(`${key}_OccupPositionCode` in errorMap) ? "" : "is-invalid"
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

  const preSubmit = () => {
    const errors: iErrorMap = {};

    if (`${studentResponse?.HomeLanguageCode || ''}`.trim() === '') {
      errors.StudentHomeLanguageCode = 'Student Home Language is required.';
    }
    const resp = editingResponse || {};
    Object.keys(resp).forEach(key => {
      // @ts-ignore
      const parent = resp[key];
      if (`${parent?.homeLanguageCode || ''}`.trim() === '') {
        errors[`${key}_HomeLanguageCode`] = 'Home Language is required';
      }
      if (`${parent?.secondary || ''}`.trim() === '') {
        errors[`${key}_HighestSecondaryYearLevel`] = 'Highest Secondary Education is required';
      }
      if (`${parent?.tertiary || ''}`.trim() === '') {
        errors[`${key}_HighestQualificationLevel`] = 'Highest Tertiary Education is required';
      }
      if (`${parent?.occupationGroup || ''}`.trim() === '') {
        errors[`${key}_OccupPositionCode`] = 'Occupation Group is required';
      }
    })

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
    const studentFromDB =
      response.StudentID in communityMap
        ? communityMap[response.StudentID]
        : null;
    return (
      <>
        <Row>
          <Col>
            <CODAdminInputPanel
              isRequired
              label={"Student Home Language:"}
              value={`${studentResponse?.HomeLanguageCode || ""}`.trim()}
              valueFromDB={`${studentFromDB?.HomeLanguageCode || ""}`.trim()}
              errMsg={'StudentHomeLanguageCode' in errorMap ? errorMap['StudentHomeLanguageCode'] : null}
              getComponent={isSameFromDB => {
                return (
                  <SynLuLanguageSelector
                    className={`form-control ${
                      isSameFromDB === true && !('StudentHomeLanguageCode' in errorMap) ? "" : "is-invalid"
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

export default CODGovernmentFundingPanel;
