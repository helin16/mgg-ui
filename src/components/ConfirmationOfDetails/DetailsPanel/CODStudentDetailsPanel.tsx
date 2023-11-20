import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { iCODStudentResponse } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import Toaster from "../../../services/Toaster";
import moment from "moment-timezone";
import DateTimePicker from "../../common/DateTimePicker";
import CODAdminInputPanel from "../components/CODAdminInputPanel";
import FlagSelector from "../../form/FlagSelector";
import YearLevelSelector from "../../student/YearLevelSelector";
import SynLuCountrySelector from "../../Community/SynLuCountrySelector";
import SynLuReligionSelector from "../../Community/SynLuReligionSelector";
import SynLuNationalitySelector from "../../Community/SynLuNationalitySelector";
import SynLuSchoolSelector from "../../Community/SynLuSchoolSelector";
import CODAddressEditor from "../components/CODAddressEditor";
import SynAddressService from "../../../services/Synergetic/SynAddressService";
import iSynAddress from "../../../types/Synergetic/iSynAddress";
import { FlexContainer } from "../../../styles";
import CODAdminDetailsSaveBtnPanel from "../CODAdmin/CODAdminDetailsSaveBtnPanel";

const Wrapper = styled.div``;
const CODStudentDetailsPanel = ({
  response,
  isDisabled,
  getCancelBtn,
  getSubmitBtn,
  responseFieldName
}: ICODDetailsEditPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODStudentResponse | null>(null);
  const [studentFromDB, setStudentFromDB] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [
    studentAddressFromDB,
    setStudentAddressFromDB
  ] = useState<iSynAddress | null>(null);

  useEffect(() => {
    const res: any = (response?.response || {});
    setEditingResponse(responseFieldName in res ? res[responseFieldName] : null);
    const getData = async () => {
      const studentResults = await SynVStudentService.getVPastAndCurrentStudentAll(
        {
          where: JSON.stringify({ StudentID: response.StudentID }),
          perPage: 1,
          currentPage: 1,
          sort: "FileYear:DESC,FileSemester:DESC"
        }
      );
      if (isCanceled) {
        return;
      }
      const currentOrPastStudents = studentResults.data || [];
      const currentOrPastStudent =
        currentOrPastStudents.length > 0 ? currentOrPastStudents[0] : null;
      setStudentFromDB(currentOrPastStudent);
      if (!currentOrPastStudent) {
        return;
      }
      const addressResults = await SynAddressService.getAll({
        where: JSON.stringify({ AddressID: currentOrPastStudent.AddressID }),
        perPage: 1,
        currentPage: 1,
        include: "Country,HomeCountry"
      });
      const addresses = addressResults.data || [];
      if (addresses.length <= 0) {
        return;
      }
      setStudentAddressFromDB(addresses[0]);
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

  const updateStudentResponse = (fieldName: string, newValue: string) => {
    // @ts-ignore
    setEditingResponse({
      ...(editingResponse || {}),
      [fieldName]: newValue
    });
  };

  const getValueFromStudentDB = (fieldName: string) => {
    return studentFromDB && fieldName in studentFromDB
      ? // @ts-ignore
        studentFromDB[fieldName]
      : "";
  };

  const getStudentDetailsInputPanel = (
    label: string,
    fieldName: string,
    dbFieldName: string,
    isRequired?: boolean
  ) => {
    const value =
      editingResponse && fieldName in editingResponse
        // @ts-ignore
        ? editingResponse[fieldName]
        : "";
    return (
      <CODAdminInputPanel
        label={label}
        value={value}
        isRequired={isRequired}
        valueFromDB={getValueFromStudentDB(dbFieldName)}
        getComponent={(isSameFromDB: boolean) => {
          return (
            <FormControl
              isInvalid={!isSameFromDB}
              disabled={isReadOnly === true}
              value={value || ""}
              onChange={event => {
                updateStudentResponse(fieldName, event.target?.value || "");
              }}
            />
          );
        }}
      />
    );
  };

  const formatDateTimeString = (dateString?: string) => {
    return `${dateString || ""}`.trim() === ""
      ? ""
      : moment(dateString || "").format("DD MMM YYYY");
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "First Name:",
            "Given1",
            "StudentGiven1",
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Last Name:",
            "Surname",
            "StudentSurname",
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Preferred Name:",
            "Given2",
            "StudentPreferred",
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Date of Birth:"}
            value={editingResponse?.DateOfBirth || ""}
            valueFromDB={formatDateTimeString(
              getValueFromStudentDB("StudentBirthDate")
            )}
            getIsSameFromDBFn={() => {
              const valueFromDB = getValueFromStudentDB("StudentBirthDate");
              const value = editingResponse?.DateOfBirth || "";
              return `${valueFromDB || ""}`.trim() === value.trim();
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <DateTimePicker
                  isDisabled={isReadOnly === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  value={
                    `${editingResponse?.DateOfBirth || ""}`.trim() === ""
                      ? undefined
                      : moment
                          .tz(
                            `${editingResponse?.DateOfBirth || ""}`.trim(),
                            moment.tz.guess()
                          )
                          .toISOString()
                  }
                  dateFormat={"DD MMM YYYY"}
                  timeFormat={false}
                  onChange={selected => {
                    if (typeof selected !== "object") {
                      return;
                    }
                    updateStudentResponse(
                      "DateOfBirth",
                      selected.format("YYYY-MM-DD")
                    );
                  }}
                />
              );
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Country of Birth:"}
            value={editingResponse?.CountryOfBirthCode || ""}
            valueFromDB={studentFromDB?.StudentCountryOfBirthCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentCountryOfBirthCode || ""}`.trim() ===
                `${editingResponse?.CountryOfBirthCode || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuCountrySelector
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[
                    `${editingResponse?.CountryOfBirthCode || ""}`.trim()
                  ]}
                  onSelect={option => {
                    updateStudentResponse(
                      "CountryOfBirthCode",
                      // @ts-ignore
                      option === null
                        ? []
                        : Array.isArray(option)
                        ? option.map(opt => `${opt.value}`)
                        : [`${option.value}`]
                    );
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Religion:"}
            value={editingResponse?.ReligionCode || ""}
            valueFromDB={studentFromDB?.StudentReligionCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentReligionCode || ""}`.trim() ===
                `${editingResponse?.ReligionCode || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuReligionSelector
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[`${editingResponse?.ReligionCode || ""}`.trim()]}
                  onSelect={option => {
                    updateStudentResponse(
                      "ReligionCode",
                      // @ts-ignore
                      option === null
                        ? []
                        : Array.isArray(option)
                        ? option.map(opt => `${opt.value}`)
                        : [`${option.value}`]
                    );
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Mobile:",
            "MobilePhone",
            "StudentMobilePhone"
          )}
        </Col>
      </Row>
      <Row>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Nationality:"}
            value={editingResponse?.NationalityCode || ""}
            valueFromDB={studentFromDB?.StudentNationalityCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentNationalityCode || ""}`.trim() ===
                `${editingResponse?.NationalityCode || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuNationalitySelector
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[`${editingResponse?.NationalityCode || ""}`.trim()]}
                  onSelect={option => {
                    updateStudentResponse(
                      "NationalityCode",
                      // @ts-ignore
                      option === null
                        ? []
                        : Array.isArray(option)
                        ? option.map(opt => `${opt.value}`)
                        : [`${option.value}`]
                    );
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Indigenous:"}
            value={editingResponse?.IndigenousFlag === true ? "Yes" : "No"}
            valueFromDB={studentFromDB?.IndigenousFlag === true ? "Yes" : "No"}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.IndigenousFlag || ""}`.trim() ===
                `${editingResponse?.IndigenousFlag || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <FlagSelector
                  isDisabled={isReadOnly === true}
                  showAll={false}
                  value={
                    `${editingResponse?.IndigenousFlag || 0}`.trim() === "1" ||
                    editingResponse?.IndigenousFlag === true
                  }
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onSelect={option => {
                    updateStudentResponse(
                      "IndigenousFlag",
                      // @ts-ignore
                      option?.value === true
                    );
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Torres Strait Islander:"}
            value={editingResponse?.StudentTSIFlag === true ? "Yes" : "No"}
            valueFromDB={studentFromDB?.StudentTSIFlag === true ? "Yes" : "No"}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentTSIFlag || ""}`.trim() ===
                `${editingResponse?.StudentTSIFlag || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <FlagSelector
                  value={
                    `${editingResponse?.StudentTSIFlag || 0}`.trim() === "1" ||
                    editingResponse?.StudentTSIFlag === true
                  }
                  showAll={false}
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onSelect={option => {
                    updateStudentResponse(
                      "StudentTSIFlag",
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
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Entry Year Level:"}
            value={`${editingResponse?.StudentEntryYearLevel || ""}`.trim()}
            valueFromDB={`${studentFromDB?.StudentYearLevel || ""}`.trim()}
            getIsSameFromDBFn={() => {
              return (
                `${editingResponse?.StudentEntryYearLevel || ""}`.trim() ===
                `${studentFromDB?.StudentYearLevel || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <YearLevelSelector
                  isDisabled={isReadOnly === true}
                  values={[
                    `${editingResponse?.StudentEntryYearLevel || ""}`.trim()
                  ]}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onSelect={option => {
                    updateStudentResponse(
                      "StudentEntryYearLevel",
                      // @ts-ignore
                      option === null
                        ? []
                        : Array.isArray(option)
                        ? option.map(opt => `${opt.value}`)
                        : [`${option.value}`]
                    );
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Entry Date:"}
            value={editingResponse?.StudentEntryDate || ""}
            valueFromDB={formatDateTimeString(
              getValueFromStudentDB("StudentEntryDate")
            )}
            getIsSameFromDBFn={() => {
              const valueFromDB = formatDateTimeString(
                getValueFromStudentDB("StudentEntryDate")
              );
              return (
                `${valueFromDB || ""}`.trim() ===
                formatDateTimeString(editingResponse?.StudentEntryDate || "")
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <DateTimePicker
                  isDisabled={isReadOnly === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  value={editingResponse?.StudentEntryDate || ""}
                  timeFormat={false}
                  dateFormat={"DD MMM YYYY"}
                  onChange={selected => {
                    if (typeof selected !== "object") {
                      return;
                    }
                    updateStudentResponse(
                      "StudentEntryDate",
                      selected.toISOString()
                    );
                  }}
                />
              );
            }}
          />
        </Col>
        <Col md={6} xs={12}>
          <CODAdminInputPanel
            label={"Previous School:"}
            value={`${editingResponse?.StudentPreviousSchool || ""}`.trim()}
            valueFromDB={`${studentFromDB?.StudentPreviousSchoolDescription ||
              ""}`.trim()}
            getIsSameFromDBFn={() => {
              return (
                `${editingResponse?.StudentPreviousSchool || ""}`.trim() ===
                `${studentFromDB?.StudentPreviousSchoolCode || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuSchoolSelector
                  isDisabled={isReadOnly === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[
                    `${editingResponse?.StudentPreviousSchool || ""}`.trim()
                  ]}
                  onSelect={option => {
                    updateStudentResponse(
                      "StudentPreviousSchool",
                      // @ts-ignore
                      option === null
                        ? []
                        : Array.isArray(option)
                        ? option.map(opt => `${opt.value}`)
                        : [`${option.value}`]
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
            label={"Address:"}
            value={SynAddressService.convertAddressObjToStr(
              SynAddressService.getAddressObjFromCODResponse(
                editingResponse?.address?.postal || null
              )
            )}
            valueFromDB={SynAddressService.convertAddressObjToStr(
              SynAddressService.getAddressObjFromSynAddress(
                studentAddressFromDB
              )?.postal || null
            )}
            getIsSameFromDBFn={() => {
              return (
                `${SynAddressService.convertAddressObjToStr(
                  SynAddressService.getAddressObjFromSynAddress(
                    studentAddressFromDB
                  )?.postal || null
                )}`.trim() ===
                `${SynAddressService.convertAddressObjToStr(
                  SynAddressService.getAddressObjFromCODResponse(
                    editingResponse?.address?.postal || null
                  )
                ) || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <CODAddressEditor
                  codeRespAddr={editingResponse?.address}
                  synAddressId={studentFromDB?.AddressID}
                  isDisabled={isReadOnly === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onChange={newAddress => {
                    // @ts-ignore
                    updateStudentResponse("address", newAddress);
                  }}
                />
              );
            }}
          />
        </Col>
      </Row>
      <FlexContainer className={"justify-content-between"}>
        <div />
        <CODAdminDetailsSaveBtnPanel
          isLoading={isLoading || isSubmitting}
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
      </FlexContainer>
    </Wrapper>
  );
};

export default CODStudentDetailsPanel;
