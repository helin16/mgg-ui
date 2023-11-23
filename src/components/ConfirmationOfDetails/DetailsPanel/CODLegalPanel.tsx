import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iSynCommunityLegal from "../../../types/Synergetic/Community/iSynCommunityLegal";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import SynCommunityLegalService from "../../../services/Synergetic/Community/SynCommunityLegalService";
import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import Toaster, {TOAST_TYPE_ERROR} from "../../../services/Toaster";
import {Alert, Col, FormControl, Row} from "react-bootstrap";
import moment from "moment-timezone";
import { iCODCourtOrderResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import FlagSelector from "../../form/FlagSelector";
import ClientSideFileReader from "../../common/ClientSideFileReader";
import SectionDiv from "../../common/SectionDiv";
import DateTimePicker from "../../common/DateTimePicker";
import SynLuCourtOrderTypeSelector from "../../Community/SynLuCourtOrderTypeSelector";
import CODFileListTable from "../components/CODFileListTable";
import CODAdminDetailsSaveBtnPanel from '../CODAdmin/CODAdminDetailsSaveBtnPanel';
import {iErrorMap} from '../../form/FormErrorDisplay';

const Wrapper = styled.div``;

const CODLegalPanel = ({ response, isDisabled, getSubmitBtn, getCancelBtn, responseFieldName, isForParent }: ICODDetailsEditPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODCourtOrderResponse | null>(null);

  const [
    communityLegal,
    setCommunityLegal
  ] = useState<iSynCommunityLegal | null>(null);

  useEffect(() => {
    const res = response?.response || {};
    // @ts-ignore
    const resp = responseFieldName in res ? res[responseFieldName] : {};
    setEditingResponse(resp);

    const setEditingResponseForParentForm = (comLegal?: iSynCommunityLegal | null) => {
      if (isForParent !== true || Object.keys(resp).length > 0) {
        return;
      }
      setEditingResponse({
        hasCourtOrders: `${comLegal?.CourtOrderDate || ""}`.trim() !== '',
        courtOrderType: `${comLegal?.CourtOrderType || ''}`.trim(),
        courtOrderDate: `${comLegal?.CourtOrderDate || ""}`.trim(),
        newDetails: `${comLegal?.CourtOrderDetails || ""}`.trim(),
        newCourtOrderFiles: [],
      });
      return;
    }

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
        const legal = results.length <= 0 ? null : {
          ...results[0],
          CourtOrderDate: moment(`${results[0]?.CourtOrderDate || ""}`.trim()).year() <= 1900 ? '' : `${results[0]?.CourtOrderDate || ""}`.trim(),
        };
        // @ts-ignore
        setCommunityLegal(legal);
        // @ts-ignore
        setEditingResponseForParentForm(legal)
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

  const handleResponseUpdated = (fieldName: string, newValue: any) => {
    // @ts-ignore
    setEditingResponse({
      ...(editingResponse || {}),
      [fieldName]: newValue
    });
  };

  const getFileContents = () => {
    if (editingResponse?.hasCourtOrders !== true) {
      return null;
    }
    const eFiles = editingResponse?.newCourtOrderFiles || [];
    return (
      <Row>
        <Col>
          <SectionDiv>
            <Alert variant={'warning'}>For privacy reasons, your previous court order files won't be displayed here.</Alert>
            <CODFileListTable
              files={eFiles}
              isDisabled={isReadOnly === true}
              deletingFn={asset => {
                return new Promise(() =>
                  handleResponseUpdated(
                    "newCourtOrderFiles",
                    eFiles.filter(
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
                title={<h6>Drag and drop your court order files here</h6>}
                description={
                  <p>
                    <small>Only allow images and pdf files</small>
                  </p>
                }
                onFinished={files =>
                  handleResponseUpdated("newCourtOrderFiles", [
                    ...eFiles,
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

  const preSubmit = () => {
    const errors: iErrorMap = {};
    if (editingResponse?.hasCourtOrders === undefined) {
      errors.hasCourtOrders = 'Required';
    }

    if (editingResponse?.hasCourtOrders === true) {
      if (`${editingResponse.courtOrderType || ''}`.trim() === '') {
        errors.courtOrderType = 'Court Order Type is required';
      }
      if (`${editingResponse.courtOrderDate || ''}`.trim() === '') {
        errors.courtOrderDate = 'Court Order Date is required';
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


  const getDetailsPanel = () => {
    if (editingResponse?.hasCourtOrders !== true) {
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
            errMsg={'courtOrderType' in errorMap ? errorMap['courtOrderType'] : null}
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
            errMsg={'courtOrderDate' in errorMap ? errorMap['courtOrderDate'] : null}
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
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <Row>
          <Col md={3} ms={12}>
            <CODAdminInputPanel
              label={"Has Court Order?"}
              isRequired
              errMsg={'hasCourtOrders' in errorMap ? errorMap['hasCourtOrders'] : null}
              value={editingResponse?.hasCourtOrders === true ? "YES" : "NO"}
              valueFromDB={
                `${communityLegal?.CourtOrderDate || ""}`.trim() !== ''
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
                      // @ts-ignore
                      setEditingResponse({
                        ...(editingResponse || {}),
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

export default CODLegalPanel;
