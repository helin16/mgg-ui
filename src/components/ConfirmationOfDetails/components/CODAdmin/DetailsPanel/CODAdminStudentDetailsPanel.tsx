import iCODAdminStudentDetailsPanel from "./iCODEAdminDetailsPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../../../common/PageLoadingSpinner";
import iVStudent from "../../../../../types/Synergetic/iVStudent";
import SynVStudentService from "../../../../../services/Synergetic/Student/SynVStudentService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../../../services/Toaster";
import moment from "moment-timezone";
import DateTimePicker from "../../../../common/DateTimePicker";
import CODAdminInputPanel from "./CODAdminInputPanel";
import FlagSelector from "../../../../form/FlagSelector";
import YearLevelSelector from "../../../../student/YearLevelSelector";
import CODAdminDetailsSaveBtnPanel from "./CODAdminDetailsSaveBtnPanel";
import SynLuCountrySelector from "../../../../Community/SynLuCountrySelector";
import SynLuReligionSelector from "../../../../Community/SynLuReligionSelector";
import SynLuNationalitySelector from "../../../../Community/SynLuNationalitySelector";
import SynLuSchoolSelector from "../../../../Community/SynLuSchoolSelector";
import ConfirmationOfDetailsResponseService from "../../../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/makeReduxStore";
import CODAddressEditor from "../../CODAddressEditor";
import SynAddressService from "../../../../../services/Synergetic/SynAddressService";
import iSynAddress from '../../../../../types/Synergetic/iSynAddress';

const Wrapper = styled.div``;
const CODAdminStudentDetailsPanel = ({
  response,
  onSaved,
  onNext,
  onCancel
}: iCODAdminStudentDetailsPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iConfirmationOfDetailsResponse | null>(null);
  const [studentFromDB, setStudentFromDB] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBeenSyncd, setHasBeenSyncd] = useState(false);
  const [studentAddressFromDB, setStudentAddressFromDB] = useState<iSynAddress | null>(null);

  useEffect(() => {
    setEditingResponse({ ...response });
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
        include: 'Country,HomeCountry'
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
    setHasBeenSyncd(
      `${editingResponse?.response?.student?.syncToSynAt || ""}`.trim() !==
        "" &&
        `${editingResponse?.response?.student?.syncToSynById || ""}`.trim() !==
          ""
    );
  }, [editingResponse]);

  const updateStudentResponse = (fieldName: string, newValue: string) => {
    setEditingResponse({
      ...editingResponse,
      response: {
        ...(editingResponse?.response || {}),
        // @ts-ignore
        student: {
          ...(editingResponse?.response?.student || {}),
          [fieldName]: newValue
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
    isRequired?: boolean
  ) => {
    const respStudent = resp.response?.student || {};
    // @ts-ignore
    const value = fieldName in respStudent ? respStudent[fieldName] : "";
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
              disabled={hasBeenSyncd === true}
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
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Last Name:",
            editingResponse,
            "Surname",
            "StudentSurname",
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          {getStudentDetailsInputPanel(
            "Preferred Name:",
            editingResponse,
            "Given2",
            "StudentPreferred",
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
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
              return `${valueFromDB || ""}`.trim() === value.trim();
            }}
            getComponent={(isSameFromDB: boolean) => {
              const studentObj = editingResponse?.response?.student || null;
              return (
                <DateTimePicker
                  isDisabled={hasBeenSyncd === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  value={studentObj?.DateOfBirth || ""}
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
            isRequired={true}
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
                  isDisabled={hasBeenSyncd === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[
                    `${editingResponse.response?.student?.CountryOfBirthCode ||
                      ""}`.trim()
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
            value={editingResponse.response?.student?.ReligionCode || ""}
            valueFromDB={studentFromDB?.StudentReligionCode || ""}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentReligionCode || ""}`.trim() ===
                `${editingResponse.response?.student?.ReligionCode ||
                  ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <SynLuReligionSelector
                  isDisabled={hasBeenSyncd === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[
                    `${editingResponse.response?.student?.ReligionCode ||
                      ""}`.trim()
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
            isRequired={true}
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
                  isDisabled={hasBeenSyncd === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[
                    `${editingResponse.response?.student?.NationalityCode ||
                      ""}`.trim()
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
            isRequired={true}
            label={"Indigenous:"}
            value={
              editingResponse.response?.student?.IndigenousFlag === true
                ? "Yes"
                : "No"
            }
            valueFromDB={studentFromDB?.IndigenousFlag === true ? "Yes" : "No"}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.IndigenousFlag || ""}`.trim() ===
                `${editingResponse.response?.student?.IndigenousFlag ||
                  ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <FlagSelector
                  isDisabled={hasBeenSyncd === true}
                  showAll={false}
                  value={
                    `${editingResponse.response?.student?.IndigenousFlag ||
                      0}`.trim() === "1"
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
            value={
              editingResponse.response?.student?.StudentTSIFlag === true
                ? "Yes"
                : "No"
            }
            valueFromDB={studentFromDB?.StudentTSIFlag === true ? "Yes" : "No"}
            getIsSameFromDBFn={() => {
              return (
                `${studentFromDB?.StudentTSIFlag || ""}`.trim() ===
                `${editingResponse.response?.student?.StudentTSIFlag ||
                  ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <FlagSelector
                  showAll={false}
                  isDisabled={hasBeenSyncd === true}
                  value={
                    `${editingResponse.response?.student?.StudentTSIFlag ||
                      0}`.trim() === "1"
                  }
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
            value={`${editingResponse.response?.student
              ?.StudentEntryYearLevel || ""}`.trim()}
            valueFromDB={`${studentFromDB?.StudentYearLevel || ""}`.trim()}
            getIsSameFromDBFn={() => {
              return (
                `${editingResponse.response?.student?.StudentEntryYearLevel ||
                  ""}`.trim() ===
                `${studentFromDB?.StudentYearLevel || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <YearLevelSelector
                  isDisabled={hasBeenSyncd === true}
                  values={[
                    `${editingResponse.response?.student
                      ?.StudentEntryYearLevel || ""}`.trim()
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
                  isDisabled={hasBeenSyncd === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  value={
                    editingResponse.response?.student?.StudentEntryDate || ""
                  }
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
            value={`${editingResponse.response?.student
              ?.StudentPreviousSchool || ""}`.trim()}
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
                  isDisabled={hasBeenSyncd === true}
                  classname={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  values={[
                    `${editingResponse.response?.student
                      ?.StudentPreviousSchool || ""}`.trim()
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
            value={SynAddressService.convertAddressObjToStr(SynAddressService.getAddressObjFromCODResponse(editingResponse?.response?.student?.address?.postal || null))}
            valueFromDB={SynAddressService.convertAddressObjToStr(SynAddressService.getAddressObjFromSynAddress(studentAddressFromDB)?.postal || null)}
            getIsSameFromDBFn={() => {
              return (
                `${SynAddressService.convertAddressObjToStr(SynAddressService.getAddressObjFromSynAddress(studentAddressFromDB)?.postal || null)}`.trim() ===
                `${SynAddressService.convertAddressObjToStr(SynAddressService.getAddressObjFromCODResponse(editingResponse?.response?.student?.address?.postal || null)) || ""}`.trim()
              );
            }}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <CODAddressEditor
                  codeRespAddr={editingResponse.response?.student?.address}
                  synAddressId={studentFromDB?.AddressID}
                  isDisabled={hasBeenSyncd === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                />
              );
            }}
          />
        </Col>
      </Row>
      <CODAdminDetailsSaveBtnPanel
        onSubmitting={submitting => setIsSubmitting(submitting)}
        isLoading={isLoading || isSubmitting}
        onNext={onNext}
        syncdLabel={
          hasBeenSyncd !== true
            ? undefined
            : `Student Details Already Sync'd @ ${moment(
                editingResponse.response?.student?.syncToSynAt
              ).format("lll")} By ${
                editingResponse.response?.student?.syncToSynById
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

export default CODAdminStudentDetailsPanel;
