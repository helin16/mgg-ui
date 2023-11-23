import ICODDetailsEditPanel from "./iCODDetailsEditPanel";
import styled from "styled-components";
import { Col, FormControl, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  iCODStudentResponse
} from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import Toaster, {TOAST_TYPE_ERROR} from "../../../services/Toaster";
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
import SynVFutureStudentService from "../../../services/Synergetic/SynVFutureStudentService";
import { SYN_NATIONALITY_CODE_AUSTRALIA } from "../../../types/Synergetic/Lookup/iSynLuNationality";
import {iErrorMap} from '../../form/FormErrorDisplay';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';

const Wrapper = styled.div``;
const CODStudentDetailsPanel = ({
  response,
  isDisabled,
  getCancelBtn,
  getSubmitBtn,
  responseFieldName,
  isForParent = false,
}: ICODDetailsEditPanel) => {
  const [
    editingResponse,
    setEditingResponse
  ] = useState<iCODStudentResponse | null>(null);
  const [studentFromDB, setStudentFromDB] = useState<iVStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const [
    studentAddressFromDB,
    setStudentAddressFromDB
  ] = useState<iSynAddress | null>(null);

  useEffect(() => {
    const res: any = response?.response || {};

    const currentEditingResponse =
      responseFieldName in res ? res[responseFieldName] : null;
    setEditingResponse(currentEditingResponse);

    const setEditingResponseForParentView = (
      student: iVStudent,
      address?: iSynAddress | null,
      communityProfile?: iSynCommunity | null
    ) => {
      if (
        isForParent !== true ||
        Object.keys(currentEditingResponse || {}).length > 0
      ) {
        return;
      }
      const birthDate = `${student.StudentBirthDate || ""}`.trim() === '' ? `${communityProfile?.BirthDate || ''}`.trim () : `${student.StudentBirthDate || ""}`.trim();

      setEditingResponse({
        ID: response.StudentID,
        Surname: `${student.StudentSurname || ""}`.trim() === '' ? `${communityProfile?.Surname || ''}`.trim () : `${student.StudentSurname || ""}`.trim(), //`${student.StudentSurname || ""}`.trim(),
        Given1: `${student.StudentGiven1 || ""}`.trim() === '' ? `${communityProfile?.Given1 || ''}`.trim () : `${student.StudentGiven1 || ""}`.trim(), //`${student.StudentGiven1 || ""}`.trim(),
        Given2: `${student.StudentGiven2 || ""}`.trim() === '' ? `${communityProfile?.Given2 || ''}`.trim () : `${student.StudentGiven2 || ""}`.trim(), //`${student.StudentGiven2 || ""}`.trim(),
        Preferred: `${student.StudentPreferred || ""}`.trim() === '' ? `${communityProfile?.Preferred || ''}`.trim () : `${student.StudentPreferred || ""}`.trim(), //`${student.StudentPreferred || ""}`.trim(),
        MobilePhone: `${student.StudentMobilePhone || ""}`.trim() === '' ? `${communityProfile?.MobilePhone || ''}`.trim () : `${student.StudentMobilePhone || ""}`.trim(), //`${student.StudentMobilePhone || ""}`.trim(),
        DateOfBirth:
          birthDate === ""
            ? ""
            : moment(birthDate)
                .utc()
                .format("YYYY-MM-DD"),
        CountryOfBirthCode: `${student.StudentCountryOfBirthCode || ""}`.trim() === '' ? `${communityProfile?.CountryOfBirthCode || ''}`.trim () : `${student.StudentCountryOfBirthCode || ""}`.trim(),//`${student.StudentCountryOfBirthCode || ""}`.trim(),
        NationalityCode: `${student.StudentNationalityCode || ""}`.trim() === '' ? `${communityProfile?.NationalityCode || ''}`.trim () : `${student.StudentNationalityCode || ""}`.trim(), //`${student.StudentNationalityCode || ""}`.trim(),
        ReligionCode: `${student.StudentReligionCode || ""}`.trim() === '' ? `${communityProfile?.ReligionCode || ''}`.trim () : `${student.StudentReligionCode || ""}`.trim(), //`${student.StudentReligionCode || ""}`.trim(),
        HomeLanguageCode: `${student.StudentHomeLanguageCode || ""}`.trim() === '' ? `${communityProfile?.HomeLanguageCode || ''}`.trim () : `${student.StudentHomeLanguageCode || ""}`.trim(),
        IndigenousFlag: student.IndigenousFlag === true,
        StudentTSIFlag: student.StudentTSIFlag === true,
        StudentsVisaType: student.StudentsVisaType,
        StudentsVisaExpiryDate: student.StudentsVisaExpiryDate,
        StudentVisaNumber: student.StudentVisaNumber,
        StudentEntryYearLevel: student.StudentEntryYearLevel,
        StudentEntryDate: `${student.StudentEntryDate || ""}`.trim() === ""
          ? ""
          : moment(`${student.StudentEntryDate || ""}`.trim())
            .utc()
            .format("YYYY-MM-DD"),
        StudentPreviousSchool: student.StudentPreviousSchool,
        address: {
          AddressID: address?.AddressID,
          homeAndPostalSame: address?.HomeAddressSameFlag === true,
          home: {
            full: `${address?.HomeAddressFull || ''}`,
            object: {
              street: `${address?.HomeAddress1 || ''}`,
              suburb: `${address?.HomeSuburb || ''}`,
              state: `${address?.HomeState || ''}`,
              postcode: `${address?.HomePostCode || ''}`,
              countryCode: `${address?.HomeCountryCode || ''}`,
            }
          },
          postal: {
            full: `${address?.HomeAddressFull || ''}`,
            object: {
              street: `${address?.Address1 || ''}`,
              suburb: `${address?.Suburb || ''}`,
              state: `${address?.State || ''}`,
              postcode: `${address?.PostCode || ''}`,
              countryCode: `${address?.CountryCode || ''}`,
            }
          }
        },
        isAustralian:
          student.StudentNationalityCode === SYN_NATIONALITY_CODE_AUSTRALIA,
        is_future: student.isFuture === true,
        is_international: student.FullFeeFlag === true
      });
    };

    const getData = async () => {
      const results = await Promise.all([
        SynVStudentService.getVPastAndCurrentStudentAll({
          where: JSON.stringify({ StudentID: response.StudentID }),
          perPage: 1,
          currentPage: 1,
          sort: "FileYear:DESC,FileSemester:DESC"
        }),
        SynVFutureStudentService.getAll({
          where: JSON.stringify({ FutureID: response.StudentID }),
          perPage: 1,
          currentPage: 1
        }),
        SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({ ID: response.StudentID }),
          perPage: 1,
          currentPage: 1
        })
      ]);
      const currentOrPastStudents = results[0].data || [];
      const futureStudents = results[1].data || [];
      const currentOrPastStudent =
        currentOrPastStudents.length > 0 ? currentOrPastStudents[0] : null;
      const futureStudent =
        futureStudents.length > 0 ? futureStudents[0] : null;
      if (isCanceled) {
        return;
      }
      const student =
        currentOrPastStudent === null
          ? futureStudent === null
            ? null
            : SynVFutureStudentService.mapFutureStudentToCurrent(futureStudent)
          : currentOrPastStudent;
      setStudentFromDB(student);
      if (!student) {
        return;
      }
      const communityProfiles = results[2].data || [];
      const communityProfile = communityProfiles.length <= 0 ? null : communityProfiles[0];
      const addressResults = await SynAddressService.getAll({
        where: JSON.stringify({ AddressID: [student.AddressID, communityProfile?.AddressID].filter(id => `${id || ''}`.trim() !== '') }),
        perPage: 1,
        currentPage: 1,
        include: "Country,HomeCountry"
      });
      const addresses = addressResults.data || [];
      if (addresses.length <= 0) {
        setEditingResponseForParentView(student, undefined, communityProfile);
        return;
      }
      setStudentAddressFromDB(addresses[0]);
      setEditingResponseForParentView(student, addresses[0], communityProfile);
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


  const updateStudentResponse = (fieldName: string, newValue: any) => {
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
        ? // @ts-ignore
          editingResponse[fieldName]
        : "";
    return (
      <CODAdminInputPanel
        label={label}
        value={value}
        isRequired={isRequired}
        valueFromDB={getValueFromStudentDB(dbFieldName)}
        errMsg={fieldName in errorMap ? errorMap[fieldName] : null}
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

  const getExtraInfoPanel = () => {
    if (editingResponse?.NationalityCode === SYN_NATIONALITY_CODE_AUSTRALIA) {
      return (
        <>
          <Col md={3} sm={6} xs={12}>
            <CODAdminInputPanel
              isRequired={true}
              label={"Indigenous:"}
              errMsg={'IndigenousFlag' in errorMap ? errorMap['IndigenousFlag'] : null}
              value={editingResponse?.IndigenousFlag === true ? "Yes" : "No"}
              valueFromDB={
                studentFromDB?.IndigenousFlag === true ? "Yes" : "No"
              }
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
                      `${editingResponse?.IndigenousFlag || 0}`.trim() ===
                        "1" || editingResponse?.IndigenousFlag === true
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
              errMsg={'StudentTSIFlag' in errorMap ? errorMap['StudentTSIFlag'] : null}
              label={"Torres Strait Islander:"}
              value={editingResponse?.StudentTSIFlag === true ? "Yes" : "No"}
              valueFromDB={
                studentFromDB?.StudentTSIFlag === true ? "Yes" : "No"
              }
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
                      `${editingResponse?.StudentTSIFlag || 0}`.trim() ===
                        "1" || editingResponse?.StudentTSIFlag === true
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
        </>
      );
    }
    return null;
  };

  const preSubmit = () => {
    const errors: iErrorMap = {};
    if (`${editingResponse?.Surname || ''}`.trim() === '') {
      errors.Surname = 'Last Name is required.'
    }
    if (`${editingResponse?.Given1 || ''}`.trim() === '') {
      errors.Given1 = 'First Name is required.'
    }
    if (`${editingResponse?.Preferred || ''}`.trim() === '') {
      errors.Preferred = 'Preferred Name is required.'
    }

    if (`${editingResponse?.CountryOfBirthCode || ''}`.trim() === '') {
      errors.CountryOfBirthCode = 'CountryOfBirth is required.'
    }

    if (`${editingResponse?.ReligionCode || ''}`.trim() === '') {
      errors.ReligionCode = 'Religion is required.'
    }

    if (`${editingResponse?.NationalityCode || ''}`.trim() === '') {
      errors.NationalityCode = 'Nationality is required.'
    }

    if (`${editingResponse?.NationalityCode || ''}`.trim() === SYN_NATIONALITY_CODE_AUSTRALIA) {
      if (editingResponse?.IndigenousFlag === undefined || editingResponse?.IndigenousFlag === null) {
        errors.IndigenousFlag = 'Indigenous Flag is required.'
      }

      if (editingResponse?.StudentTSIFlag === undefined || editingResponse?.StudentTSIFlag === null) {
        errors.StudentTSIFlag = 'TSI Flag is required.'
      }
    }

    if (`${editingResponse?.StudentEntryDate || ''}`.trim() === '') {
      errors.StudentEntryDate = 'Entry Date is required.'
    }
    if (`${editingResponse?.StudentEntryYearLevel || ''}`.trim() === '') {
      errors.StudentEntryYearLevel = 'Entry Year Level is required.'
    }

    if (!editingResponse?.address || `${editingResponse?.address?.postal?.object?.street || ''}`.trim() === '') {
      errors.address = 'Address is required.'
    }

    setErrorMap(errors);
    const hasPassed = Object.keys(errors).length <= 0;
    if (hasPassed !== true) {
      Toaster.showToast('Some errors in the form, please correct them before you move to the next step.', TOAST_TYPE_ERROR)
    }
    return hasPassed;
  }

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
            "Preferred",
            "StudentPreferred",
            true
          )}
        </Col>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Date of Birth:"}
            errMsg={'DateOfBirth' in errorMap ? errorMap['DateOfBirth'] : null}
            value={
              `${editingResponse?.DateOfBirth || ""}`.trim() === ""
                ? ""
                : moment
                    .tz(
                      `${editingResponse?.DateOfBirth || ""}`.trim(),
                      moment.tz.guess()
                    )
                    .format("DD MMM YYYY")
            }
            valueFromDB={moment(getValueFromStudentDB("StudentBirthDate"))
              .utc()
              .format("DD MMM YYYY")}
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
            errMsg={'CountryOfBirthCode' in errorMap ? errorMap['CountryOfBirthCode'] : null}
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
                        ? ''
                        : (Array.isArray(option) && option.length > 0)
                          ? `${option[0].value || ''}`
                          // @ts-ignore
                          : `${option?.value}`
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
            errMsg={'ReligionCode' in errorMap ? errorMap['CountryOfBirthCode'] : null}
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
                      option === null
                        ? ''
                        : (Array.isArray(option) && option.length > 0)
                        ? `${option[0].value || ''}`
                        // @ts-ignore
                        : `${option?.value}`
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
            errMsg={'NationalityCode' in errorMap ? errorMap['NationalityCode'] : null}
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
                    const newNationalityCode =
                      option === null
                        ? ''
                        : (Array.isArray(option) && option.length > 0)
                          ? `${option[0].value || ''}`
                          // @ts-ignore
                          : `${option?.value}`;
                    // @ts-ignore
                    setEditingResponse({
                      ...(editingResponse || {}),
                      NationalityCode: newNationalityCode,
                      isAustralian: newNationalityCode === SYN_NATIONALITY_CODE_AUSTRALIA
                    });
                  }}
                />
              );
            }}
          />
        </Col>
        {getExtraInfoPanel()}
      </Row>
      <Row>
        <Col md={3} sm={6} xs={12}>
          <CODAdminInputPanel
            isRequired={true}
            label={"Entry Year Level:"}
            errMsg={'StudentEntryYearLevel' in errorMap ? errorMap['StudentEntryYearLevel'] : null}
            value={`${editingResponse?.StudentEntryYearLevel || ""}`.trim()}
            valueFromDB={`${studentFromDB?.StudentEntryYearLevel || ""}`.trim()}
            getIsSameFromDBFn={() => {
              return (
                `${editingResponse?.StudentEntryYearLevel || ""}`.trim() ===
                `${studentFromDB?.StudentEntryYearLevel || ""}`.trim()
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
                        ? ''
                        : (Array.isArray(option) && option.length > 0)
                          ? `${option[0].value || ''}`
                          // @ts-ignore
                          : `${option?.value}`
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
            errMsg={'StudentEntryDate' in errorMap ? errorMap['StudentEntryDate'] : null}
            value={
              `${editingResponse?.StudentEntryDate || ""}`.trim() === ""
                ? ""
                : moment
                    .tz(
                      `${editingResponse?.StudentEntryDate || ""}`.trim(),
                      moment.tz.guess()
                    )
                    .format("DD MMM YYYY")
            }
            valueFromDB={moment(getValueFromStudentDB("StudentEntryDate"))
              .utc()
              .format("DD MMM YYYY")}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <DateTimePicker
                  isDisabled={isReadOnly === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  value={
                    `${editingResponse?.StudentEntryDate || ""}`.trim() === ""
                      ? undefined
                      : moment
                        .tz(
                          `${editingResponse?.StudentEntryDate || ""}`.trim(),
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
                      "StudentEntryDate",
                      selected.format("YYYY-MM-DD")
                    );
                  }}
                />
              )
            }}
          />
        </Col>
        <Col md={6} xs={12}>
          <CODAdminInputPanel
            label={"Previous School:"}
            errMsg={'StudentPreviousSchool' in errorMap ? errorMap['StudentPreviousSchool'] : null}
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
                        ? ''
                        : (Array.isArray(option) && option.length > 0)
                          ? `${option[0].value || ''}`
                          // @ts-ignore
                          : `${option?.value}`
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
            errMsg={'address' in errorMap ? errorMap['address'] : null}
            getComponent={(isSameFromDB: boolean) => {
              return (
                <CODAddressEditor
                  codeRespAddr={editingResponse?.address}
                  synAddressId={editingResponse?.address?.AddressID || studentFromDB?.AddressID}
                  isDisabled={isReadOnly === true}
                  className={`form-control ${
                    isSameFromDB === true ? "" : "is-invalid"
                  }`}
                  onChange={newAddress => {
                    console.log('newAddress', newAddress);
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
          getSubmitBtn={(res, fName) => getSubmitBtn && getSubmitBtn(res, responseFieldName, isLoading, preSubmit )}
        />
      </FlexContainer>
    </Wrapper>
  );
};

export default CODStudentDetailsPanel;
