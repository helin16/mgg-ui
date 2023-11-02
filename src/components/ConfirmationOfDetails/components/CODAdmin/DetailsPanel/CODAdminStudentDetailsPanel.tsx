import iCODAdminStudentDetailsPanel from "./iCODEAdminDetailsPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../../../common/PageLoadingSpinner";
import iVStudent from "../../../../../types/Synergetic/iVStudent";
import SynVStudentService from "../../../../../services/Synergetic/Student/SynVStudentService";
import Toaster from "../../../../../services/Toaster";
import moment from "moment-timezone";
import DateTimePicker from "../../../../common/DateTimePicker";
import CODAdminInputPanel from "./CODAdminInputPanel";
import FlagSelector from "../../../../form/FlagSelector";
import YearLevelSelector from "../../../../student/YearLevelSelector";
import CODAdminDetailsSaveBtnPanel from "./CODAdminDetailsSaveBtnPanel";
import SynLuCountrySelector from "../../../../Community/SynLuCountrySelector";
import SynLuReligionSelector from '../../../../Community/SynLuReligionSelector';
import SynLuNationalitySelector from '../../../../Community/SynLuNationalitySelector';
import SynLuSchoolSelector from '../../../../Community/SynLuSchoolSelector';

const Wrapper = styled.div``;
const CODAdminStudentDetailsPanel = ({
  response,
  onSaved,
  onCancel
}: iCODAdminStudentDetailsPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iConfirmationOfDetailsResponse | null>(null);
  const [studentFromDB, setStudentFromDB] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    setEditingResponse({ ...response });
    setIsLoading(true);
    Promise.all([
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({ StudentID: response.StudentID }),
        perPage: 1,
        currentPage: 1,
        sort: "FileYear:DESC,FileSemester:DESC"
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const currentOrPastStudents = resp[0].data || [];
        setStudentFromDB(
          currentOrPastStudents.length > 0 ? currentOrPastStudents[0] : null
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

  const updateStudentResponse = (fieldName: string, newValue: string) => {
    // @ts-ignore
    setEditingResponse({
      ...editingResponse,
      response: {
        ...(editingResponse?.response || {}),
        student: {
          ...(editingResponse?.response?.student || {}),
          [fieldName]: newValue,
        }
      }
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
    resp: iConfirmationOfDetailsResponse,
    fieldName: string,
    dbFieldName: string,
  ) => {
    const respStudent = resp.response.student || {};
    // @ts-ignore
    const value = fieldName in respStudent ? respStudent[fieldName] : "";
    return (
      <CODAdminInputPanel
        label={label}
        value={value}
        valueFromDB={getValueFromStudentDB(dbFieldName)}
        getComponent={(isSameFromDB: boolean) => {
          return (
            <FormControl
              isInvalid={!isSameFromDB}
              value={value}
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

  if (!editingResponse || isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Row>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "First Name:",
            editingResponse,
            "Given1",
            "StudentGiven1",
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Last Name:",
            editingResponse,
            "Surname",
            "StudentSurname",
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Preferred Name:",
            editingResponse,
            "Given2",
            "StudentPreferred"
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            label={"Date of Birth:"}
            value={editingResponse.Student?.StudentBirthDate || ""}
            valueFromDB={formatDateTimeString(
              getValueFromStudentDB("StudentBirthDate")
            )}
            getIsSameFromDBFn={() => {
              const valueFromDB = formatDateTimeString(
                getValueFromStudentDB("StudentBirthDate")
              );
              const studentObj = editingResponse?.response?.student || {};
              const value = formatDateTimeString(
                "DateOfBirth" in studentObj
                  ? // @ts-ignore
                  studentObj["DateOfBirth"]
                  : ""
              );
              return (
                `${valueFromDB || ""}`.trim() === value.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              const studentObj = editingResponse?.response?.student || {};
              return (
                <DateTimePicker
                  className={`form-control ${isSameFromDB === true ? "" : "is-invalid"}`}
                  value={studentObj.DateOfBirth || ""}
                  timeFormat={false}
                  dateFormat={"DD MMM YYYY"}
                  onChange={selected => {
                    if (typeof selected !== "object") {
                      return;
                    }
                    updateStudentResponse(
                      "DateOfBirth",
                      selected.toISOString()
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
            label={"Country of Birth:"}
            value={editingResponse.response?.student?.CountryOfBirthCode || ""}
            valueFromDB={studentFromDB?.StudentCountryOfBirthCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentCountryOfBirthCode || ""}`.trim() ===
                `${editingResponse.response?.student?.CountryOfBirthCode ||
                  ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuCountrySelector
                  classname={isSameFromDB === true ? "" : "is-invalid"}
                  values={[
                    `${editingResponse.response?.student?.CountryOfBirthCode || ""}`.trim()
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
            label={"Religion:"}
            value={editingResponse.response?.student?.ReligionCode || ""}
            valueFromDB={studentFromDB?.StudentReligionCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentReligionCode || ""}`.trim() ===
                `${editingResponse.response?.student?.ReligionCode || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuReligionSelector
                  classname={isSameFromDB === true ? "" : "is-invalid"}
                  values={[
                    `${editingResponse.response?.student?.ReligionCode || ""}`.trim()
                  ]}
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
            editingResponse,
            "MobilePhone",
            "StudentMobilePhone"
          )}
        </Col>
      </Row>
      <Row>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            label={"Nationality:"}
            value={editingResponse.response?.student?.NationalityCode || ""}
            valueFromDB={studentFromDB?.StudentNationalityCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentNationalityCode || ""}`.trim() ===
                `${editingResponse.response?.student?.NationalityCode ||
                  ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuNationalitySelector
                  classname={isSameFromDB === true ? "" : "is-invalid"}
                  values={[
                    `${editingResponse.response?.student?.NationalityCode || ""}`.trim()
                  ]}
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
            label={"Indigenous:"}
            value={
              editingResponse.response?.student?.IndigenousFlag === true ? "Yes" : "No"
            }
            valueFromDB={studentFromDB?.IndigenousFlag === true ? "Yes" : "No"}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.IndigenousFlag || ""}`.trim() ===
                `${editingResponse.response?.student?.IndigenousFlag || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <FlagSelector
                  showAll={false}
                  value={editingResponse.response?.student?.IndigenousFlag}
                  classname={isSameFromDB === true ? "" : "is-invalid"}
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
            label={"Torres Strait Islander:"}
            value={
              editingResponse.response?.student?.StudentTSIFlag === true ? "Yes" : "No"
            }
            valueFromDB={studentFromDB?.StudentTSIFlag === true ? "Yes" : "No"}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentTSIFlag || ""}`.trim() ===
                `${editingResponse.response?.student?.StudentTSIFlag || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <FlagSelector
                  showAll={false}
                  value={editingResponse.response?.student?.StudentTSIFlag}
                  classname={isSameFromDB === true ? "" : "is-invalid"}
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
            label={"Entry Year Level:"}
            value={`${editingResponse.response?.student?.StudentEntryYearLevel || ""}`.trim()}
            valueFromDB={`${studentFromDB?.StudentYearLevel || ""}`.trim()}
            getIsSameFromDBFn={() => {
              return (
                `${editingResponse.response?.student?.StudentEntryYearLevel || ""}`.trim() ===
                `${studentFromDB?.StudentYearLevel || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <YearLevelSelector
                  values={[
                    `${editingResponse.response?.student?.StudentEntryYearLevel || ""}`.trim()
                  ]}
                  classname={isSameFromDB === true ? "" : "is-invalid"}
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
            label={"Entry Date:"}
            value={editingResponse.response?.student?.StudentEntryDate || ""}
            valueFromDB={formatDateTimeString(
              getValueFromStudentDB("StudentEntryDate")
            )}
            getIsSameFromDBFn={() => {
              const valueFromDB = formatDateTimeString(
                getValueFromStudentDB("StudentEntryDate")
              );
              const studentObj = editingResponse?.response?.student || {};
              return (
                `${valueFromDB || ""}`.trim() ===
                formatDateTimeString(
                  "StudentEntryDate" in studentObj
                    ? // @ts-ignore
                      studentObj["StudentEntryDate"]
                    : ""
                )
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <DateTimePicker
                  className={isSameFromDB === true ? "" : "is-invalid"}
                  value={editingResponse.response?.student?.StudentEntryDate || ""}
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
            value={`${editingResponse.response?.student?.StudentPreviousSchool || ""}`.trim()}
            valueFromDB={`${studentFromDB?.StudentPreviousSchoolDescription ||
              ""}`.trim()}
            getIsSameFromDBFn={() => {
              return (
                `${editingResponse.response?.student?.StudentPreviousSchool ||
                  ""}`.trim() ===
                `${studentFromDB?.StudentPreviousSchoolCode || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuSchoolSelector
                  classname={isSameFromDB === true ? "" : "is-invalid"}
                  values={[
                    `${editingResponse.response?.student?.StudentPreviousSchool || ""}`.trim()
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
      <CODAdminDetailsSaveBtnPanel
        // syncdLabel={editingResponse.Student.Syn}
        editingResponse={editingResponse}
        onSaved={onSaved}
        onCancel={onCancel}
      />
    </Wrapper>
  );
};

export default CODAdminStudentDetailsPanel;
