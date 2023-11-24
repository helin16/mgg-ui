import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import {Button, Col, FormControl, Row} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { iCODSiblingResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
import moment from "moment-timezone";
import Table, { iTableColumn } from "../../common/Table";
import SynLuGenderSelector, {
  translateDescriptionToCode
} from "../../Community/SynLuGenderSelector";
import DateTimePicker from "../../common/DateTimePicker";
import YearLevelSelector from "../../student/YearLevelSelector";
import SynLuSchoolSelector from "../../Community/SynLuSchoolSelector";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import * as Icons from "react-bootstrap-icons";
import SynRelationshipService from "../../../services/Synergetic/Community/SynRelationshipService";
import Toaster, {TOAST_TYPE_ERROR} from "../../../services/Toaster";
import {
  SYN_RELATIONSHIP_CODE_BROTHER,
  SYN_RELATIONSHIP_CODE_SISTER
} from '../../../types/Synergetic/Lookup/iSynLuRelationship';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import iSynRelationship from '../../../types/Synergetic/Community/iSynRelationship';
import FormErrorDisplay, {iErrorMap} from '../../form/FormErrorDisplay';

const Wrapper = styled.div`
  margin-top: 1rem;
`;
type iCommunityMap = { [key: number]: iSynCommunity };
const CODSiblingsPanel = ({
  response,
  isDisabled,
  responseFieldName,
  getCancelBtn,
  getSubmitBtn,
  description,
  isForParent
}: ICODDetailsEditPanel & { description?: any }) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [editingResponse, setEditingResponse] = useState<iCODSiblingResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});

  useEffect(() => {
    const studentId = response?.StudentID;
    const res = response?.response || {};
    // @ts-ignore
    const resp = responseFieldName in res ? res[responseFieldName] : [];
    setEditingResponse(resp);

    const setEditingResponseForParentForm = (relationShips: iSynRelationship[], comMap: iCommunityMap) => {
      if (isForParent !== true || Object.keys(resp).length > 0 || resp.length > 0) {
        return;
      }
      // @ts-ignore
      const siblings: iCODSiblingResponse[] = relationShips.map(relationShip => {
        if (!(relationShip.RelatedID in comMap)) {
          return null;
        }
        const sibling = comMap[relationShip.RelatedID];
        return {
          id: relationShip.RelatedID,
          name: `${sibling.Given1 || ''} ${sibling.Surname || ''}`.trim(),
          birthDate: `${sibling.BirthDate || ''}`.trim() === '' ? '' : moment(`${sibling.BirthDate || ''}`.trim()).utc().format('YYYY-MM-DD'),
          gender: sibling.Gender,
          schoolCode: '',
          yearLevelCode: '',
        }
      }).filter(relationship => relationship !== null);
      setEditingResponse(siblings);
      return;
    };

    const getData = async () => {
      const relationships = (await SynRelationshipService.getAll({
        where: JSON.stringify({ ID: studentId,  RelationShip: [SYN_RELATIONSHIP_CODE_SISTER, SYN_RELATIONSHIP_CODE_BROTHER]}),
        include: "SynLuRelationship",
        perPage: 9999,
      })).data || [];
      const relatedIds = relationships.map(relationship => relationship.RelatedID);
      if (relatedIds.length <= 0) {
        return;
      }

      const communityProfiles = (await SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({ ID: relatedIds}),
        perPage: 9999,
      })).data || [];
      const comMap = communityProfiles.reduce((map, communityProfile) => {
        return {
          ...map,
          [communityProfile.ID]: communityProfile,
        }
      }, {});

      // setRelationShipsFromDB(relationships);
      // setCommunityProfileMap(comMap);
      setEditingResponseForParentForm(relationships, comMap);
      return;
    }

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
  }, [response, isForParent, responseFieldName]);

  useEffect(() => {
    setIsReadOnly(isDisabled === true);
  }, [editingResponse, isDisabled]);

  const updateSiblingResponse = (
    fieldName: string,
    newValue: any,
    index?: number
  ) => {
    const siblings = [...editingResponse];
    const ind = index || 0;
    siblings[ind] = {
      ...siblings[ind],
      [fieldName]: newValue
    };

    // @ts-ignore
    setEditingResponse(siblings.filter(resp => resp !== null));
  };

  const preSubmit = () => {
    const errors: iErrorMap = {};

    (editingResponse || []).forEach((resp, index) => {
      if (`${resp.name || ''}`.trim() === '') {
        errors[`name_${index}`] = 'Name is required.';
      }
      if (`${resp.gender || ''}`.trim() === '') {
        errors[`gender_${index}`] = 'Gender is required.';
      }
      if (`${resp.birthDate || ''}`.trim() === '') {
        errors[`birthDate_${index}`] = 'DOB is required.';
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
  }

  const getSiblingsTable = () => {
    const siblings = editingResponse || [];

    return (
      <Row>
        <Col>
          <Table
            rows={siblings}
            columns={[
              {
                key: "Name",
                header: "Name",
                cell: (
                  col: iTableColumn,
                  data: iCODSiblingResponse,
                  index?: number
                ) => {
                  const errorFieldName = `name_${index || 0}`;
                  return (
                    <td key={col.key}>
                      <FormControl
                        value={data.name || ""}
                        disabled={isReadOnly === true}
                        isInvalid={errorFieldName in errorMap}
                        onChange={event => {
                          updateSiblingResponse(
                            "name",
                            event.target.value || "",
                            index
                          );
                        }}
                      />
                      <FormErrorDisplay errorsMap={errorMap} fieldName={errorFieldName} />
                    </td>
                  );
                }
              },
              {
                key: "gender",
                header: "Gender",
                cell: (
                  col: iTableColumn,
                  data: iCODSiblingResponse,
                  index?: number
                ) => {
                  const errorFieldName = `gender_${index || 0}`;
                  return (
                    <td key={col.key}>
                      <SynLuGenderSelector
                        isDisabled={isReadOnly === true}
                        values={
                          `${data.gender || ""}`.trim() === ""
                            ? []
                            : [
                                translateDescriptionToCode(
                                  `${data.gender || ""}`.trim()
                                )
                              ]
                        }
                        classname={`form-control ${errorFieldName in errorMap ? 'is-invalid' : ''}`}
                        onSelect={option => {
                          if (option === null) {
                            updateSiblingResponse("gender", undefined, index);
                            return;
                          }

                          updateSiblingResponse(
                            "gender",
                            Array.isArray(option)
                              ? option[0].value
                              : option.value,
                            index
                          );
                        }}
                      />
                      <FormErrorDisplay errorsMap={errorMap} fieldName={errorFieldName} />
                    </td>
                  );
                }
              },
              {
                key: "dateOfBirth",
                header: "Date of Birth",
                cell: (
                  col: iTableColumn,
                  data: iCODSiblingResponse,
                  index?: number
                ) => {
                  const errorFieldName = `birthDate_${index || 0}`;
                  return (
                    <td key={col.key} style={{ width: "15%" }}>
                      <DateTimePicker
                        isDisabled={isReadOnly === true}
                        className={`form-control ${
                          errorFieldName in errorMap ? "is-invalid" : ''
                        }`}
                        timeFormat={false}
                        dateFormat={"DD MMM YYYY"}
                        value={
                          `${data.birthDate || ""}`.trim() === ""
                            ? undefined
                            : moment
                                .tz(
                                  `${data.birthDate || ""}`.trim(),
                                  moment.tz.guess()
                                )
                                .format("DD MMM YYYY")
                        }
                        onChange={selected => {
                          if (typeof selected !== "object") {
                            return;
                          }
                          updateSiblingResponse(
                            "birthDate",
                            selected.format("YYYY-MM-DD"),
                            index
                          );
                        }}
                      />
                      <FormErrorDisplay errorsMap={errorMap} fieldName={errorFieldName} />
                    </td>
                  );
                }
              },
              {
                key: "yearLevel",
                header: "Year Level",
                cell: (
                  col: iTableColumn,
                  data: iCODSiblingResponse,
                  index?: number
                ) => {
                  return (
                    <td key={col.key} style={{ width: "10%" }}>
                      <YearLevelSelector
                        classname={'form-control'}
                        isDisabled={isReadOnly === true}
                        values={
                          `${data.yearLevelCode || ""}`.trim() === ""
                            ? []
                            : [`${data.yearLevelCode || ""}`.trim()]
                        }
                        onSelect={option => {
                          if (option === null) {
                            updateSiblingResponse(
                              "yearLevelCode",
                              undefined,
                              index
                            );
                            return;
                          }

                          updateSiblingResponse(
                            "yearLevelCode",
                            Array.isArray(option)
                              ? option[0].value
                              : option.value,
                            index
                          );
                        }}
                      />
                    </td>
                  );
                }
              },
              {
                key: "school",
                header: "School",
                cell: (
                  col: iTableColumn,
                  data: iCODSiblingResponse,
                  index?: number
                ) => {
                  return (
                    <td key={col.key} style={{ width: "34%" }}>
                      <SynLuSchoolSelector
                        classname={'form-control'}
                        isDisabled={isReadOnly === true}
                        values={
                          `${data.schoolCode || ""}`.trim() === ""
                            ? []
                            : [`${data.schoolCode || ""}`.trim()]
                        }
                        onSelect={option => {
                          if (option === null) {
                            updateSiblingResponse(
                              "schoolCode",
                              undefined,
                              index
                            );
                            return;
                          }

                          updateSiblingResponse(
                            "schoolCode",
                            Array.isArray(option)
                              ? option[0].value
                              : option.value,
                            index
                          );
                        }}
                      />
                    </td>
                  );
                }
              },
              ...(isReadOnly === true
                ? []
                : [
                    {
                      key: "operations",
                      header: (col: iTableColumn) => {
                        return (
                          <th key={col.key} className={"text-right"}>
                            <Button variant={'success'} size={'sm'} title={'New'} onClick={() => {
                              setEditingResponse([
                                {
                                  name: '',
                                },
                                ...editingResponse,
                              ])
                            }}><Icons.Plus /></Button>
                          </th>
                        )
                      },
                      cell: (
                        col: iTableColumn,
                        data: iCODSiblingResponse,
                        index?: number
                      ) => {
                        return (
                          <td key={col.key} className={"text-right"}>
                            <DeleteConfirmPopupBtn
                              deletingFn={async () => {
                                const siblings = [...(editingResponse || [])];
                                siblings.splice(index || 0, 1);
                                setEditingResponse(siblings)
                              }}
                              confirmString={`${currentUser?.synergyId ||
                                "na"}`}
                              variant={"danger"}
                              size={"sm"}
                            >
                              <Icons.Trash />
                            </DeleteConfirmPopupBtn>
                          </td>
                        );
                      }
                    }
                  ])
            ]}
          />
        </Col>
      </Row>
    );
  };

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }
    return (
      <>
        <Row>
          <Col>{description}</Col>
        </Row>
        {getSiblingsTable()}
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

export default CODSiblingsPanel;
