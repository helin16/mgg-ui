import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  iCODParentResponse,
  iCODParentsResponse
} from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import Toaster from "../../../services/Toaster";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import CODAddressEditor from "../components/CODAddressEditor";
import SynAddressService from "../../../services/Synergetic/SynAddressService";
import iSynAddress from "../../../types/Synergetic/iSynAddress";
import { dangerRed } from "../../../AppWrapper";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";

const Wrapper = styled.div`
  margin-top: 1rem;
`;
type iCommunityMap = { [key: number]: iSynCommunity };
type iAddressMap = { [key: number]: iSynAddress };
const CODParentsDetailsPanel = ({
  response,
  isDisabled,
  responseFieldName,
  getCancelBtn,
  getSubmitBtn
}: ICODDetailsEditPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODParentsResponse | null>(null);
  const [parentsFromDB, setParentsFromDB] = useState<iCommunityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [addressFromDBMap, setAddressFromDBMap] = useState<iAddressMap>({});

  useEffect(() => {
    const res = response?.response || {};
    // @ts-ignore
    const parentRes = responseFieldName in res ? res[responseFieldName] : {};
    setEditingResponse(parentRes);
    const parentIds = Object.values(parentRes)
      .filter(
        parent =>
          // @ts-ignore
          `${parent?.id || ""}`.trim() !== "" &&
          // @ts-ignore
          `${parent?.id || ""}`.trim() !== "0"
      )
      // @ts-ignore
      .map(parent => Number(parent.id));
    if (parentIds.length <= 0) {
      return;
    }

    const getData = async () => {
      const profiles = await SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({ ID: parentIds })
      });
      const parents = profiles.data || [];
      if (isCanceled) {
        return;
      }
      setParentsFromDB(
        parents.reduce((map: iCommunityMap, parent) => {
          return {
            ...map,
            [parent.ID]: parent
          };
        }, {})
      );
      if (parents.length <= 0) {
        return;
      }

      const addressResults = await SynAddressService.getAll({
        where: JSON.stringify({
          AddressID: parents.map(parent => parent.AddressID)
        }),
        perPage: 2,
        currentPage: 1,
        include: "Country,HomeCountry"
      });
      const addresses = addressResults.data || [];
      if (isCanceled) {
        return;
      }
      setAddressFromDBMap(
        addresses.reduce((map: iAddressMap, address) => {
          return {
            ...map,
            [address.AddressID]: address
          };
        }, {})
      );
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
  }, [response]);

  useEffect(() => {
    const hasBeenSyncd =
      `${editingResponse?.syncToSynAt || ""}`.trim() !== "" &&
      `${editingResponse?.syncToSynById || ""}`.trim() !== "";
    setIsReadOnly(hasBeenSyncd === true || isDisabled === true);
  }, [editingResponse, isDisabled]);

  const updateParentResponse = (
    roleName: "main" | "spouse",
    fieldName: string,
    newValue: string
  ) => {
    const object = editingResponse || {};
    // @ts-ignore
    const keyObj = roleName in object ? object[roleName] : {};
    // @ts-ignore
    setEditingResponse({
      ...object,
      [roleName]: {
        ...keyObj,
        [fieldName]: newValue
      }
    });
  };

  const updateParentOccupResponse = (
    roleName: "main" | "spouse",
    fieldName: string,
    newValue: string
  ) => {
    const object = editingResponse || {};
    // @ts-ignore
    const keyObj = roleName in object ? object[roleName] : {};
    // @ts-ignore
    setEditingResponse({
      ...editingResponse,
      [roleName]: {
        ...keyObj,
        occup: {
          ...(keyObj.occup || {}),
          [fieldName]: newValue
        }
      }
    });
  };

  const getParentDetailsInputPanel = (
    label: string,
    value: string,
    dbFieldValue: string,
    onChange: (newValue: string) => void
  ) => {
    // @ts-ignore
    // const value = fieldName in parent ? parent[fieldName] : "";
    return (
      <CODAdminInputPanel
        label={label}
        value={value}
        valueFromDB={dbFieldValue}
        getComponent={(isSameFromDB: boolean) => {
          return (
            <FormControl
              isInvalid={!isSameFromDB}
              disabled={isReadOnly === true}
              value={value || ""}
              onChange={event => {
                // @ts-ignore
                onChange(event.target.value || "");
              }}
            />
          );
        }}
      />
    );
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        {["main", "spouse"].map(key => {
          const parents = editingResponse || {};
          if (!(key in parents)) {
            return null;
          }
          // @ts-ignore
          const parent: iCODParentResponse = parents[key];
          if (
            `${parent.id || ""}`.trim() === "" ||
            `${parent.id || ""}`.trim() === "0"
          ) {
            return null;
          }
          const parentFromDB: iSynCommunity | null =
            parent.id in parentsFromDB ? parentsFromDB[parent.id] : null;
          const parentAddressFromDB: iSynAddress | null =
            (parentFromDB?.AddressID || "") in addressFromDBMap
              ? addressFromDBMap[parentFromDB?.AddressID || 0]
              : null;

          const postalAddr = SynAddressService.convertAddressObjToStr(
            SynAddressService.getAddressObjFromCODResponse(
              parent.address?.postal || null
            )
          );
          const postalAddrFromDB = SynAddressService.convertAddressObjToStr(
            SynAddressService.getAddressObjFromSynAddress(
              parentAddressFromDB || null
            )?.postal || null
          );

          const homeAddr = SynAddressService.convertAddressObjToStr(
            SynAddressService.getAddressObjFromCODResponse(
              parent.address?.home || null
            )
          );
          const homeAddrFromDB = SynAddressService.convertAddressObjToStr(
            SynAddressService.getAddressObjFromSynAddress(
              parentAddressFromDB || null
            )?.home || null
          );
          // @ts-ignore
          return (
            <Col md={6} key={key}>
              <h6>
                [{parent.relationshipToStudent || ""}] {parent.name}
              </h6>
              <Row>
                <Col md={6}>
                  {getParentDetailsInputPanel(
                    "Mobile",
                    parent.mobile || "",
                    parentFromDB?.MobilePhone || "",
                    newValue => {
                      // @ts-ignore
                      updateParentResponse(key, "mobile", newValue);
                    }
                  )}
                </Col>
                <Col md={6}>
                  {getParentDetailsInputPanel(
                    "Email",
                    parent.email || "",
                    parentFromDB?.Email || "",
                    newValue => {
                      // @ts-ignore
                      updateParentResponse(key, "email", newValue);
                    }
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  {getParentDetailsInputPanel(
                    "Company",
                    parent.occup?.company || "",
                    parentFromDB?.OccupCompany || "",
                    newValue => {
                      // @ts-ignore
                      updateParentOccupResponse(key, "company", newValue);
                    }
                  )}
                </Col>
                <Col md={6}>
                  {getParentDetailsInputPanel(
                    "Position",
                    parent.occup?.position || "",
                    parentFromDB?.OccupPositionCode || "",
                    newValue => {
                      // @ts-ignore
                      updateParentOccupResponse(key, "position", newValue);
                    }
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  {getParentDetailsInputPanel(
                    "Work phone",
                    parent.occup?.phone || "",
                    parentFromDB?.OccupPhone || "",
                    newValue => {
                      // @ts-ignore
                      updateParentOccupResponse(key, "phone", newValue);
                    }
                  )}
                </Col>
                <Col md={6}>
                  {getParentDetailsInputPanel(
                    "Work Mobile",
                    parent.occup?.mobile || "",
                    parentFromDB?.OccupMobilePhone || "",
                    newValue => {
                      // @ts-ignore
                      updateParentOccupResponse(key, "mobile", newValue);
                    }
                  )}
                </Col>
                <Col md={12}>
                  {getParentDetailsInputPanel(
                    "Work Email",
                    parent.occup?.email || "",
                    parentFromDB?.OccupEmail || "",
                    newValue => {
                      // @ts-ignore
                      updateParentOccupResponse(key, "email", newValue);
                    }
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <CODAdminInputPanel
                    label={"Address"}
                    value={postalAddr}
                    valueFromDB={postalAddrFromDB}
                    getIsSameFromDBFn={() => {
                      return (
                        postalAddr.toUpperCase() ===
                          postalAddrFromDB.toUpperCase() &&
                        homeAddr.toUpperCase() === homeAddrFromDB.toUpperCase()
                      );
                    }}
                    getSynergeticLabelFn={(isSameFromDB, valueFromDB) => {
                      if (isSameFromDB === true) {
                        return valueFromDB;
                      }
                      if (postalAddr !== postalAddrFromDB) {
                        return (
                          <>
                            <span
                              style={{
                                backgroundColor: dangerRed,
                                color: "white",
                                padding: "0 0.25rem"
                              }}
                            >
                              P
                            </span>{" "}
                            {postalAddrFromDB}
                          </>
                        );
                      }
                      if (homeAddr !== homeAddrFromDB) {
                        return (
                          <>
                            <span
                              style={{
                                backgroundColor: dangerRed,
                                color: "white",
                                padding: "0 0.25rem"
                              }}
                            >
                              H
                            </span>{" "}
                            {homeAddrFromDB}
                          </>
                        );
                      }
                    }}
                    getComponent={(isSameFromDB: boolean) => {
                      return (
                        <CODAddressEditor
                          isDisabled={isReadOnly === true}
                          synAddressId={parentFromDB?.AddressID}
                          codeRespAddr={parent.address}
                          className={isSameFromDB === true ? "" : "is-invalid"}
                          onChange={newAddress => {
                            // @ts-ignore
                            updateParentResponse(key, "address", newAddress);
                          }}
                        />
                      );
                    }}
                  />
                </Col>
              </Row>
            </Col>
          );
        })}
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
        getSubmitBtn={getSubmitBtn}
      />
    </Wrapper>
  );
};

export default CODParentsDetailsPanel;
