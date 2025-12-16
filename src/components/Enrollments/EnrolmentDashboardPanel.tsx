import styled from 'styled-components';
import MathHelper from '../../helper/MathHelper';
import moment from 'moment-timezone';
import {Button, Spinner, Table} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
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
import {FUTURE_STUDENT_STATUS_FINALISED} from '../../types/Synergetic/iSynVFutureStudent';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {ArrowClockwise} from 'react-bootstrap-icons';
import LoadingBtn from '../common/LoadingBtn';
import SynLuTransitionDateService from '../../services/Synergetic/Lookup/SynLuTransitionDateService';
import iSynLuTransitionDate from '../../types/Synergetic/Lookup/iSynLuTransitionDate';
import ToggleBtn from '../common/ToggleBtn';
import SynFileSemesterService from '../../services/Synergetic/SynFileSemesterService';

enum FullFeeStudentsTypes {
  All = 'All',
  DomesticOnly = 'Domestic Only',
  InternationalOnly = 'International Only',
}

type iYearLevelMap = {[key: string]: iSynLuYearLevel[]}
type iCampusMap = {[key: string]: iSynLuCampus}
type iStudentMap = {[key: number]: iVPastAndCurrentStudent}
type iFutureStatusMap = {[key: string]: iSynLuFutureStatus}
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


  useEffect(() => {
    const getData = async () => {
      const result = await SynFileSemesterService.getFileSemesters({
        where: JSON.stringify({
          SystemCurrentFlag: true
        })
      });
      let cYear = moment().year();
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
      setCurrentStudentsMap((currentAndPastStudentResult.data || []).reduce((map: iStudentMap, student) => ({
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
  }, [selectedCampusCodes, forceReload]);

  const getStudents = (students: iVPastAndCurrentStudent[], yearLevels: iSynLuYearLevel[] = [], statuses: string[] = []) => {
    const yearLevelCodes = yearLevels.map(yl => `${yl.Code}`.trim());
    return _.uniqBy(students, (student) => student.ID).filter(student => {
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

  const getCurrentFutureTds = (currentFutureStudents: iVPastAndCurrentStudent[], newStudentsThisYear: iVPastAndCurrentStudent[], yrLvls: iSynLuYearLevel[] = []) => {
    const startDuringYearStudents = newStudentsThisYear.filter(student => moment(student.StudentEntryDate).month() > 0);
    // const startDuringYearStudents_started = startDuringYearStudents.filter(student => moment(student.StudentEntryDate).isSameOrBefore(moment()));
    const startDuringYearStudents_notStarted = startDuringYearStudents.filter(student => moment(student.StudentEntryDate).isAfter(moment()));

    return (
      <>
        {
          currentFutureStatuses.map((status, index) => {
            return (
              <td
                className={`current ${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`}
                data-col={`future-${status.Code || 'no-status'}`}
                key={status.Code || ''}>
                {
                  getClickableNumber(
                    [
                      ...getStudents(currentFutureStudents, yrLvls, [status.Code]),
                      ...(status.Code === FUTURE_STUDENT_STATUS_FINALISED ? getStudents(startDuringYearStudents_notStarted, yrLvls) : [])
                    ]
                  )
                }
              </td>
            )
          })
        }
      </>
    )
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

  const getFutureFutureTds = (studentsEndOfCurrentYear: iVPastAndCurrentStudent[], futureStudents: iVPastAndCurrentStudent[], leftStudents: iVPastAndCurrentStudent[], yrLvls: iSynLuYearLevel[] = []) => {
    const yrLvlCodes = yrLvls.map(yrLvl => `${yrLvl.Code}`.trim());
    const futureStatusCodes = futureStatuses.map(status => status.Code);
    const currentNotLeavingNextYearStudents_notRepeating = studentsEndOfCurrentYear.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() === '');
    const currentNotLeavingNextYearStudents_repeating = studentsEndOfCurrentYear.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() !== '');
    const studentsFromLowerYearLevelMap: {[key: string]: iVPastAndCurrentStudent[]} = yearLevels.reduce((map, yrLvl) => {
      const currentYearLvlIndex = _.findIndex(yearLevels, yearLvl => yearLvl.Code === yrLvl.Code);
      const previousIndex = currentYearLvlIndex - 1;
      const previousYearLevel = yearLevels[previousIndex] || null;
      const studentsFromLowerYearLevel = previousIndex < 0 || previousYearLevel === null ? [] : getStudents(currentNotLeavingNextYearStudents_notRepeating, [previousYearLevel])
      return {
        ...map,
        [`${yrLvl.Code}`.trim()]: [...studentsFromLowerYearLevel, ...currentNotLeavingNextYearStudents_notRepeating.filter(student => {
          return `${student.StudentOverrideNextYearLevel || ''}`.trim() === `${yrLvl.Code}`
        })],
      }
    }, {});
    const futureStudentsNextYear = getUniqStudents(
      futureStudents
      .filter(st => st.FileYear === nextYear)
      .filter(student => yrLvlCodes.length <= 0 ? true :  yrLvlCodes.indexOf(`${student.StudentEntryYearLevel}`.trim()) >= 0)
      .filter(student => futureStatusCodes.indexOf(`${student.StudentStatus}`.trim()) >=0 )
    );
    const repeatingStudents = getUniqStudents(currentNotLeavingNextYearStudents_repeating
      .filter(student => yrLvlCodes.length <= 0 ? true :  yrLvlCodes.indexOf(`${student.StudentOverrideNextYearLevel}`.trim()) >= 0));

    const studentsFromLowerYearLevel = Object.keys(studentsFromLowerYearLevelMap)
      .filter(yrLvlCode => yrLvlCodes.length <= 0 ? true : yrLvlCodes.indexOf(yrLvlCode) >=0)
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
            const currentYearLvlIndex = _.findIndex(yearLevels, yearLvl => yearLvl.Code === student.StudentYearLevel);
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
      ...futureStudentsNextYear,
    ])
    return (
      <>
        <td className={'future'} key={`future-continued`}>{getClickableNumber(getStudents(continuedFromCurrentYear))}</td>
        <td className={'future'} key={`future-loa`}>{getClickableNumber(getStudents(loaStudents))}</td>
        {
          futureStatusCodes.map((fStatusCode) => (
            <td key={`future-${fStatusCode}`} className={'future'}>{getClickableNumber(getStudents(futureStudentsNextYear, [], [fStatusCode]))}</td>
          ))
        }
        <td className={'future'} key={`future-total`}>{getClickableNumber(getStudents(futureStudentsNextYearTotal))}</td>
      </>
    )
  }

  type iGetTR = {
    currentStudents: iVPastAndCurrentStudent[];
    futureStudents: iVPastAndCurrentStudent[];
    yrLvls?: iSynLuYearLevel[]
  }
  const getTR = ({ yrLvls, currentStudents, futureStudents }: iGetTR, title: React.ReactNode, key: string, className: string) => {
    const leftStudents = currentStudents.filter(student => moment(student.StudentLeavingDate).isSameOrBefore(moment()));
    const continuedStudentsFromLastYear = currentStudents.filter(student => moment(student.StudentEntryDate).year() < currentYear);

    const futureStudentsCurrentYear = futureStudents.filter(student => student.FileYear === currentYear);

    const newStudentsCurrentYear = currentStudents.filter(student => moment(student.StudentEntryDate).year() === currentYear);


    const startBeginningOfYear = newStudentsCurrentYear.filter(student => moment(student.StudentEntryDate).month() === 0);
    const startDuringYearStudents = newStudentsCurrentYear.filter(student => moment(student.StudentEntryDate).month() > 0);

    const leftStudent_willComeBack = leftStudents.filter(student => `${student.StudentReturningDate || ''}`.trim() !== '' &&  moment(`${student.StudentReturningDate || ''}`.trim()).isAfter(moment()));
    const currentDay1 = [...continuedStudentsFromLastYear, ...startBeginningOfYear];
    const studentsToday = getUniqStudents(getStudentsNotLeftYet([
      ...currentDay1,
      ...startDuringYearStudents,
    ]));
    const normalStudentsThisYear_leaving = getStudentsNotLeftYet(studentsToday).filter(student => `${student.StudentLeavingDate || ''}`.trim() !== '' &&  moment(`${student.StudentLeavingDate || ''}`.trim()).isAfter(moment()));
    const normalStudentsThisYear_leaving_notComeBack = normalStudentsThisYear_leaving.filter(student => `${student.StudentReturningDate || ''}`.trim() === '');
    const normalStudentsThisYear_leaving_willComeBack = normalStudentsThisYear_leaving.filter(student => `${student.StudentReturningDate || ''}`.trim() !== '' &&  moment(`${student.StudentReturningDate || ''}`.trim()).isAfter(moment()));
    const studentsEndOfCurrentYear = getUniqStudents([
      ...studentsToday,
      ...futureStudentsCurrentYear,
    ]);
    const transitionedInStudents = transitionDate ? newStudentsCurrentYear.filter(st => moment(st.StudentEntryDate).isSameOrAfter(moment(transitionDate.TransitionStartAt))) : [];
    const transitionedOutStudents = transitionDate ? leftStudents.filter(st => moment(st.StudentLeavingDate).isSameOrAfter(moment(transitionDate.TransitionStartAt))) : [];
    return <tr key={key} className={className}>
      <td className={'border-right'}>{title}</td>
      <td className={'current'}
          data-col={'continued-prev'}>{getClickableNumber(getStudents(continuedStudentsFromLastYear, yrLvls))}</td>
      <td className={'current'}
          data-col={'start-of-year'}>{getClickableNumber(getStudents(startBeginningOfYear, yrLvls))}</td>
      <td className={'current total border-right sm'}
          data-col={'current-day-1'}>{getClickableNumber(getStudents(currentDay1, yrLvls))}</td>
      <td className={'current'}
          data-col={'start-during'}>{getClickableNumber(getStudents(startDuringYearStudents, yrLvls))}</td>
      <td className={'current'} data-col={'left-during'}>{getClickableNumber(getStudents(leftStudents, yrLvls))}</td>
      {
        showTransitColumns && (
          <>
            <td className={`current`} data-col={'transitioned-in'}>
              {getClickableNumber(getStudents(transitionedInStudents, yrLvls))}
            </td>
            <td className={`current`} data-col={'transitioned-out'}>
              {getClickableNumber(getStudents(transitionedOutStudents, yrLvls))}
            </td>
          </>
        )
      }
      <td className={'current'}
          data-col={'loa-during'}>{getClickableNumber(getStudents(leftStudent_willComeBack, yrLvls))}</td>
      <td className={'current total'}
          data-col={'total-today'}>{getClickableNumber(getStudents(studentsToday, yrLvls))}</td>


      <td className={'current'}
          data-col={'future-loa'}>{getClickableNumber(getStudents(normalStudentsThisYear_leaving_willComeBack, yrLvls))}</td>
      <td className={'current'}
          data-col={'not-returning'}>{getClickableNumber(getStudents(normalStudentsThisYear_leaving_notComeBack, yrLvls))}</td>
      {getCurrentFutureTds(currentStudents, futureStudentsCurrentYear, yrLvls)}
      <td className={'current total border-right'}
          data-col={'total-year-end'}>{getClickableNumber(getStudents(studentsEndOfCurrentYear, yrLvls))}</td>

      {getFutureFutureTds(studentsEndOfCurrentYear, futureStudents, leftStudents, yrLvls)}
    </tr>
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'}/>
    }

    const currentStudents = Object.values(currentStudentsMap).filter(filterFullFeeFlag);
    const futureStudents = Object.values(futureStudentsMap).filter(filterFullFeeFlag);
    return (
      <Table hover size={'sm'}>
        <thead>
        <tr>
          <th className={'border-right'}></th>
          <th colSpan={MathHelper.add(currentFutureStatuses.length, MathHelper.add(10, showTransitColumns ? 2 : 0))} className={'current border-right'}>{currentYear}</th>
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
          {currentFutureStatuses.length > 0 && (<th colSpan={currentFutureStatuses.length} className={'current border-right sm'} data-col={'future'}>Future {currentYear}</th>)}
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
          Object.keys(yearLevelCampusMap)
            .filter(campusCode => selectedCampusCodes.indexOf(campusCode) >= 0)
            .map(campusCode => {
              const campusYearLevels = yearLevelCampusMap[campusCode] || [];
              return (
                <>
                  {
                    // each year level
                    (campusYearLevels).map((yearLevel) => {
                      return getTR({
                        currentStudents,
                        futureStudents,
                        yrLvls: [yearLevel]
                      }, yearLevel.Description, `${campusCode}-${yearLevel.YearLevelSort}`, 'year-level-row');
                    })
                  }
                  {
                    // Campus total
                    getTR({
                      currentStudents,
                      futureStudents,
                      yrLvls: campusYearLevels
                    }, campusCode in campusMap ? campusMap[campusCode].Description : campusCode, `${campusCode}-total`, 'campus-total')
                  }
                </>
              )
            })
        }
        </tbody>
        {selectedCampusCodes.length > 1 && (
          <tfoot>
          {
            // Campus total
            getTR({
              currentStudents,
              futureStudents,
            }, 'Total', '', 'campus-total')
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
      </FlexContainer>
    </PanelTitle>
    {getContent()}
  </Wrapper>
}

export default EnrolmentDashboardPanel;
