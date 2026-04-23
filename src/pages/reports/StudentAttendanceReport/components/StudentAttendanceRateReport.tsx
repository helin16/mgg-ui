import DateRangeWithFileSemesterSelector from "../../../../components/DateRangeWithFileSemesterSelector";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import moment from "moment-timezone";
import { FlexContainer } from "../../../../styles";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import Toaster, {TOAST_TYPE_ERROR} from "../../../../services/Toaster";
import SynAttendanceMasterService from "../../../../services/Synergetic/Attendance/SynAttendanceMasterService";
import {OP_BETWEEN, OP_GT, OP_LTE, OP_OR} from "../../../../helper/ServiceHelper";
import AppService, {
  HEADER_NAME_SELECTING_FIELDS
} from "../../../../services/AppService";
import * as _ from "lodash";
import SectionDiv from "../../../../components/common/SectionDiv";
import { FormControl, ProgressBar } from "react-bootstrap";
import SynVStudentService from "../../../../services/Synergetic/Student/SynVStudentService";
import SynCampusSelector from "../../../../components/student/SynCampusSelector";
import FormLabel from "../../../../components/form/FormLabel";
import {
  CAMPUS_CODE_JUNIOR,
  CAMPUS_CODE_SENIOR
} from "../../../../types/Synergetic/Lookup/iSynLuCampus";
import SynLuYearLevelService from "../../../../services/Synergetic/Lookup/SynLuYearLevelService";
import ISynLuYearLevel from "../../../../types/Synergetic/Lookup/iSynLuYearLevel";
import ToggleBtn from "../../../../components/common/ToggleBtn";
import StudentAttendanceRateReportTable, {
  iAttendanceMap
} from "./StudentAttendanceRateReportTable";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import YearLevelSelector from "../../../../components/student/YearLevelSelector";
import MathHelper from "../../../../helper/MathHelper";
import { iVPastAndCurrentStudent } from "../../../../types/Synergetic/Student/iVStudent";
import UtilsService from '../../../../services/UtilsService';
import SynFileSemesterService, {iSchoolDay} from '../../../../services/Synergetic/SynFileSemesterService';
import SchoolDaysAllPopupBtn from '../../../dataSubmissions/components/SchoolCensusData/SchoolDaysAllPopupBtn';
import SynVAttendancesWithAbsenceService
  from '../../../../services/Synergetic/Attendance/SynVAttendancesWithAbsenceService';
import iSynVAttendancesWithAbsence from '../../../../types/Synergetic/Attendance/iSynVAttendancesWithAbsence';
import MggsModuleService from '../../../../services/Module/MggsModuleService';
import {MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE} from '../../../../types/modules/iModuleUser';
import SynLuAbsenceTypeService from '../../../../services/Synergetic/Lookup/SynLuAbsenceTypeService';
import iSynLuAbsenceType from '../../../../types/Synergetic/Absence/iSynLuAbsenceType';

type iDateRange = {
  StartDate: string;
  EndDate: string;
};
type iExcludingPeriodMap = {
  [key: string]: { start: string; end: string }[];
}

const defaultCampusCodes = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR];
const StudentAttendanceRateReport = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const initDateRange: iDateRange = {
    StartDate:
      user?.SynCurrentFileSemester?.StartDate || moment().toISOString(),
    EndDate: user?.SynCurrentFileSemester?.EndDate || moment().toISOString()
  };
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingSchoolDays, setIsFetchingSchoolDays] = useState(false);
  const [watchingRate, setWatchingRate] = useState(90);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [searchingDateRange, setSearchingDateRange] = useState(initDateRange);
  const [searchingSchoolDays, setSearchingSchoolDays] = useState<string[]>([]);
  const [searchingSchoolDaysAll, setSearchingSchoolDaysAll] = useState<iSchoolDay[]>([]);
  const [luAbsenceTypeMap, setLuAbsenceTypeMap] = useState<{[key: string]: iSynLuAbsenceType}>({});
  const [searchingCampusCodes, setSearchingCampusCodes] = useState<string[]>(
    defaultCampusCodes
  );
  const [searchYearLevelCodes, setSearchYearLevelCodes] = useState<string[]>(
    []
  );
  const [yearLevels, setYearLevels] = useState<ISynLuYearLevel[]>([]);
  const [includePastStudents, setIncludePastStudents] = useState(false);
  const [studentsMap, setStudentsMap] = useState<{
    [key: number]: iVPastAndCurrentStudent;
  }>({});
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<
    iAttendanceMap
  >({});
  const [studentAttendanceRateMap, setStudentAttendanceRateMap] = useState<{
    [key: number]: number;
  }>({});
  const [excludingPeriodsMap, setExcludingPeriodsMap] = useState<iExcludingPeriodMap>({});

  useEffect(() => {
    const startDateStr = `${searchingDateRange.StartDate}`.trim();
    const endDateStr = `${searchingDateRange.EndDate}`.trim();
    if (startDateStr === "" || endDateStr === "") {
      Toaster.showToast(`Both Start Date and End Date are required.`);
      setSearchingSchoolDays([]);
      return;
    }

    if(moment(searchingDateRange.StartDate).year() < moment().year()) {
      setIncludePastStudents(true)
    }
    setIsFetchingSchoolDays(true);
    let isCanceled = false;
    Promise.all([
      SynFileSemesterService.getSchoolDaysAll({
        start: moment(startDateStr).format('YYYY-MM-DD'),
        end: moment(endDateStr).format('YYYY-MM-DD'),
      }),
      MggsModuleService.getModule(MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE),
      SynLuAbsenceTypeService.getAll({
        where: JSON.stringify({ ActiveFlag: true })
      }),
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const sDays: string[] = (resp[0] || []).filter(day => day.isSchoolDay === true).map(day => day.date);
        setSearchingSchoolDays(_.uniq(sDays));
        setLuAbsenceTypeMap(resp[2].reduce((map, record) => ({...map, [record.Code]: record}), {}));
        setSearchingSchoolDaysAll(resp[0] || []);
        setExcludingPeriodsMap((resp[1].settings?.excludingDates || []).reduce((map: iExcludingPeriodMap, period: any) => {
          const key = `${period.yearLevelCode || ''}`.trim();
          if (key === '') {
            return map;
          }
          return {
            ...map,
            // @ts-ignore
            [key]: [...(key in map? map[key] : []), {start: period.start, end: period.end}]
          }
        }, {}))
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
        setIsFetchingSchoolDays(false);
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
  ): Promise<iSynVAttendancesWithAbsence[]> => {
    let attendanceRecords: iSynVAttendancesWithAbsence[] = [];
    let doneIds: (number | string)[] = [];
    const idChunks = _.chunk(IDs, 30);
    for (const ids of idChunks) {
      const results = await Promise.all(
        ids.map(idArr =>
          SynVAttendancesWithAbsenceService.getAll(
            {
              where: JSON.stringify({
                ID: idArr,
                AttendanceDate: {
                  [OP_BETWEEN]: [
                    searchingDateRange.StartDate,
                    searchingDateRange.EndDate
                  ]
                }
              }),
              perPage: 9999999,
              sort: 'AttendanceDate:ASC,AttendancePeriod:ASC'
            },
            {
              headers: {
                [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                  "ID",
                  "ClassCode",
                  "AttendanceDate",
                  "AttendancePeriod",
                  "AttendedFlag",
                  "PossibleDescription",
                  "PossibleAbsenceCode",
                  "PossibleReasonCode",
                  "ClassCancelledFlag",
                  "StudentYearLevel",
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
          .map(record => ({
            ...record,
            AttendedFlag: record?.AttendedFlag === true ? true : !(record.PossibleAbsenceCode in luAbsenceTypeMap && luAbsenceTypeMap[record.PossibleAbsenceCode].CountAsAbsenceFlag),
          }))
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
      const attMasters = await SynAttendanceMasterService.getAll(
        {
          where: JSON.stringify({
            AttendanceDate: { [OP_BETWEEN]: [searchingDateRange.StartDate, searchingDateRange.EndDate] },
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
              "FileSemester"
            ])
          }
        }
      );
      const searchingFileSemesterStrs = _.uniq((attMasters.data || []).map(record => `${record.FileYear}-${record.FileSemester}`));

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
              StudentEntryDate: {[OP_LTE]: searchingDateRange.EndDate},
              [OP_OR]: [
                { StudentLeavingDate: null, },
                { StudentLeavingDate: {[OP_GT]: searchingDateRange.StartDate}, },
              ],
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
            sort: 'FileYear:ASC,FileSemester:ASC',
            perPage: 99999
          },
          {
            headers: {
              [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                "ID",
                "StudentID",
                "StudentNameExternal",
                "StudentYearLevel",
                "StudentCampus",
                "StudentForm",
                "StudentStatus",
                "StudentStatusDescription",
                "StudentEntryDate",
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
      const attendanceData = await getAttendanceData(Object.keys(stuDataMap));
      const attendanceMap: iAttendanceMap = {};
      const attendanceRateMap: {
        [key: number]: { total: number; attended: number };
      } = {};
      attendanceData.forEach(row => {
        const studentId = row.ID;
        if (!(studentId in stuDataMap)) {
          return;
        }
        // @ts-ignore
        const student = stuDataMap[studentId];
        if (row.ClassCancelledFlag === true) {
          return;
        }
        if (`${student.StudentEntryDate || ''}`.trim() !== '' && moment(row.AttendanceDate).isBefore(moment(student.StudentEntryDate))) {
          return;
        }
        if (`${student.StudentLeavingDate || ''}`.trim() !== '' && moment(row.AttendanceDate).isAfter(moment(student.StudentLeavingDate))) {
          return;
        }
        if (`${row.StudentYearLevel}` in excludingPeriodsMap && excludingPeriodsMap[`${row.StudentYearLevel}`].filter(period => {
          if (moment(row.AttendanceDate).isSameOrAfter(moment(`${period.start}T00:00:00Z`)) && moment(row.AttendanceDate).isSameOrBefore(moment(`${period.end}T00:00:00Z`))) {
            return true;
          }
          return false;
        }).length > 0) {
          return;
        }

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

      const studentIdsWithAttendanceRecords = Object.keys(attendanceMap);
      setStudentsMap(Object.keys(stuDataMap).filter(stuId => studentIdsWithAttendanceRecords.indexOf(stuId) >= 0).reduce((map, stuId) => {
        return {
          ...map,
          // @ts-ignore
          [stuId]: stuDataMap[stuId],
        }
      }, {}));
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
    if (isFetchingSchoolDays === true) {
      return <PageLoadingSpinner
        text={<h5>Calculating School Days...</h5>}
      />
    }

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
    <div>
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
          <ToggleBtn
            style={{width: '100%'}}
            on={"Incl."}
            off={"Excl."}
            checked={includePastStudents}
            onChange={checked => setIncludePastStudents(checked)}
          />
        </div>
        <div>
          <FormLabel label={"Watching %"} />
          <FormControl
            style={{width: '80px', marginBottom: '0px'}}
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
          {isFetchingSchoolDays === true ? null : (
            <>
              <SchoolDaysAllPopupBtn
                disabled={isSearching}
                days={searchingSchoolDaysAll}
                variant={"link"}
                size={"sm"}
              >
                {searchingSchoolDays.length}
              </SchoolDaysAllPopupBtn>{" "}
              School Day(s) selected
            </>
          )}
        </h6>
      </SectionDiv>

      <SectionDiv>{getContent()}</SectionDiv>
    </div>
  );
};

export default StudentAttendanceRateReport;
