import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  iCODParentResponse,
  iCODParentsResponse
} from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import iSynCommunity from "../../../types/Synergetic/iSynCommunity";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import CODAddressEditor from "../components/CODAddressEditor";
import SynAddressService from "../../../services/Synergetic/SynAddressService";
import iSynAddress from "../../../types/Synergetic/iSynAddress";
import { dangerRed } from "../../../AppWrapper";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";
import SynVStudentContactsCurrentPastFutureCombinedService from "../../../services/Synergetic/Student/SynVStudentContactsCurrentPastFutureCombinedService";
import { STUDENT_CONTACT_TYPE_SC1 } from "../../../types/Synergetic/Student/iStudentContact";
import PageNotFound from "../../PageNotFound";
import SynRelationshipService from "../../../services/Synergetic/Community/SynRelationshipService";
import iSynLuRelationship from "../../../types/Synergetic/Lookup/iSynLuRelationship";
import SynLuOccupationSelector from "../../Community/SynLuOccupationSelector";
import { iErrorMap } from "../../form/FormErrorDisplay";

const Wrapper = styled.div`
  margin-top: 1rem;
`;
type iCommunityMap = { [key: number]: iSynCommunity };
type iAddressMap = { [key: number]: iSynAddress };
type iRelationShipMap = { [key: number]: iSynLuRelationship };
const CODParentsDetailsPanel = ({
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
  ] = useState<iCODParentsResponse | null>(null);
  const [parentsFromDB, setParentsFromDB] = useState<iCommunityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [addressFromDBMap, setAddressFromDBMap] = useState<iAddressMap>({});
  const [errorMap, setErrorMap] = useState<iErrorMap>({});

  useEffect(() => {
    const studentId = response?.StudentID;
    const res = response?.response || {};
    // @ts-ignore
    const parentRes = responseFieldName in res ? res[responseFieldName] : {};
    setEditingResponse(parentRes);
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

        if (!parentRes.main && results.length > 0) {
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
        Object.values(parentRes)
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

    const getEditingResponseForAParent = (
      parentId: number,
      communityProfileMap: iCommunityMap,
      addressMap: iAddressMap,
      relationshipMap: iRelationShipMap
    ) => {
      const communityProfile =
        parentId in communityProfileMap ? communityProfileMap[parentId] : null;
      const addressId = communityProfile?.AddressID || 0;
      const address = addressId in addressMap ? addressMap[addressId] : null;
      const relationShip =
        parentId in relationshipMap ? relationshipMap[parentId] : null;
      return {
        id: Number(communityProfile?.ID),
        name: `${communityProfile?.NameInternal || ""}`.trim(),
        description: "",
        relationshipToStudent: `${relationShip?.Description || ""}`.trim(),
        mobile: `${communityProfile?.MobilePhone || ""}`.trim(),
        email: `${communityProfile?.Email || ""}`.trim(),
        address: {
          AddressID: address?.AddressID,
          homeAndPostalSame: address?.HomeAddressSameFlag === true,
          home: {
            full: `${address?.HomeAddressFull || ""}`,
            object: {
              street: `${address?.HomeAddress1 || ""}`,
              suburb: `${address?.HomeSuburb || ""}`,
              state: `${address?.HomeState || ""}`,
              postcode: `${address?.HomePostCode || ""}`,
              countryCode: `${address?.HomeCountryCode || ""}`
            }
          },
          postal: {
            full: `${address?.HomeAddressFull || ""}`,
            object: {
              street: `${address?.Address1 || ""}`,
              suburb: `${address?.Suburb || ""}`,
              state: `${address?.State || ""}`,
              postcode: `${address?.PostCode || ""}`,
              countryCode: `${address?.CountryCode || ""}`
            }
          }
        },
        occup: {
          company: `${communityProfile?.OccupCompany || ""}`.trim(), //communityProfile?.OccupCompany,
          position: `${communityProfile?.OccupCode || ""}`.trim(),
          phone: `${communityProfile?.OccupPhone || ""}`.trim(),
          mobile: `${communityProfile?.OccupMobilePhone || ""}`.trim(),
          email: `${communityProfile?.OccupEmail || ""}`.trim()
        }
      };
    };

    const setEditingResponseForParentView = (
      parentIds: number[],
      communityProfileMap: iCommunityMap,
      addressMap: iAddressMap,
      relationshipMap: iRelationShipMap
    ) => {
      if (
        isForParent !== true ||
        parentIds.length <= 0 ||
        Object.keys(communityProfileMap).length <= 0
      ) {
        return;
      }
      setEditingResponse({
        main: getEditingResponseForAParent(
          parentIds[0],
          communityProfileMap,
          addressMap,
          relationshipMap
        ),
        ...(parentIds.length <= 1
          ? {}
          : {
              spouse: getEditingResponseForAParent(
                parentIds[1],
                communityProfileMap,
                addressMap,
                relationshipMap
              )
            })
      });
    };

    const getData = async () => {
      const parentIds = await getParentIds();
      const results = await Promise.all([
        SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({ ID: parentIds })
        }),
        SynRelationshipService.getAll({
          where: JSON.stringify({ ID: studentId, RelatedID: parentIds }),
          include: "SynLuRelationship"
        })
      ]);
      const parents = results[0].data || [];
      if (parents.length <= 0) {
        return;
      }
      const parentMap = parents.reduce((map: iCommunityMap, parent) => {
        return {
          ...map,
          [parent.ID]: parent
        };
      }, {});
      const relationships = results[1].data || [];
      const relationshipMap = relationships.reduce(
        (map: iRelationShipMap, relationship) => {
          if (!relationship.SynLuRelationship) {
            return map;
          }
          return {
            ...map,
            [relationship.RelatedID]: relationship.SynLuRelationship
          };
        },
        {}
      );

      const addressResults = await SynAddressService.getAll({
        where: JSON.stringify({
          AddressID: parents.map(parent => parent.AddressID)
        }),
        perPage: 2,
        currentPage: 1,
        include: "Country,HomeCountry"
      });
      const addresses = addressResults.data || [];
      const addressMap = addresses.reduce((map: iAddressMap, address) => {
        return {
          ...map,
          [address.AddressID]: address
        };
      }, {});
      setParentsFromDB(parentMap);
      setAddressFromDBMap(addressMap);
      if (!parentRes?.main) {
        setEditingResponseForParentView(
          parentIds,
          parentMap,
          addressMap,
          relationshipMap
        );
      }
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
  }, [response, isForParent, responseFieldName]);

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
    onChange: (newValue: string) => void,
    isRequired?: boolean,
    errMsg?: string
  ) => {
    // @ts-ignore
    // const value = fieldName in parent ? parent[fieldName] : "";
    return (
      <CODAdminInputPanel
        isRequired={isRequired}
        label={label}
        value={value}
        valueFromDB={dbFieldValue}
        errMsg={errMsg}
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

  const preSubmit = () => {
    const errors: iErrorMap = {};
    if (`${editingResponse?.main.mobile || ""}`.trim() === "") {
      errors.mainMobile = "Mobile is required.";
    }
    if (`${editingResponse?.main.email || ""}`.trim() === "") {
      errors.mainEmail = "Email is required.";
    }

    if (
      !editingResponse?.main.address ||
      `${editingResponse?.main.address?.postal?.object?.street ||
        ""}`.trim() === ""
    ) {
      errors.mainAddress = "Address is required.";
    }

    if (Number(editingResponse?.spouse?.id || 0) > 0) {
      if (`${editingResponse?.spouse?.mobile || ""}`.trim() === "") {
        errors.spouseMobile = "Mobile is required.";
      }
      if (`${editingResponse?.spouse?.email || ""}`.trim() === "") {
        errors.spouseEmail = "Email is required.";
      }
      if (
        !editingResponse?.spouse?.address ||
        `${editingResponse?.spouse?.address?.postal?.object?.street ||
          ""}`.trim() === ""
      ) {
        errors.mainAddress = "Address is required.";
      }
    }
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

    if (!editingResponse?.main) {
      return (
        <PageNotFound
          description={
            "Please contact the School before you can continue. It's usually caused by your child's profile is neither current nor in future with finalised status."
          }
          title={"Something wrong with your profile"}
        />
      );
    }

    return (
      <>
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
                <Row>
                  <Col>
                    <h6>
                      [{parent.relationshipToStudent || ""}] {parent.name}
                    </h6>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    {getParentDetailsInputPanel(
                      "Mobile",
                      parent.mobile || "",
                      parentFromDB?.MobilePhone || "",
                      newValue => {
                        // @ts-ignore
                        updateParentResponse(key, "mobile", newValue);
                      },
                      true,
                      `${key}Mobile` in errorMap
                        ? errorMap[`${key}Mobile`]
                        : null
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
                      },
                      true,
                      `${key}Email` in errorMap
                      ? errorMap[`${key}Email`]
                      : null
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
                    <CODAdminInputPanel
                      label={"Position"}
                      value={parent.occup?.position || ""}
                      valueFromDB={parentFromDB?.OccupCode || ""}
                      getComponent={isSameFromDB => {
                        return (
                          <SynLuOccupationSelector
                            values={[parent.occup?.position || ""]}
                            className={`form-control ${
                              isSameFromDB === true ? "" : "is-invalid"
                            }`}
                            onSelect={option => {
                              updateParentOccupResponse(
                                // @ts-ignore
                                key,
                                "position",
                                option === null
                                  ? ""
                                  : Array.isArray(option) && option.length > 0
                                  ? `${option[0].value || ""}`
                                  : // @ts-ignore
                                    `${option?.value}`
                              );
                            }}
                          />
                        );
                      }}
                    />
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
                      errMsg={
                        `${key}Address` in errorMap
                          ? errorMap[`${key}Address`]
                          : null
                      }
                      getIsSameFromDBFn={() => {
                        return (
                          postalAddr.toUpperCase() ===
                            postalAddrFromDB.toUpperCase() &&
                          homeAddr.toUpperCase() ===
                            homeAddrFromDB.toUpperCase()
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
                            className={
                              isSameFromDB === true ? "" : "is-invalid"
                            }
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

export default CODParentsDetailsPanel;
