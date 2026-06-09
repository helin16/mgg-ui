import styled from 'styled-components';
import MathHelper from '../../helper/MathHelper';
import moment from 'moment-timezone';
import {Button, Spinner, Table} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {pdf} from '@react-pdf/renderer';
import iSynLuYearLevel from '../../types/Synergetic/Lookup/iSynLuYearLevel';
import Toaster from '../../services/Toaster';
import SynLuYearLevelService from '../../services/Synergetic/Lookup/SynLuYearLevelService';
import iSynLuCampus, {MGG_CAMPUS_CODES} from '../../types/Synergetic/Lookup/iSynLuCampus';
import SynLuCampusService from '../../services/Synergetic/Lookup/SynLuCampusService';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import SynVFutureStudentService from '../../services/Synergetic/SynVFutureStudentService';
import {
  iVPastAndCurrentStudent,
} from '../../types/Synergetic/Student/iVStudent';
import * as _ from 'lodash';
import StudentNumberDetailsPopupBtn from '../reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn';
import SynCampusSelector from '../student/SynCampusSelector';
import PanelTitle from '../PanelTitle';
import MggsModuleService from '../../services/Module/MggsModuleService';
import {MGGS_MODULE_ID_ENROLLMENTS} from '../../types/modules/iModuleUser';
import SynLuFutureStatusService from '../../services/Synergetic/Lookup/SynLuFutureStatusService';
import iSynLuFutureStatus from '../../types/Synergetic/Lookup/iSynLuFutureStatus';
import {FlexContainer} from '../../styles';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {ArrowClockwise, FileEarmarkPdf} from 'react-bootstrap-icons';
import LoadingBtn from '../common/LoadingBtn';
import SynLuTransitionDateService from '../../services/Synergetic/Lookup/SynLuTransitionDateService';
import iSynLuTransitionDate from '../../types/Synergetic/Lookup/iSynLuTransitionDate';
import ToggleBtn from '../common/ToggleBtn';
import SynFileSemesterService from '../../services/Synergetic/SynFileSemesterService';
import EnrolmentDashboardExportPdf, {
  iEnrolmentDashboardExportColumn,
  iEnrolmentDashboardExportRow,
} from './EnrolmentDashboardExportPdf';

enum FullFeeStudentsTypes {
  All = 'All',
  DomesticOnly = 'Domestic Only',
  InternationalOnly = 'International Only',
}

type iYearLevelMap = {[key: string]: iSynLuYearLevel[]}
type iCampusMap = {[key: string]: iSynLuCampus}
type iStudentMap = {[key: number]: iVPastAndCurrentStudent}
type iFutureStatusMap = {[key: string]: iSynLuFutureStatus}
type iDashboardColumn = iEnrolmentDashboardExportColumn & {
  className: string;
  dataCol: string;
}
type iDashboardRow = {
  key: string;
  label: string;
  className: string;
  cells: {[key: string]: iVPastAndCurrentStudent[]};
  isSummary?: boolean;
}
const Wrapper = styled.div`
    .border-right {
        border-right: 2px black solid;
        &.sm {
            border-right: 1px #aaa solid !important;
        }
    }

    .campus-total {
        td {
            background-color: #ccc !important;
            font-weight: bold;
            text-transform: uppercase;
            .btn {
                font-weight: bold !important;
            }
        }
    }
    th,
    td {
        text-align: center;
        border: 1px #eee solid;
        &.total {
            background-color: #eee;
        }
    }
    tr {
        >:first-child {
            width: 200px;
            text-align: right;
        }
    }
    td {
        text-align: right;
    }

    tr.count-header {
        th {
            > div {
                float: right;
                writing-mode: vertical-rl;   /* make text vertical */
                text-orientation: mixed;     /* keep characters upright */
                transform: rotate(180deg);   /* flip so it goes bottom → top */
                //white-space: nowrap;         /* prevent wrapping */
                text-align: left !important;
            }
        }
    }
`;
const EnrolmentDashboardPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [nextYear, setNextYear] = useState(MathHelper.add(moment().year(), 1));
  const [lastYear, setLastYear] = useState(MathHelper.sub(moment().year(), 1));

  const [selectedFullFeeStudentType, setSelectedFullFeeStudentType] = useState(FullFeeStudentsTypes.All);
  const [selectedCampusCodes, setSelectedCampusCodes] = useState(MGG_CAMPUS_CODES);
  const [forceReload, setForceReload] = useState(0);
  const [yearLevelCampusMap, setYearLevelCampusMap] = useState<iYearLevelMap>({});
  const [currentStudentsMap, setCurrentStudentsMap] = useState<iStudentMap>({});
  const [futureStudentsMap, setFutureStudentsMap] = useState<iStudentMap>({});
  const [campusMap, setCampusMap] = useState<iCampusMap>({});
  const [currentFutureStatuses, setCurrentFutureStatuses] = useState<iSynLuFutureStatus[]>([]);
  const [futureStatuses, setFutureStatuses] = useState<iSynLuFutureStatus[]>([]);
  const [yearLevels, setYearLevels] = useState<iSynLuYearLevel[]>([]);
  const [showTransitColumns, setShowTransitColumns] = useState(false);
  const [transitionDate, setTransitionDate] = useState<iSynLuTransitionDate | null>(null);
  const [isExporting, setIsExporting] = useState(false);


  useEffect(() => {
    const getData = async () => {
      const result = await SynFileSemesterService.getFileSemesters({
        where: JSON.stringify({
          SystemCurrentFlag: true
        })
      });
      let cYear = currentYear;
      if (result.length > 0) {
        cYear = result[0].FileYear;
      }
      const nYear = MathHelper.add(cYear, 1);
      const lYear = MathHelper.sub(cYear, 1);
      const [module, futureStatuses, campuses, yLevels, currentAndPastStudentResult, futureStudentResult, transDates] = await Promise.all([
        MggsModuleService.getModule(MGGS_MODULE_ID_ENROLLMENTS),
        SynLuFutureStatusService.getAll({}),
        SynLuCampusService.getAllCampuses({
          where: JSON.stringify({Code: MGG_CAMPUS_CODES}),
        }),
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({Campus: MGG_CAMPUS_CODES}),
          sort: `YearLevelSort:ASC`
        }),
        SynVStudentService.getVPastAndCurrentStudentAll({
          where: JSON.stringify({StudentCampus: MGG_CAMPUS_CODES, FileYear: cYear}),
          sort: `FileSemester:ASC`,
          perPage: 9999999999,
        }),
        SynVFutureStudentService.getAll({
          where: JSON.stringify({FutureCampus: MGG_CAMPUS_CODES, FutureEnrolYear: [nYear, cYear]}),
          perPage: 9999999999,
        }),
        SynLuTransitionDateService.getAll({
          where: JSON.stringify({ FileYear: cYear }),
        })
      ]);

      if (isCancel) { return }
      const yearLvlMap = yLevels.reduce((map, yLevel) => ({
        ...map,
        [yLevel.Code]: yLevel,
      }), {});
      setCurrentYear(cYear);
      setNextYear(nYear);
      setLastYear(lYear);
      setYearLevels(yLevels);
      setCampusMap(campuses.reduce((map: iCampusMap, campus) => ({
        ...map,
        [campus.Code]: campus,
      }), {}));
      const currentFutureStatusCodes: string[] = module.settings?.enrolmentNumbers?.currentFutureStatuses || [];
      const futureStatusCodes: string[] = module.settings?.enrolmentNumbers?.futureStatuses || [];
      const futureStatusMap = futureStatuses.reduce((map: iFutureStatusMap, status) => ({
        ...map,
        [status.Code]: status,
      }), {});
      setCurrentFutureStatuses(currentFutureStatusCodes.map(code => futureStatusMap[code] || null).filter(status => status !== null))
      setFutureStatuses(futureStatusCodes.map(code => futureStatusMap[code] || null).filter(status => status !== null))
      setYearLevelCampusMap(yLevels.reduce((map: iYearLevelMap, yLevel) => ({
        ...map,
        [yLevel.Campus]: [...(map[yLevel.Campus] || []), yLevel],
      }), {}));
      setCurrentStudentsMap((currentAndPastStudentResult.data || []).filter(student => `${student.StudentLeavingDate || ''}`.trim() === '' || moment(`${student.StudentLeavingDate || ''}`.trim()).year() >= currentYear).reduce((map: iStudentMap, student) => ({
        ...map,
        [student.ID]: student,
      }), {}));
      setFutureStudentsMap((futureStudentResult.data || []).reduce((map: iStudentMap, student) => ({
        ...map,
        [student.FutureID]: SynVFutureStudentService.mapFutureStudentToCurrent(student, yearLvlMap) as iVPastAndCurrentStudent,
      }), {}));
      setTransitionDate(transDates.length > 0 ? transDates[0] : null);
      setShowTransitColumns(transDates.length > 0 && moment().isSameOrAfter(moment(transDates[0].TransitionStartAt)));
    }

    let isCancel = false;
    setIsLoading(true);
    getData().catch(err => {
      if (isCancel) { return }
      Toaster.showApiError(err)
    }).finally(() => {
      if (isCancel) { return }
      setIsLoading(false)
    })
    return () => {
      isCancel = true;
    }
  }, [selectedCampusCodes, forceReload, currentYear]);

  const getStudents = (students: iVPastAndCurrentStudent[], yearLevels: iSynLuYearLevel[] = [], statuses: string[] = []) => {
    const yearLevelCodes = yearLevels.map(yl => `${yl.Code}`.trim());
    return _.uniqBy(students, (student) => student.StudentID || student.ID).filter(student => {
      const withinYearLevel = yearLevelCodes.indexOf(`${student.StudentYearLevel}`.trim()) >=0;
      const withinStatuses = statuses.indexOf(student.StudentStatus) >=0;

      if (yearLevels.length > 0) {
        if (statuses.length > 0) {
          return withinYearLevel && withinStatuses
        }
        return withinYearLevel;
      }

      if (statuses.length > 0) {
        return withinStatuses;
      }

      return true;
    })
  }

  const getClickableNumber = (sumArr: iVPastAndCurrentStudent[]) => {
    const length = sumArr.length || 0;
    if (length <= 0) {
      return null;
    }
    return <StudentNumberDetailsPopupBtn
      records={(sumArr || [])}
      size={"sm"}
      variant={"link"}
    >
      {length}
    </StudentNumberDetailsPopupBtn>
  }

  const filterFullFeeFlag = (student: iVPastAndCurrentStudent) => {
    if (selectedFullFeeStudentType === FullFeeStudentsTypes.DomesticOnly) {
      return student.FullFeeFlag === false;
    }
    if (selectedFullFeeStudentType === FullFeeStudentsTypes.InternationalOnly) {
      return student.FullFeeFlag === true;
    }
    return true;
  }

  const getDashboardColumns = (): iDashboardColumn[] => {
    const columns: iDashboardColumn[] = [
      {key: 'current-continued-prev', label: `Continued from ${lastYear}`, className: 'current', dataCol: 'continued-prev', isTotal: false},
      {key: 'current-start-of-year', label: 'New (start of year)', className: 'current', dataCol: 'start-of-year', isTotal: false},
      {key: 'current-day-1', label: `Day 1 ${currentYear} Total`, className: 'current total border-right sm', dataCol: 'current-day-1', isTotal: true},
      {key: 'current-start-during', label: 'New (during year)', className: 'current border-right sm', dataCol: 'start-during', isTotal: false},
      {key: 'current-left-during', label: 'Left (during year)', className: 'current', dataCol: 'left-during', isTotal: false},
    ];

    if (showTransitColumns) {
      columns.push(
        {key: 'current-transitioned-in', label: 'Transitioned In', className: 'current', dataCol: 'transitioned-in', isTotal: false},
        {key: 'current-transitioned-out', label: 'Transitioned Out', className: 'current', dataCol: 'transitioned-out', isTotal: false},
      );
    }

    columns.push(
      {key: 'current-loa-during', label: 'L.O.A. (Returning)', className: 'current', dataCol: 'loa-returning', isTotal: false},
      {key: 'current-total-today', label: 'Total Today', className: 'current total', dataCol: 'total-today', isTotal: true},
      {key: 'current-future-loa', label: 'Approved Future L.O.A.', className: 'current', dataCol: 'future-loa', isTotal: false},
      {key: 'current-not-returning', label: 'Not Returning Next Year', className: 'current', dataCol: 'not-returning', isTotal: false},
      {key: 'current-returning-loa', label: 'Returning L.O.A.', className: 'current', dataCol: 'returning-loa', isTotal: false},
    );

    currentFutureStatuses.forEach((status, index) => {
      columns.push({
        key: `current-status-${status.Code || 'no-status'}`,
        label: status.Description || status.Code || '',
        className: `current ${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`.trim(),
        dataCol: `future-${status.Code || 'no-status'}`,
        isTotal: false,
      });
    });

    columns.push({key: 'current-total-year-end', label: 'Total at Year End', className: 'current total border-right', dataCol: 'total-year-end', isTotal: true});
    columns.push({key: 'future-continued-prev', label: `Continued from ${currentYear}`, className: 'future', dataCol: 'continued-prev', isTotal: false});
    columns.push({key: 'future-loa', label: `Returning L.O.A. from ${currentYear}`, className: 'future', dataCol: 'loa', isTotal: false});

    futureStatuses.forEach((status) => {
      columns.push({
        key: `future-status-${status.Code || 'no-status'}`,
        label: status.Description || status.Code || '',
        className: 'future',
        dataCol: `future-${status.Code || 'no-status'}`,
        isTotal: false,
      });
    });

    columns.push({key: 'future-total-start', label: 'Total Start', className: 'total future border-right', dataCol: 'total-start', isTotal: true});

    return columns;
  }

  type iGetRowCells = {
    currentStudents: iVPastAndCurrentStudent[];
    futureStudents: iVPastAndCurrentStudent[];
    yrLvls?: iSynLuYearLevel[]
  }

  const getDashboardRowCells = ({ yrLvls, currentStudents, futureStudents }: iGetRowCells) => {
    const safeCurrentStudents = currentStudents.filter(Boolean);
    const safeFutureStudents = futureStudents.filter(Boolean);
    const currentStudentIds = safeCurrentStudents.map(student => student.StudentID);
    const currentFutureStatusCodes = currentFutureStatuses.map(status => status.Code);
    const leftStudents = safeCurrentStudents.filter(student => moment(student.StudentLeavingDate).isSameOrBefore(moment()));
    const continuedStudentsFromLastYear = safeCurrentStudents.filter(student => moment(student.StudentEntryDate).year() < currentYear);
    const futureStudentsCurrentYear = safeFutureStudents.filter(student => student.FileYear === currentYear);
    const newStudentsCurrentYear = safeCurrentStudents.filter(student => moment(student.StudentEntryDate).year() === currentYear);
    const startBeginningOfYear = newStudentsCurrentYear.filter(student => moment(student.StudentEntryDate).month() === 0);
    const startDuringYearStudents = newStudentsCurrentYear.filter(student => moment(student.StudentEntryDate).month() > 0);
    const startDuringYearStudentsNotStarted = startDuringYearStudents.filter(student => moment(student.StudentEntryDate).isAfter(moment()));
    const leftStudentWillComeBack = leftStudents.filter(student => `${student.StudentReturningDate || ''}`.trim() !== '' &&  moment(`${student.StudentReturningDate || ''}`.trim()).isAfter(moment()));
    const returningLoaCurrentYear = leftStudents.filter(student => {
      const returningDate = `${student.StudentReturningDate || ''}`.trim();
      if (returningDate === '') {
        return false;
      }
      const returningMoment = moment(returningDate);
      return returningMoment.isValid() && returningMoment.isAfter(moment()) && returningMoment.year() === currentYear;
    });
    const currentDay1 = [...continuedStudentsFromLastYear, ...startBeginningOfYear];
    const studentsToday = getUniqStudents(getStudentsNotLeftYet([
      ...currentDay1,
      ...startDuringYearStudents,
    ]));
    const normalStudentsThisYearLeaving = getStudentsNotLeftYet(studentsToday).filter(student => `${student.StudentLeavingDate || ''}`.trim() !== '' &&  moment(`${student.StudentLeavingDate || ''}`.trim()).isAfter(moment()));
    const normalStudentsThisYearLeavingNotComeBack = normalStudentsThisYearLeaving.filter(student => `${student.StudentReturningDate || ''}`.trim() === '');
    const normalStudentsThisYearLeavingWillComeBack = normalStudentsThisYearLeaving.filter(student => `${student.StudentReturningDate || ''}`.trim() !== '' &&  moment(`${student.StudentReturningDate || ''}`.trim()).isAfter(moment()));
    const studentsEndOfCurrentYear = getUniqStudents([
      ...studentsToday,
      ...returningLoaCurrentYear,
      ...(futureStudentsCurrentYear.filter(std => currentFutureStatusCodes.indexOf(std.StudentStatus) >=0 )),
    ]);
    const transitionedInStudents = transitionDate ? newStudentsCurrentYear.filter(st => moment(st.StudentEntryDate).isSameOrAfter(moment(transitionDate.TransitionStartAt))) : [];
    const transitionedOutStudents = transitionDate ? leftStudents.filter(st => moment(st.StudentLeavingDate).isSameOrAfter(moment(transitionDate.TransitionStartAt))) : [];
    const yrLvlCodes = (yrLvls || []).map(yrLvl => `${yrLvl.Code}`.trim());
    const futureStatusCodes = futureStatuses.map(status => status.Code);
    const currentNotLeavingNextYearStudentsNotRepeating = studentsEndOfCurrentYear.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() === '');
    const currentNotLeavingNextYearStudentsRepeating = studentsEndOfCurrentYear.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() !== '');
    const studentsFromLowerYearLevelMap: {[key: string]: iVPastAndCurrentStudent[]} = yearLevels.reduce((map, yrLvl) => {
      const currentYearLvlIndex = _.findIndex(yearLevels, yearLevel => yearLevel.Code === yrLvl.Code);
      const previousIndex = currentYearLvlIndex - 1;
      const previousYearLevel = yearLevels[previousIndex] || null;
      const studentsFromLowerYearLevel = previousIndex < 0 || previousYearLevel === null ? [] : getStudents(currentNotLeavingNextYearStudentsNotRepeating, [previousYearLevel]);
      return {
        ...map,
        [`${yrLvl.Code}`.trim()]: [
          ...studentsFromLowerYearLevel,
          ...currentNotLeavingNextYearStudentsNotRepeating.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() === `${yrLvl.Code}`)
        ],
      }
    }, {});
    const futureStudentsNextYear = getUniqStudents(
      futureStudents
        .filter(Boolean)
        .filter(st => st.FileYear === nextYear)
        .filter(student => yrLvlCodes.length <= 0 ? true : yrLvlCodes.indexOf(`${student.StudentEntryYearLevel}`.trim()) >= 0)
        .filter(student => futureStatusCodes.indexOf(`${student.StudentStatus}`.trim()) >=0 )
    );
    const futureStudentsNextYearWithoutCurrent = futureStudentsNextYear.filter(student => currentStudentIds.indexOf(student.StudentID) < 0);
    const repeatingStudents = getUniqStudents(currentNotLeavingNextYearStudentsRepeating
      .filter(student => yrLvlCodes.length <= 0 ? true : yrLvlCodes.indexOf(`${student.StudentOverrideNextYearLevel}`.trim()) >= 0));
    const studentsFromLowerYearLevel = Object.keys(studentsFromLowerYearLevelMap)
      .filter(yrLvlCode => yrLvlCodes.length <= 0 ? true : yrLvlCodes.indexOf(yrLvlCode) >= 0)
      .map(ylCode => ylCode in studentsFromLowerYearLevelMap ? studentsFromLowerYearLevelMap[ylCode] : [])
      .reduce((arr: iVPastAndCurrentStudent[], studentArr: iVPastAndCurrentStudent[]) => [...arr, ...studentArr], []);
    const continuedFromCurrentYear = getUniqStudents([
      ...studentsFromLowerYearLevel,
      ...repeatingStudents,
    ]).filter(student => {
      const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
      if (leavingDate === '') {
        return true;
      }
      return moment(leavingDate).isAfter(moment().endOf('year'));
    });
    const loaStudents = getUniqStudents(
      leftStudents
        .filter(student => `${student.StudentReturningDate || ''}`.trim() !== '' && moment(`${student.StudentReturningDate || ''}`.trim()).year() === nextYear)
        .filter(student => {
          if (yrLvlCodes.length <= 0) {
            return true;
          }
          let returningYearLevel = `${student.StudentOverrideNextYearLevel || ''}`.trim();
          if (returningYearLevel === '') {
            const currentYearLvlIndex = _.findIndex(yearLevels, yearLevel => yearLevel.Code === student.StudentYearLevel);
            const nextIndex = currentYearLvlIndex + 1;
            const nextYearLevel = yearLevels[nextIndex] || null;
            if (!nextYearLevel) {
              return false;
            }

            return yrLvlCodes.indexOf(`${nextYearLevel?.Code}`.trim()) >= 0
          }

          return yrLvlCodes.indexOf(returningYearLevel) >= 0
        })
    );
    const futureStudentsNextYearTotal = getUniqStudents([
      ...continuedFromCurrentYear,
      ...loaStudents,
      ...futureStudentsNextYearWithoutCurrent,
    ]);

    const cells: {[key: string]: iVPastAndCurrentStudent[]} = {
      'current-continued-prev': getStudents(continuedStudentsFromLastYear, yrLvls),
      'current-start-of-year': getStudents(startBeginningOfYear, yrLvls),
      'current-day-1': getStudents(currentDay1, yrLvls),
      'current-start-during': getStudents(startDuringYearStudents, yrLvls),
      'current-left-during': getStudents(leftStudents, yrLvls),
      'current-loa-during': getStudents(leftStudentWillComeBack, yrLvls),
      'current-total-today': getStudents(studentsToday, yrLvls),
      'current-future-loa': getStudents(normalStudentsThisYearLeavingWillComeBack, yrLvls),
      'current-not-returning': getStudents(normalStudentsThisYearLeavingNotComeBack, yrLvls),
      'current-returning-loa': getStudents(returningLoaCurrentYear, yrLvls),
      'current-total-year-end': getStudents(studentsEndOfCurrentYear, yrLvls),
      'future-continued-prev': getStudents(continuedFromCurrentYear),
      'future-loa': getStudents(loaStudents),
      'future-total-start': getStudents(futureStudentsNextYearTotal),
    };

    if (showTransitColumns) {
      cells['current-transitioned-in'] = getStudents(transitionedInStudents, yrLvls);
      cells['current-transitioned-out'] = getStudents(transitionedOutStudents, yrLvls);
    }

    currentFutureStatuses.forEach((status) => {
      cells[`current-status-${status.Code || 'no-status'}`] = getStudents(
        [...safeCurrentStudents, ...startDuringYearStudentsNotStarted, ...futureStudentsCurrentYear],
        yrLvls,
        [status.Code]
      );
    });

    futureStatuses.forEach((status) => {
      cells[`future-status-${status.Code || 'no-status'}`] = getStudents(futureStudentsNextYearWithoutCurrent, [], [status.Code]);
    });

    return cells;
  }

  const getUniqStudents = (students: iVPastAndCurrentStudent[]) => {
    return _.uniqBy(students, st => st.StudentID);
  }

  const getStudentsNotLeftYet = (students: iVPastAndCurrentStudent[]) => {
    return students.filter(student => {
      const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
      if (leavingDate === '') {
        return true;
      }
      return moment(leavingDate).isAfter(moment());
    })
  }

  const getTR = (row: iDashboardRow) => {
    const columns = getDashboardColumns();
    return <tr key={row.key} className={row.className}>
      <td className={'border-right'}>{row.label}</td>
      {
        columns.map(column => (
          <td key={column.key} className={column.className} data-col={column.dataCol}>
            {getClickableNumber(row.cells[column.key] || [])}
          </td>
        ))
      }
    </tr>
  }

  const getVisibleDashboardRows = (currentStudents: iVPastAndCurrentStudent[], futureStudents: iVPastAndCurrentStudent[]): iDashboardRow[] => {
    const rows: iDashboardRow[] = [];

    Object.keys(yearLevelCampusMap)
      .filter(campusCode => selectedCampusCodes.indexOf(campusCode) >= 0)
      .forEach(campusCode => {
        const campusYearLevels = yearLevelCampusMap[campusCode] || [];
        campusYearLevels.forEach((yearLevel) => {
          rows.push({
            key: `${campusCode}-${yearLevel.YearLevelSort}`,
            label: yearLevel.Description,
            className: 'year-level-row',
            cells: getDashboardRowCells({
              currentStudents,
              futureStudents,
              yrLvls: [yearLevel],
            }),
          });
        });

        rows.push({
          key: `${campusCode}-total`,
          label: campusCode in campusMap ? campusMap[campusCode].Description : campusCode,
          className: 'campus-total',
          isSummary: true,
          cells: getDashboardRowCells({
            currentStudents,
            futureStudents,
            yrLvls: campusYearLevels,
          }),
        });
      });

    if (selectedCampusCodes.length > 1) {
      rows.push({
        key: 'grand-total',
        label: 'Total',
        className: 'campus-total',
        isSummary: true,
        cells: getDashboardRowCells({
          currentStudents,
          futureStudents,
        }),
      });
    }

    return rows;
  }

  const onExportPdf = async () => {
    if (isLoading || isExporting) {
      return;
    }

    const currentStudents = Object.values(currentStudentsMap).filter(Boolean).filter(filterFullFeeFlag);
    const futureStudents = Object.values(futureStudentsMap).filter(Boolean).filter(filterFullFeeFlag);
    const columns = getDashboardColumns();
    const rows = getVisibleDashboardRows(currentStudents, futureStudents);
    const exportRows: iEnrolmentDashboardExportRow[] = rows.map(row => ({
      label: row.label,
      isSummary: row.isSummary,
      values: columns.reduce((map, column) => ({
        ...map,
        [column.key]: row.cells[column.key]?.length || 0,
      }), {}),
    }));
    const selectedCampusLabels = selectedCampusCodes.map(code => campusMap[code]?.Description || code);
    const fileName = `Enrolment_Numbers_${moment().format('YYYY_MMM_DD_HH_mm_ss')}.pdf`;

    setIsExporting(true);
    try {
      const blob = await pdf(
        <EnrolmentDashboardExportPdf
          columns={columns}
          rows={exportRows}
          selectedCampusLabels={selectedCampusLabels}
          selectedFullFeeStudentType={selectedFullFeeStudentType}
          currentYear={currentYear}
          nextYear={nextYear}
          currentFutureStatusCount={currentFutureStatuses.length}
          currentFutureExtraColumnCount={1}
          futureStatusCount={futureStatuses.length}
          showTransitColumns={showTransitColumns}
        />
      ).toBlob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setIsExporting(false);
    }
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'}/>
    }

    const currentStudents = Object.values(currentStudentsMap).filter(Boolean).filter(filterFullFeeFlag);
    const futureStudents = Object.values(futureStudentsMap).filter(Boolean).filter(filterFullFeeFlag);
    const visibleRows = getVisibleDashboardRows(currentStudents, futureStudents);
    return (
      <Table hover size={'sm'}>
        <thead>
        <tr>
          <th className={'border-right'}></th>
          <th colSpan={MathHelper.add(currentFutureStatuses.length, MathHelper.add(11, showTransitColumns ? 2 : 0))} className={'current border-right'}>{currentYear}</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 3)} className={'future'}>{nextYear}</th>
        </tr>
        <tr>
          <th className={'border-right'}></th>
          <th colSpan={3} className={`current border-right sm`}>Past</th>
          <th className={`current border-right sm`}></th>
          <th colSpan={MathHelper.add(2, showTransitColumns ? 2 : 0)} className={`current border-right sm`}>Existing {currentYear}</th>
          <th className={`current`} data-col={'total-today'}></th>
          <th className={`current`} data-col={'total-today'}></th>
          <th className={`current`} data-col={'total-today'}></th>
          <th colSpan={MathHelper.add(currentFutureStatuses.length, 1)} className={'current border-right sm'} data-col={'future'}>Future {currentYear}</th>
          <th className={`current border-right`} data-col={'total-year-end'}></th>
          <th colSpan={MathHelper.add(futureStatuses.length, 3)} className={'future'}>Future {nextYear}</th>
        </tr>
        <tr className={'count-header'}>
          <th className={'border-right'}></th>
          <th className={`current`} data-col={'continued-prev'}><div>Continued<br/><small>from {lastYear}</small></div></th>
          <th className={`current`} data-col={'start-of-year'}><div>New<br/><small>(start of year)</small></div></th>
          <th className={`current total border-right sm`} data-col={'current-day-1'}><div>DAY
            1 {currentYear}<br/><small>TOTAL</small></div></th>
          <th className={`current border-right sm`} data-col={'start-during'}><div>NEW<br/><small>(During year)</small></div></th>

          <th className={`current`} data-col={'left-during'}><div>LEFT<br/><small>(During year)</small></div></th>
          {
            showTransitColumns && (
              <>
                <th className={`current`} data-col={'transitioned-in'}>
                  <div>Transitioned<br/>IN</div>
                </th>
                <th className={`current`} data-col={'transitioned-out'}>
                  <div>Transitioned<br/>OUT</div>
                </th>
              </>
            )}
          <th className={`current`} data-col={'loa-returning'}>
            <div>L.O.A<br/><small>(Returning)</small></div>
          </th>
          <th className={`current total`} data-col={'total-today'}><div>TOTAL<br/>TODAY</div></th>
          <th className={`current`} data-col={'future-loa'}><div>APPROVED<br/><small>FUTURE L.O.A.</small></div></th>
          <th className={`current`} data-col={'not-returning'}><div>NOT RETURNING<br/><small>NEXT YEAR</small></div></th>
          <th className={`current`} data-col={'returning-loa'}><div>Returning L.O.A.</div></th>
          {
            currentFutureStatuses.map((status, index) => (<th
              className={`current ${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`}
              key={`current-${status.Code || 'no-status'}`} data-col={`future-${status.Code || 'no-status'}`}><div>{status.Description || ''}</div>
            </th>))
          }
          <th className={`current total border-right`} data-col={'total-year-end'}><div>TOTAL<br/><small>AT YEAR END</small></div></th>


          {/* Future columns */}
          <th className={`future`} data-col={'continued-prev'}><div>Continued<br/><small>from {currentYear}</small></div></th>
          <th className={`future`} data-col={'loa'}><div>Returning L.O.A<br/><small>from {currentYear}</small></div></th>
          {
            futureStatuses.map((status, index) => (<th
              className={`future`}
              key={`future-${status.Code || 'no-status'}`}><div>{status.Description || ''}</div>
            </th>))
          }
          <th className={`total future border-right`}><div>Total START</div></th>

        </tr>
        </thead>
        <tbody>
        {
          visibleRows
            .filter(row => row.key !== 'grand-total')
            .map(row => getTR(row))
        }
        </tbody>
        {visibleRows.some(row => row.key === 'grand-total') && (
          <tfoot>
          {
            visibleRows
              .filter(row => row.key === 'grand-total')
              .map(row => getTR(row))
          }
          </tfoot>
        )}
      </Table>
    )
  }


  return <Wrapper>
    <PanelTitle className={"title-row section-row display-flex align-items-center gap-2 justify-content-between"}>
      <FlexContainer className={'gap-2 align-items-center justify-content-start'}>
        <FlexContainer className={'gap-2 align-items-center justify-content-start'}>
          <b className={"title"}>Campuses: </b>
          <SynCampusSelector
            className={"campus-selector"}
            allowClear={false}
            isMulti
            limitedCodes={MGG_CAMPUS_CODES}
            values={selectedCampusCodes}
            onSelect={values => {
              const codes = (values === null
                  ? []
                  : Array.isArray(values)
                    ? values
                    : [values]
              )
                .map(value => `${value?.value || ''}`.trim())
                .filter(code => code !== "");
              setSelectedCampusCodes(codes);
            }}
          />
        </FlexContainer>
        <FlexContainer className={'gap-2 align-items-center justify-content-start'}>
          <ButtonGroup>
            {
              Object.values(FullFeeStudentsTypes).map(type => {
                return <Button key={type} onClick={() => {setSelectedFullFeeStudentType(type)}} variant={type === selectedFullFeeStudentType ? 'info' : 'light'}>{type}</Button>
              })
            }
          </ButtonGroup>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer className={'gap-4 align-items-center justify-content-end'}>
        {
          transitionDate && (
            <>
              <FlexContainer className={'gap-2 align-items-center justify-content-start'}>
                <small>Trans. Date:</small>
                <small>{moment(transitionDate.TransitionStartAt).format('ll')}</small>
                <small>~</small>
                {transitionDate.TransitionEndAt && <small>{moment(transitionDate.TransitionEndAt).format('ll')}</small>}
              </FlexContainer>
              <FlexContainer className={'gap-2 align-items-center justify-content-start'}>
                <label className={'text-white'}>Show Trans. Cols?</label>
                <ToggleBtn size={'sm'} on={'Show Trans. Cols'} off={'Hide Trans. Cols'} checked={showTransitColumns} onChange={() => setShowTransitColumns(!showTransitColumns)} />
              </FlexContainer>
            </>
          )
        }
        <LoadingBtn size={'sm'} variant={'outline-light'} onClick={() => { setForceReload(prevState => prevState + 1)}} isLoading={isLoading}><ArrowClockwise /> Refresh</LoadingBtn>
        <LoadingBtn size={'sm'} variant={'outline-light'} onClick={onExportPdf} isLoading={isLoading || isExporting}><FileEarmarkPdf /> Export PDF</LoadingBtn>
      </FlexContainer>
    </PanelTitle>
    {getContent()}
  </Wrapper>
}

export default EnrolmentDashboardPanel;
