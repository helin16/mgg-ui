import iCODAdminParentsDetailsPanel from "./iCODEAdminDetailsPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse, {
  iCODParentResponse
} from "../../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../../../common/PageLoadingSpinner";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../../../services/Toaster";
import moment from "moment-timezone";
import CODAdminDetailsSaveBtnPanel from "./CODAdminDetailsSaveBtnPanel";
import ConfirmationOfDetailsResponseService from "../../../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/makeReduxStore";
import iSynCommunity from "../../../../../types/Synergetic/iSynCommunity";
import SynCommunityService from "../../../../../services/Synergetic/Community/SynCommunityService";
import CODAdminInputPanel from "./CODAdminInputPanel";
import CODAddressEditor from "../../CODAddressEditor";
import SynAddressService from "../../../../../services/Synergetic/SynAddressService";
import iSynAddress from "../../../../../types/Synergetic/iSynAddress";
import {dangerRed} from '../../../../../AppWrapper';

const Wrapper = styled.div`
  margin-top: 1rem;
`;
type iCommunityMap = { [key: number]: iSynCommunity };
type iAddressMap = { [key: number]: iSynAddress };
const CODAdminParentsDetailsPanel = ({
  response,
  onSaved,
  onNext,
  onCancel
}: iCODAdminParentsDetailsPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iConfirmationOfDetailsResponse | null>(null);
  const [parentsFromDB, setParentsFromDB] = useState<iCommunityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBeenSyncd, setHasBeenSyncd] = useState(false);
  const [addressFromDBMap, setAddressFromDBMap] = useState<iAddressMap>({});

  useEffect(() => {
    setEditingResponse({ ...response });
    const parentIds = Object.values(response.response?.parent || {})
        // @ts-ignore
      .filter(parent => `${parent?.id || ""}`.trim() !== "")
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
    setHasBeenSyncd(
      `${editingResponse?.response?.parent?.syncToSynAt || ""}`.trim() !== "" &&
        `${editingResponse?.response?.parent?.syncToSynById || ""}`.trim() !==
          ""
    );
  }, [editingResponse]);

  const updateParentResponse = (
    roleName: "main" | "spouse",
    fieldName: string,
    newValue: string
  ) => {
    setEditingResponse({
      ...editingResponse,
      response: {
        ...(editingResponse?.response || {}),
        // @ts-ignore
        parent: {
          ...(editingResponse?.response?.parent || {}),
          [roleName]: {
            ...(editingResponse?.response?.parent[roleName] || {}),
            [fieldName]: newValue
          }
        }
      }
    });
  };

  const updateParentOccupResponse = (
    roleName: "main" | "spouse",
    fieldName: string,
    newValue: string
  ) => {
    setEditingResponse({
      ...editingResponse,
      response: {
        ...(editingResponse?.response || {}),
        // @ts-ignore
        parent: {
          ...(editingResponse?.response?.parent || {}),
          [roleName]: {
            ...(editingResponse?.response?.parent[roleName] || {}),
            occup: {
              ...(editingResponse?.response?.parent[roleName]?.occup || {}),
              [fieldName]: newValue
            }
          }
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
              disabled={hasBeenSyncd === true}
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

  if (!editingResponse || isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        {["main", "spouse"].map(key => {
          const parents = editingResponse?.response?.parent || {};
          if (!(key in parents)) {
            return null;
          }
          // @ts-ignore
          const parent: iCODParentResponse = parents[key];
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
                      return postalAddr === postalAddrFromDB && homeAddr === homeAddrFromDB;
                    }}
                    getSynergeticLabelFn={(isSameFromDB, valueFromDB) => {
                      if (isSameFromDB === true) {
                        return valueFromDB;
                      }
                      if (postalAddr !== postalAddrFromDB) {
                        return <>{postalAddrFromDB} <span style={{backgroundColor: dangerRed, color: 'white', padding: '0 0.25rem'}}>P</span></>;
                      }
                      if (homeAddr !== homeAddrFromDB) {
                        return <>{homeAddrFromDB} <span style={{backgroundColor: dangerRed, color: 'white', padding: '0 0.25rem'}}>H</span></>;
                      }
                    }}
                    getComponent={(isSameFromDB: boolean) => {
                      return (
                        <CODAddressEditor
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
        onSubmitting={submitting => setIsSubmitting(submitting)}
        isLoading={isLoading || isSubmitting}
        onNext={onNext}
        syncdLabel={
          hasBeenSyncd !== true
            ? undefined
            : `Student Details Already Sync'd @ ${moment(
                editingResponse.response?.parent?.syncToSynAt
              ).format("lll")} By ${
                editingResponse.response?.parent?.syncToSynById
              }`
        }
        editingResponse={editingResponse}
        onSaved={resp => {
          Toaster.showToast(`Student Details Sync'd.`, TOAST_TYPE_SUCCESS);
          onSaved(resp);
        }}
        onCancel={onCancel}
        syncFn={resp =>
          ConfirmationOfDetailsResponseService.update(resp.id, {
            ...resp,
            response: {
              ...(resp.response || {}),
              student: {
                ...(resp.response?.student || {}),
                syncToSynAt: moment().toISOString(),
                syncToSynById: currentUser?.synergyId
              }
            }
          })
        }
      />
    </Wrapper>
  );
};

export default CODAdminParentsDetailsPanel;
