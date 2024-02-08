import styled from "styled-components";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import React, { useState } from "react";
import { FlexContainer } from "../../../../styles";
import DateTimePicker from "../../../../components/common/DateTimePicker";
import FormLabel from "../../../../components/form/FormLabel";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import Toaster, { TOAST_TYPE_ERROR } from "../../../../services/Toaster";
import SynFileSemesterService from "../../../../services/Synergetic/SynFileSemesterService";
import moment from "moment-timezone";
import { OP_LTE, OP_OR } from "../../../../helper/ServiceHelper";
import SynVStudentService from "../../../../services/Synergetic/Student/SynVStudentService";
import {
  CAMPUS_CODE_JUNIOR,
  CAMPUS_CODE_SENIOR
} from "../../../../types/Synergetic/Lookup/iSynLuCampus";
import SynCampusSelector from "../../../../components/student/SynCampusSelector";
import SchoolCensusTable from "../SchoolCensusData/SchoolCensusTable";
import SectionDiv from "../../../../components/common/SectionDiv";
import iSchoolCensusStudentData from "../SchoolCensusData/iSchoolCensusStudentData";
import iSynLuYearLevel from '../../../../types/Synergetic/Lookup/iSynLuYearLevel';
import SynLuYearLevelService from '../../../../services/Synergetic/Lookup/SynLuYearLevelService';

const Wrapper = styled.div``;

const defaultSelectedCampusCodes = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR];

const StudentStatusMatrix = () => {
  const [reportingDate, setReportingDate] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [yearLevels, setYearLevels] = useState<iSynLuYearLevel[] | null>(null);
  const [selectedCampusCodes, setSelectedCampusCodes] = useState<string[]>(
    defaultSelectedCampusCodes
  );
  const [studentList, setStudentList] = useState<iSchoolCensusStudentData[]>(
    []
  );

  const getAgeFromBirthDate = (birthDateString: string, providedDateString: string) => {
    const birthStr = `${birthDateString || ''}`.trim();
    const providedDateStr = `${providedDateString || ''}`.trim();
    if (birthStr === '' || providedDateStr === '' ) {
      return '';
    }
    const age = Math.floor(moment(`${providedDateStr}T00:00:00Z`).diff(birthDateString, 'month') / 12);
    if (age <= 1) {
      return '1';
    }
    if (age > 21) {
      return '21+';
    }
    return `${age}`;
  }

  const doSearch = () => {
    if (`${reportingDate || ""}`.trim() === "") {
      Toaster.showToast(
        "Please select a reporting date first",
        TOAST_TYPE_ERROR
      );
      return;
    }
    const date = moment(`${reportingDate || ""}`.trim()).format("YYYY-MM-DD");

    const getData = async () => {
      const fileSemesters =
        (
          await SynFileSemesterService.getFileSemesters({
            where: JSON.stringify({
              ActivatedFlag: true,
              [OP_OR]: [
                { EndDate: { [OP_LTE]: date } },
                { StartDate: { [OP_LTE]: date } }
              ]
            }),
            perPage: 1,
            currentPage: 1,
            sort: "FileYear:DESC,FileSemester:DESC"
          })
          // @ts-ignore
        ).data || [];

      if (fileSemesters.length <= 0) {
        Toaster.showToast(
          `Can't find any file semester in Synergetic before this date(${date})`,
          TOAST_TYPE_ERROR
        );
        return;
      }

      const lastFileSemester =
        fileSemesters.length > 0 ? fileSemesters[0] : null;

      const resp = await Promise.all([
        SynVStudentService.getVStudentAll({
          where: JSON.stringify({
            FileYear: lastFileSemester.FileYear,
            FileSemester: lastFileSemester.FileSemester,
            StudentCampus: selectedCampusCodes
          }),
          perPage: 999999
        }),
        SynVStudentService.getVPastStudentAll({
          where: JSON.stringify({
            FileYear: lastFileSemester.FileYear,
            FileSemester: lastFileSemester.FileSemester,
            StudentCampus: selectedCampusCodes
          }),
          perPage: 999999
        }),
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({
            Campus: selectedCampusCodes
          })
        })
      ]);

      const pastStudentMap: { [key: number]: iSchoolCensusStudentData } = (
        resp[1].data || []
      ).reduce((map, pastStudent) => {
        return {
          ...map,
          [pastStudent.StudentID]: {
            ID: pastStudent.StudentID,
            Given1: pastStudent.StudentGiven1,
            Surname: pastStudent.StudentSurname,
            gender: pastStudent.StudentGender,
            dateOfBirth: pastStudent.StudentBirthDate,
            studentStatus: pastStudent.StudentStatus,
            StudentStatusDescription: pastStudent.StudentStatusDescription,
            campusCode: pastStudent.StudentCampus,
            entryDate: pastStudent.StudentEntryDate,
            leavingDate: `${pastStudent.StudentLeavingDate || ""}`.trim(),
            yearLevelCode: `${pastStudent.StudentYearLevel}`.trim(),
            visaExpiryDate: `${pastStudent.StudentsVisaExpiryDate ||
              ""}`.trim(),
            visaIssueDate: `${pastStudent.StudentVisaIssuedDate || ""}`.trim(),
            visaCode: `${pastStudent.StudentsVisaType || ""}`.trim(),
            visaNumber: `${pastStudent.StudentVisaNumber || ""}`.trim(),
            nccdStatusCategory: "",
            nccdStatusAdjustmentLevel: "",
            isInternationalStudent: pastStudent.FullFeeFlag,
            isIndigenous: pastStudent.IndigenousFlag,
            isPastStudent: true,
            age: getAgeFromBirthDate(pastStudent.StudentBirthDate, date),
            studentPassportCountryCode: `${pastStudent.StudentPassportCountryCode ||
              ""}`,
            studentPassportIssueCountry: `${pastStudent.StudentPassportCountry
              ?.Description || ""}`,
            studentPassportNo: `${pastStudent.StudentsPassportNo || ""}`,
            studentPassportIssuedDate: `${pastStudent.StudentPassportIssuedDate ||
              ""}`,
            studentPassportExpiryDate: `${pastStudent.StudentPassportExpiryDate ||
              ""}`,

            studentCountryOfBirthCode: `${pastStudent.StudentCountryOfBirthCode ||
              ""}`,
            studentCountryOfBirth: `${pastStudent.StudentCountryOfBirthDescription ||
              ""}`,
            studentNationality:
              `${pastStudent.StudentNationalityCode || ""}`.trim() === ""
                ? ""
                : `${pastStudent.StudentNationalityDescription || ""}`,
            studentNationality2:
              `${pastStudent.StudentNationality2Code || ""}`.trim() === ""
                ? ""
                : `${pastStudent.StudentNationality2Description || ""}`
          }
        };
      }, {});

      const studentMap: { [key: number]: iSchoolCensusStudentData } = (
        resp[0].data || []
      ).reduce((map, currentStudent) => {
        return {
          ...map,
          [currentStudent.StudentID]: {
            ID: currentStudent.StudentID,
            Given1: currentStudent.StudentGiven1,
            Surname: currentStudent.StudentSurname,
            gender: currentStudent.StudentGender,
            dateOfBirth: currentStudent.StudentBirthDate,
            studentStatus: currentStudent.StudentStatus,
            StudentStatusDescription: currentStudent.StudentStatusDescription,
            campusCode: currentStudent.StudentCampus,
            entryDate: currentStudent.StudentEntryDate,
            leavingDate: `${currentStudent.StudentLeavingDate || ""}`.trim(),
            yearLevelCode: `${currentStudent.StudentYearLevel}`.trim(),
            visaExpiryDate: `${currentStudent.StudentsVisaExpiryDate ||
              ""}`.trim(),
            visaIssueDate: `${currentStudent.StudentVisaIssuedDate ||
              ""}`.trim(),
            visaCode: `${currentStudent.StudentsVisaType || ""}`.trim(),
            visaNumber: `${currentStudent.StudentVisaNumber || ""}`.trim(),
            nccdStatusCategory: "",
            nccdStatusAdjustmentLevel: "",
            isInternationalStudent: currentStudent.FullFeeFlag,
            isIndigenous: currentStudent.IndigenousFlag,
            isPastStudent: false,
            age: getAgeFromBirthDate(currentStudent.StudentBirthDate, date),
            studentPassportCountryCode: `${currentStudent.StudentPassportCountryCode ||
              ""}`,
            studentPassportIssueCountry: `${currentStudent
              .StudentPassportCountry?.Description || ""}`,
            studentPassportNo: `${currentStudent.StudentsPassportNo || ""}`,
            studentPassportIssuedDate: `${currentStudent.StudentPassportIssuedDate ||
              ""}`,
            studentPassportExpiryDate: `${currentStudent.StudentPassportExpiryDate ||
              ""}`,

            studentCountryOfBirthCode: `${currentStudent.StudentCountryOfBirthCode ||
              ""}`,
            studentCountryOfBirth: `${currentStudent.StudentCountryOfBirthDescription ||
              ""}`,
            studentNationality:
              `${currentStudent.StudentNationalityCode || ""}`.trim() === ""
                ? ""
                : `${currentStudent.StudentNationalityDescription || ""}`,
            studentNationality2:
              `${currentStudent.StudentNationality2Code || ""}`.trim() === ""
                ? ""
                : `${currentStudent.StudentNationality2Description || ""}`
          }
        };
      }, pastStudentMap);

      setStudentList(Object.values(studentMap));
      setYearLevels(resp[2] || []);
    };

    setIsLoading(true);
    getData()
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Wrapper>
      <ExplanationPanel
        text={
          <>
            This report is built for Finance Team to figure out the student
            status at any time of the year. It's a snapshot of the student list
            for a provided date.
            <div>The age is calculated based on the Reporting Date and student's date of birth</div>
          </>
        }
      />

      <FlexContainer
        className={"with-gap lg-gap justify-content-start flex-wrap"}
      >
        <div>
          <FormLabel label={"Report Date:"} isRequired />
          <DateTimePicker
            timeFormat={false}
            dateFormat={"DD / MMM / YYYY"}
            value={reportingDate}
            onChange={selected => {
              if (typeof selected === "object") {
                setReportingDate(selected.toISOString());
              }
            }}
          />
        </div>

        <div>
          <FormLabel label={"Campuses"} isRequired />
          <SynCampusSelector
            isMulti
            allowClear={false}
            filterEmptyCodes
            values={selectedCampusCodes}
            onSelect={option =>
              setSelectedCampusCodes(
                option === null
                  ? defaultSelectedCampusCodes
                  : Array.isArray(option)
                  ? option.length === 0
                    ? defaultSelectedCampusCodes
                    : option.map(opt => `${opt.value}`)
                  : [`${option?.value}`]
              )
            }
          />
        </div>

        <div>
          <FormLabel label={" "} />
          <div>
            <LoadingBtn
              size={"sm"}
              isLoading={isLoading}
              onClick={() => doSearch()}
            >
              <Icons.Search /> Search{" "}
            </LoadingBtn>
          </div>
        </div>
      </FlexContainer>

      {yearLevels === null ? null : (
        <SectionDiv>
          <SchoolCensusTable records={studentList} luYearLevels={yearLevels} />
        </SectionDiv>
      )}
    </Wrapper>
  );
};

export default StudentStatusMatrix;
