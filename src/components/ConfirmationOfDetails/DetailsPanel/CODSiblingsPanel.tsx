import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
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

const Wrapper = styled.div`
  margin-top: 1rem;
`;
const CODSiblingsPanel = ({
  response,
  isDisabled,
  responseFieldName,
  getCancelBtn,
  getSubmitBtn,
  description
}: ICODDetailsEditPanel & { description?: any }) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [editingResponse, setEditingResponse] = useState<iCODSiblingResponse[]>(
    []
  );
  const [isLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const res = response?.response || {};
    // @ts-ignore
    setEditingResponse(responseFieldName in res ? res[responseFieldName] : []);
  }, [response]);

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

  const getSiblingsTable = () => {
    const siblings = editingResponse || [];
    if (siblings.length <= 0) {
      return null;
    }

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
                  return (
                    <td key={col.key}>
                      <FormControl
                        value={data.name || ""}
                        disabled={isReadOnly === true}
                        onChange={event => {
                          updateSiblingResponse(
                            "name",
                            event.target.value || "",
                            index
                          );
                        }}
                      />
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
                  return (
                    <td key={col.key} style={{ width: "15%" }}>
                      <DateTimePicker
                        isDisabled={isReadOnly === true}
                        timeFormat={false}
                        dateFormat={"DD MMM YYYY"}
                        className={`form-control`}
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
                      header: "",
                      cell: (
                        col: iTableColumn,
                        data: iCODSiblingResponse,
                        index?: number
                      ) => {
                        return (
                          <td key={col.key} className={"text-right"}>
                            <DeleteConfirmPopupBtn
                              deletingFn={() =>
                                new Promise(() => {
                                  const siblings = [...(editingResponse || [])];
                                  siblings.splice(index || 0, 1);
                                  setEditingResponse(siblings);
                                })
                              }
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

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
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
        getSubmitBtn={getSubmitBtn}
      />
    </Wrapper>
  );
};

export default CODSiblingsPanel;
