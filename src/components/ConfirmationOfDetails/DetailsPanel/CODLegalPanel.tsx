import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iSynCommunityLegal from "../../../types/Synergetic/Community/iSynCommunityLegal";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import SynCommunityLegalService from "../../../services/Synergetic/Community/SynCommunityLegalService";
import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import Toaster from "../../../services/Toaster";
import { Col, FormControl, Row } from "react-bootstrap";
import moment from "moment-timezone";
import { iCODCourtOrderResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import FlagSelector from "../../form/FlagSelector";
import ClientSideFileReader from "../../common/ClientSideFileReader";
import SectionDiv from "../../common/SectionDiv";
import DateTimePicker from "../../common/DateTimePicker";
import SynLuCourtOrderTypeSelector from "../../Community/SynLuCourtOrderTypeSelector";
import CODFileListTable from "../components/CODFileListTable";

const Wrapper = styled.div``;

const CODLegalPanel = ({ response, isDisabled }: ICODDetailsEditPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODCourtOrderResponse | null>(null);

  const [
    communityLegal,
    setCommunityLegal
  ] = useState<iSynCommunityLegal | null>(null);

  useEffect(() => {
    setEditingResponse(response?.response?.courtOrder || null);
    let isCanceled = false;
    setIsLoading(true);
    SynCommunityLegalService.getAll({
      where: JSON.stringify({ ID: response.StudentID }),
      perPage: 1,
      currentPage: 1
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const results = resp.data || [];
        setCommunityLegal(results.length <= 0 ? null : results[0]);
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

  const handleResponseUpdated = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingResponse({
      ...(editingResponse || {}),
      [fieldName]: newValue
    });
  };

  const getFileContents = () => {
    if (editingResponse?.hasCourtOrders === false) {
      return null;
    }
    const files = editingResponse?.newCourtOrderFiles || [];
    return (
      <Row>
        <Col>
          <SectionDiv>
            <CODFileListTable
              files={files}
              isDisabled={isReadOnly === true}
              deletingFn={asset => {
                return new Promise(() =>
                  handleResponseUpdated(
                    "newCourtOrderFiles",
                    files.filter(
                      file =>
                        !(
                          file.key === asset.key &&
                          file.name === asset.name &&
                          file.url === asset.url
                        )
                    )
                  )
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
                  handleResponseUpdated("newCourtOrderFiles", [
                    ...(editingResponse?.newCourtOrderFiles || []),
                    ...files.map(file => ({
                      name: file.name,
                      url: file.url,
                      mimeType: file.mimeType,
                      size: file.size
                    }))
                  ])
                }
              />
            )}
          </SectionDiv>
        </Col>
      </Row>
    );
  };

  const getDetailsPanel = () => {
    if (editingResponse?.hasCourtOrders === false) {
      return null;
    }
    return (
      <>
        <Col md={3} ms={12}>
          <CODAdminInputPanel
            label={"Court Order Type"}
            isRequired
            value={`${editingResponse?.courtOrderType || ""}`.trim()}
            valueFromDB={`${communityLegal?.CourtOrderType || ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <SynLuCourtOrderTypeSelector
                  isDisabled={isReadOnly === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={
                    `${editingResponse?.courtOrderType || ""}`.trim() === ""
                      ? []
                      : [`${editingResponse?.courtOrderType || ""}`.trim()]
                  }
                  onSelect={selected => {
                    if (!selected) {
                      handleResponseUpdated("courtOrderType", null);
                      return;
                    }
                    const selectedTypeCode = Array.isArray(selected)
                      ? selected[0].value
                      : selected.value;
                    handleResponseUpdated("courtOrderType", selectedTypeCode);
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={6} ms={12}>
          <CODAdminInputPanel
            label={"Court Order Date"}
            isRequired
            value={`${editingResponse?.courtOrderDate || ""}`.trim()}
            valueFromDB={
              `${communityLegal?.CourtOrderDate || ""}`.trim() === ""
                ? ""
                : moment
                    .tz(`${communityLegal?.CourtOrderDate || ""}`.trim(), "UTC")
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
                    `${editingResponse?.courtOrderDate || ""}`.trim() === ""
                      ? undefined
                      : moment
                          .tz(
                            `${editingResponse?.courtOrderDate || ""}`.trim(),
                            moment.tz.guess()
                          )
                          .toISOString()
                  }
                  dateFormat={"DD MMM YYYY"}
                  timeFormat={false}
                  onChange={selected =>
                    handleResponseUpdated(
                      "courtOrderDate",
                      typeof selected === "object"
                        ? selected.format("YYYY-MM-DD")
                        : null
                    )
                  }
                />
              );
            }}
          />
        </Col>
        <Col ms={12}>
          <CODAdminInputPanel
            label={"Court Order Details"}
            value={`${editingResponse?.newDetails || ""}`.trim()}
            valueFromDB={`${communityLegal?.CourtOrderDetails || ""}`.trim()}
            getComponent={isSameFromDB => {
              return (
                <FormControl
                  as="textarea"
                  disabled={isReadOnly === true}
                  rows={3}
                  isInvalid={isSameFromDB !== true}
                  value={`${editingResponse?.newDetails || ""}`.trim()}
                  onChange={event =>
                    handleResponseUpdated(
                      "newDetails",
                      `${event.target.value || ""}`.trim()
                    )
                  }
                />
              );
            }}
          />
        </Col>
      </>
    );
  };

  const getContent = () => {
    if (!editingResponse || isLoading === true) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <Row>
          <Col md={3} ms={12}>
            <CODAdminInputPanel
              label={"Has Court Order?"}
              isRequired
              value={editingResponse?.hasCourtOrders === true ? "YES" : "NO"}
              valueFromDB={
                `${communityLegal?.CourtOrderDate || ""}`.trim() !== ""
                  ? "YES"
                  : "NO"
              }
              getComponent={isSameFromDB => {
                return (
                  <FlagSelector
                    isDisabled={isReadOnly === true}
                    classname={`form-control ${
                      isSameFromDB === true ? "" : "is-invalid"
                    }`}
                    showAll={false}
                    value={editingResponse?.hasCourtOrders === true}
                    onSelect={value =>
                      setEditingResponse({
                        ...editingResponse,
                        hasCourtOrders:
                          // @ts-ignore
                          value && value.value === true ? true : false
                      })
                    }
                  />
                );
              }}
            />
          </Col>
          {getDetailsPanel()}
        </Row>
        {getFileContents()}
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODLegalPanel;
