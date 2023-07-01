import DateRangeWithFileSemesterSelector from "../../../components/DateRangeWithFileSemesterSelector";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import moment from "moment-timezone";
import { FlexContainer } from "../../../styles";
import LoadingBtn from "../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import Toaster, {TOAST_TYPE_ERROR} from "../../../services/Toaster";
import SynAttendanceMasterService from "../../../services/Synergetic/Attendance/SynAttendanceMasterService";
import { OP_BETWEEN, OP_OR } from "../../../helper/ServiceHelper";
import AppService, {
  HEADER_NAME_SELECTING_FIELDS
} from "../../../services/AppService";
import * as _ from "lodash";
import SectionDiv from "../../../components/common/SectionDiv";
import SchoolDaysPopupBtn from "../../dataSubmissions/components/SchoolCensusData/SchoolDaysPopupBtn";
import { FormControl, ProgressBar } from "react-bootstrap";
import SynVStudentService from "../../../services/Synergetic/SynVStudentService";
import SynCampusSelector from "../../../components/student/SynCampusSelector";
import FormLabel from "../../../components/form/FormLabel";
import {
  CAMPUS_CODE_JUNIOR,
  CAMPUS_CODE_SENIOR
} from "../../../types/Synergetic/iLuCampus";
import SynLuYearLevelService from "../../../services/Synergetic/SynLuYearLevelService";
import iLuYearLevel from "../../../types/Synergetic/iLuYearLevel";
import ToggleBtn from "../../../components/common/ToggleBtn";
import StudentAttendanceRateReportTable, {
  iAttendanceMap
} from "./components/StudentAttendanceRateReportTable";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import YearLevelSelector from "../../../components/student/YearLevelSelector";
import MathHelper from "../../../helper/MathHelper";
import { iVPastAndCurrentStudent } from "../../../types/Synergetic/iVStudent";
import SynVStudentAttendanceHistoryService from "../../../services/Synergetic/Attendance/SynVStudentAttendanceHistoryService";
import iSynVStudentAttendanceHistory from "../../../types/Synergetic/Attendance/iSynVStudentAttendanceHistory";
import UtilsService from '../../../services/UtilsService';

type iDateRange = {
  StartDate: string;
  EndDate: string;
};

const defaultCampusCodes = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR];
const StudentAttendanceRateReport = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const initDateRange: iDateRange = {
    StartDate:
      user?.SynCurrentFileSemester?.StartDate || moment().toISOString(),
    EndDate: user?.SynCurrentFileSemester?.EndDate || moment().toISOString()
  };
  const [isSearching, setIsSearching] = useState(false);
  const [watchingRate, setWatchingRate] = useState(80);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [searchingDateRange, setSearchingDateRange] = useState(initDateRange);
  const [searchingSchoolDays, setSearchingSchoolDays] = useState<string[]>([]);
  const [searchingFileSemesterStrs, setSearchingFileSemesterStrs] = useState<
    string[]
  >([]);
  const [searchingCampusCodes, setSearchingCampusCodes] = useState<string[]>(
    defaultCampusCodes
  );
  const [searchYearLevelCodes, setSearchYearLevelCodes] = useState<string[]>(
    []
  );
  const [yearLevels, setYearLevels] = useState<iLuYearLevel[]>([]);
  const [includePastStudents, setIncludePastStudents] = useState(false);
  const [studentsMap, setStudentsMap] = useState<{
    [key: number]: iVPastAndCurrentStudent;
  }>({});
  const [classDateMap, setClassDateMap] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<
    iAttendanceMap
  >({});
  const [studentAttendanceRateMap, setStudentAttendanceRateMap] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    const startDateStr = `${searchingDateRange.StartDate}`.trim();
    const endDateStr = `${searchingDateRange.EndDate}`.trim();
    if (startDateStr === "" || endDateStr === "") {
      Toaster.showToast(`Both Start Date and End Date are required.`);
      setSearchingSchoolDays([]);
      setSearchingFileSemesterStrs([]);
      return;
    }

    setIsSearching(true);
    let isCanceled = false;
    SynAttendanceMasterService.getAll(
      {
        where: JSON.stringify({
          AttendanceDate: { [OP_BETWEEN]: [startDateStr, endDateStr] },
          ClassCancelledFlag: false,
          FileType: "A",
          ...(searchingCampusCodes.length > 0
            ? { ClassCampus: searchingCampusCodes }
            : {})
        }),
        perPage: 99999
      },
      {
        headers: {
          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
            "FileYear",
            "FileSemester",
            "ClassCode",
            "AttendanceDate"
          ])
        }
      }
    )
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const sDays: string[] = [];
        const fileSemStr: string[] = [];
        const cMap: { [key: string]: string[] } = {};
        (resp.data || []).forEach(record => {
          sDays.push(moment(record.AttendanceDate).toISOString());
          fileSemStr.push(`${record.FileYear}-${record.FileSemester}`);
          if (!(record.ClassCode in cMap)) {
            cMap[record.ClassCode] = [];
          }
          const date = moment(`${record.AttendanceDate}`).format("YYYY-MM-DD");
          cMap[record.ClassCode] = _.uniq([...cMap[record.ClassCode], date]);
        });
        setSearchingSchoolDays(_.uniq(sDays));
        setSearchingFileSemesterStrs(_.uniq(fileSemStr));
        setClassDateMap(cMap);
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
        setIsSearching(false);
      });
    return () => {
      isCanceled = true;
    };
  }, [
    searchingDateRange.StartDate,
    searchingDateRange.EndDate,
    searchingCampusCodes
  ]);

  useEffect(() => {
    return () => {
      AppService.cancelAll();
    };
  }, []);

  const getAttendanceData = async (
    IDs: (number | string)[]
  ): Promise<iSynVStudentAttendanceHistory[]> => {
    let attendanceRecords: iSynVStudentAttendanceHistory[] = [];
    let doneIds: (number | string)[] = [];
    const idChunks = _.chunk(IDs, 30);
    for (const ids of idChunks) {
      const results = await Promise.all(
        ids.map(idArr =>
          SynVStudentAttendanceHistoryService.getAll(
            {
              where: JSON.stringify({
                ID: idArr,
                AttendanceDate: {
                  [OP_BETWEEN]: [
                    searchingDateRange.StartDate,
                    searchingDateRange.EndDate
                  ]
                },
                [OP_OR]: searchingFileSemesterStrs.map(semStr => {
                  const [fileYear, fileSemester] = semStr.split("-");
                  return {
                    FileYear: fileYear,
                    FileSemester: fileSemester
                  };
                })
              }),
              perPage: 9999999
            },
            {
              headers: {
                [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                  "ID",
                  "ClassCode",
                  "AttendanceDate",
                  "AttendedFlag",
                  "PossibleDescription",
                  "PossibleAbsenceCode",
                  "PossibleReasonCode",
                ])
              }
            }
          )
        )
      );
      doneIds = [...doneIds, ...ids];
      attendanceRecords = [
        ...attendanceRecords,
        ...results
          .map(result => result.data)
          .reduce((arr, row) => [...arr, ...row], [])
      ];
      setLoadingPercentage(
        MathHelper.mul(MathHelper.div(doneIds.length, IDs.length), 100)
      );
    }
    return attendanceRecords;
  };

  const doSearch = async () => {
    try {
      setLoadingPercentage(0);
      const [yrLevels, studentsArr] = await Promise.all([
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({
            ...(searchYearLevelCodes.length > 0
              ? { Code: searchYearLevelCodes }
              : {}),
            ...(searchingCampusCodes.length > 0
              ? { Campus: searchingCampusCodes }
              : {})
          })
        }),
        SynVStudentService.getVPastAndCurrentStudentAll(
          {
            where: JSON.stringify({
              ...(searchYearLevelCodes.length > 0
                ? { StudentYearLevel: searchYearLevelCodes }
                : {}),
              ...(includePastStudents === true
                ? {}
                : { StudentIsPastFlag: false }),
              ...(searchingCampusCodes.length > 0
                ? { StudentCampus: searchingCampusCodes }
                : {}),
              [OP_OR]: searchingFileSemesterStrs.map(semStr => {
                const [fileYear, fileSemester] = semStr.split("-");
                return {
                  FileYear: fileYear,
                  FileSemester: fileSemester
                };
              })
            }),
            perPage: 99999
          },
          {
            headers: {
              [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                "ID",
                "StudentID",
                "StudentNameExternal",
                "FileYear",
                "FileSemester",
                "StudentYearLevel",
                "StudentCampus",
                "StudentForm",
                "StudentStatus",
                "StudentStatusDescription",
                "StudentLeavingDate",
                "StudentIsPastFlag"
              ])
            }
          }
        )
      ]);
      const stuDataMap = (studentsArr.data || []).reduce(
        (map, student) => ({
          ...map,
          [student.StudentID]: student
        }),
        {}
      );
      setYearLevels(yrLevels);
      setStudentsMap(stuDataMap);
      if (
        Object.keys(stuDataMap).length <= 0 ||
        Object.keys(classDateMap).length <= 0
      ) {
        return;
      }
      const attendanceData = await getAttendanceData(Object.keys(stuDataMap));
      const attendanceMap: iAttendanceMap = {};
      const attendanceRateMap: {
        [key: number]: { total: number; attended: number };
      } = {};
      attendanceData.forEach(row => {
        const studentId = row.ID;
        if (!(studentId in attendanceRateMap)) {
          attendanceRateMap[studentId] = { total: 0, attended: 0 };
        }
        if (!(studentId in attendanceMap)) {
          attendanceMap[studentId] = [];
        }

        attendanceMap[studentId].push(row);
        attendanceRateMap[studentId].total = MathHelper.add(
          attendanceRateMap[studentId].total,
          1
        );
        if (row.AttendedFlag === true) {
          attendanceRateMap[studentId].attended = MathHelper.add(
            attendanceRateMap[studentId].attended,
            1
          );
        }
      });
      setStudentAttendanceMap(attendanceMap);
      setStudentAttendanceRateMap(
        Object.keys(attendanceRateMap).reduce((map, studentId) => {
          // @ts-ignore
          const info = attendanceRateMap[studentId];
          return {
            ...map,
            [studentId]:
              info.total <= 0
                ? 0
                : MathHelper.mul(MathHelper.div(info.attended, info.total), 100)
          };
        }, {})
      );
    } catch (err) {
      Toaster.showApiError(err);
    }
  };

  const search = () => {
    if (searchingSchoolDays.length <= 0) {
      Toaster.showToast(`We need at least one School Day to report.`);
      return;
    }
    setIsSearching(true);
    doSearch().finally(() => {
      setIsSearching(false);
    });
  };

  const getContent = () => {
    if (isSearching === true) {
      return (
        <>
          <PageLoadingSpinner
            text={<h5>Fetch data, please be patient...</h5>}
          />
          <div style={{ width: "50%", margin: "1rem auto" }}>
            <ProgressBar
              striped
              now={loadingPercentage}
              label={`${loadingPercentage.toFixed(2)}%`}
            />
          </div>
        </>
      );
    }
    if (yearLevels.length <= 0) {
      return null;
    }
    return (
      <StudentAttendanceRateReportTable
        watchingRate={watchingRate}
        yearLevels={yearLevels}
        attendanceRecordMap={studentAttendanceMap}
        attendanceRateMap={studentAttendanceRateMap}
        studentMap={studentsMap}
      />
    );
  };

  return (
    <>
      <h3>Student Attendance Report</h3>
      <FlexContainer className={"with-gap lg-gap align-items end"}>
        <DateRangeWithFileSemesterSelector
          isDisabled={isSearching}
          defaultSemester={user?.SynCurrentFileSemester}
          onSelect={({ startDate, endDate }) => {
            setSearchingDateRange({
              StartDate: startDate,
              EndDate: endDate
            });
          }}
        />
        <div>
          <FormLabel label={"Campus:"} />
          <SynCampusSelector
            filterEmptyCodes
            values={searchingCampusCodes}
            onSelect={values =>
              setSearchingCampusCodes(
                (values === null
                  ? []
                  : Array.isArray(values)
                  ? values
                  : [values]
                ).map(value => `${value.value}`)
              )
            }
            allowClear
            isMulti
          />
        </div>
        <div>
          <FormLabel label={"Year Lvl.:"} />
          <YearLevelSelector
            values={searchYearLevelCodes}
            onSelect={values =>
              setSearchYearLevelCodes(
                (values === null
                  ? []
                  : Array.isArray(values)
                  ? values
                  : [values]
                ).map(value => `${value.value}`)
              )
            }
            allowClear
            isMulti
          />
        </div>
        <div>
          <FormLabel label={"Include Past Students?"} />
          <div>
            <ToggleBtn
              on={"Incl."}
              off={"Excl."}
              checked={includePastStudents}
              onChange={checked => setIncludePastStudents(checked)}
            />
          </div>
        </div>
        <div>
          <FormLabel label={"Watch %"} />
          <FormControl
            type={'number'}
            placeholder={"The watching percentage, ie: 80"}
            value={watchingRate}
            onChange={(event) => {
              const value = event.target.value;
              if (!UtilsService.isNumeric(value)) {
                Toaster.showToast(`Watch percentage needs to be a number between 0 and 100`, TOAST_TYPE_ERROR);
                return;
              }
              setWatchingRate(Number(value))
            }}
          />
        </div>
        <LoadingBtn
          variant={"primary"}
          isLoading={isSearching}
          onClick={() => search()}
        >
          <Icons.Search /> Search
        </LoadingBtn>
      </FlexContainer>

      <SectionDiv>
        <h6>
          {isSearching === true ? null : (
            <>
              <SchoolDaysPopupBtn
                disabled={isSearching}
                schoolDays={searchingSchoolDays}
                variant={"link"}
                size={"sm"}
              >
                {searchingSchoolDays.length}
              </SchoolDaysPopupBtn>{" "}
              School Day(s) selected
            </>
          )}
        </h6>
      </SectionDiv>

      <SectionDiv>{getContent()}</SectionDiv>
    </>
  );
};

export default StudentAttendanceRateReport;
