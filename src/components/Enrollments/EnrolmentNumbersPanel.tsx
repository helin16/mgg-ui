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
  SYN_STUDENT_STATUS_ID_LEAVING, SYN_STUDENT_STATUS_ID_NEW, SYN_STUDENT_STATUS_ID_NORMAL,
  SYN_STUDENT_STATUS_ID_REPEATING,
  SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE
} from '../../types/Synergetic/Student/iVStudent';
import ExplanationPanel from '../ExplanationPanel';
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
import ToggleBtn from '../common/ToggleBtn';

enum FullFeeStudentsTypes {
  All = 'All',
  DomesticOnly = 'Domestic ONLY',
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
            border-right: 1px #aaa solid;
        }
    }
    td {
        border-right: 1px #efefef solid;
    }
    tr {
        >:first-child {
            width: 200px;
            text-align: right;
        }
    }
    .campus-total {
        background-color: #eee;
        font-weight: bold;
        text-transform: uppercase;
        * {
            font-weight: bold;
        }
    }
    .total-header {
        background-color: blue !important;
        color: white;
    }
    th {
        text-transform: uppercase;
        width: 80px;
    }
    tr.count-header {
      th {
          writing-mode: vertical-rl;   /* make text vertical */
          text-orientation: mixed;     /* keep characters upright */
          transform: rotate(180deg);   /* flip so it goes bottom → top */
          white-space: nowrap;         /* prevent wrapping */
      }
    }
    th.current-past,
    th.current-future {
        background-color: #aaa;
        color: white;
    }
    th.current-current {
        background-color: #ccc;
    }
    th.future {
        background-color: #666;
        color: white;
    }
    tfoot,
    tbody {
        td {
            text-align: right;
            vertical-align: middle;
        }
    }
`;
const EnrolmentNumbersPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFullFeeStudentType, setSelectedFullFeeStudentType] = useState(FullFeeStudentsTypes.All);
  const [campusMap, setCampusMap] = useState<iCampusMap>({});
  const [yearLevelCampusMap, setYearLevelCampusMap] = useState<iYearLevelMap>({});
  const [currentStudentsMap, setCurrentStudentsMap] = useState<iStudentMap>({});
  const [futureStudentsMap, setFutureStudentsMap] = useState<iStudentMap>({});
  const currentYear = moment().year();
  const nextYear = MathHelper.add(currentYear, 1);
  const lastYear = MathHelper.sub(currentYear, 1);
  const [selectedCampusCodes, setSelectedCampusCodes] = useState(MGG_CAMPUS_CODES);
  const [currentFutureStatuses, setCurrentFutureStatuses] = useState<iSynLuFutureStatus[]>([]);
  const [futureStatuses, setFutureStatuses] = useState<iSynLuFutureStatus[]>([]);
  const [yearLevels, setYearLevels] = useState<iSynLuYearLevel[]>([]);
  const [forceReload, setForceReload] = useState(0);
  const [showingExplanationPanel, setShowingExplanationPanel] = useState(false);

  useEffect(() => {
    let isCancel = false;
    setIsLoading(true);
    Promise.all([
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
        where: JSON.stringify({StudentCampus: MGG_CAMPUS_CODES, FileYear: currentYear}),
        sort: `FileSemester:ASC`,
        perPage: 9999999999,
      }),
      SynVFutureStudentService.getAll({
        where: JSON.stringify({FutureCampus: MGG_CAMPUS_CODES, FutureEnrolYear: [nextYear, currentYear]}),
        perPage: 9999999999,
      })
    ]).then(([module, futureStatuses, campuses, yLevels, currentAndPastStudentResult, futureStudentResult]) => {
      if (isCancel) { return }
      const yearLvlMap = yLevels.reduce((map, yLevel) => ({
        ...map,
        [yLevel.Code]: yLevel,
      }), {})
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
      setYearLevels(yLevels);
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
    }).catch(err => {
      if (isCancel) { return }
      Toaster.showApiError(err)
    }).finally(() => {
      if (isCancel) { return }
      setIsLoading(false)
    })
    return () => {
      isCancel = true;
    }
  }, [currentYear, selectedCampusCodes, nextYear, forceReload]);

  const getStudents = (students: iVPastAndCurrentStudent[], yearLevels: iSynLuYearLevel[] = [], statuses: string[] = []) => {
    return _.uniqBy(students, (student) => student.ID).filter(student => {
      const yearLevelCodes = yearLevels.map(yl => yl.Code);
      const withinYearLevel = yearLevelCodes.indexOf(student.StudentYearLevel) >=0;
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


  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }

    const selectedYearLevels = Object.keys(yearLevelCampusMap).filter(campusCode => selectedCampusCodes.indexOf(campusCode) >= 0).reduce((arr: iSynLuYearLevel[], campusCode) => [...arr, ...(yearLevelCampusMap[campusCode] || [])], []);
    const currentStudents = Object.values(currentStudentsMap).filter(filterFullFeeFlag);
    const currentNotLeftStudents = currentStudents.filter(student => `${student.StudentLeavingDate || ''}`.trim() === '' || moment(student.StudentLeavingDate).isAfter(moment()));
    const currentNotLeftStudents_started = currentNotLeftStudents.filter(student => moment(student.StudentEntryDate).isSameOrBefore(moment()));
    const currentNotLeavingNextYearStudents = currentStudents.filter(student => `${student.StudentLeavingDate || ''}`.trim() === '' || moment(student.StudentLeavingDate).isAfter(moment().add(1, 'year').startOf('year')));
    const newStudentsThisYear = currentNotLeftStudents.filter(student => student.StudentStatus === SYN_STUDENT_STATUS_ID_NEW);
    const normalStudentsThisYear = currentNotLeftStudents.filter(student => student.StudentStatus === SYN_STUDENT_STATUS_ID_NORMAL);
    const leftStudents = currentStudents.filter(student => moment(student.StudentLeavingDate).isSameOrBefore(moment()));

    const startDuringYearStudents = newStudentsThisYear.filter(student => moment(student.StudentEntryDate).month() > 0);
    const startDuringYearStudents_started = startDuringYearStudents.filter(student => moment(student.StudentEntryDate).isSameOrBefore(moment()));
    const startDuringYearStudents_notStarted = startDuringYearStudents.filter(student => moment(student.StudentEntryDate).isAfter(moment()));
    const startBeginningOfYear = newStudentsThisYear.filter(student => moment(student.StudentEntryDate).month() === 0);

    const currentFutureStudents = Object.values(futureStudentsMap).filter(student => student.FileYear === currentYear).filter(filterFullFeeFlag);
    const nextYearStudents =  Object.values(futureStudentsMap).filter(student => student.FileYear === nextYear).filter(filterFullFeeFlag);
    const nextYearReturningStudents = [...currentStudents, ...nextYearStudents].filter(student => moment(student.StudentReturningDate).year() === nextYear);
    const currentNotLeavingNextYearStudents_notRepeating = currentNotLeavingNextYearStudents.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() === '')
    const currentNotLeavingNextYearStudents_repeating = currentNotLeavingNextYearStudents.filter(student => `${student.StudentOverrideNextYearLevel || ''}`.trim() !== '')
    const studentsFromLowerYearLevelMap: {[key: string]: iVPastAndCurrentStudent[]} = yearLevels.reduce((map, yrLvl) => {
      const currentYearLvlIndex = _.findIndex(yearLevels, yearLvl => yearLvl.Code === yrLvl.Code);
      const previousIndex = currentYearLvlIndex - 1;
      const previousYearLevel = yearLevels[previousIndex] || null;
      const studentsFromLowerYearLevel = previousYearLevel === null ? [] : getStudents(currentNotLeavingNextYearStudents_notRepeating, [previousYearLevel])
      return {
        ...map,
        [yrLvl.Code]: [...studentsFromLowerYearLevel, ...currentNotLeavingNextYearStudents_repeating.filter(student => {
          return `${student.StudentOverrideNextYearLevel || ''}`.trim() === `${yrLvl.Code}`
        })],
      }
    }, {});
    const studentsReturningNextYearLevelMap: {[key: string]: iVPastAndCurrentStudent[]} = yearLevels.reduce((map, yrLvl) => {
      const studentsReturningYearLevel = getStudents(nextYearReturningStudents, [yrLvl]);

      const currentYearLvlIndex = _.findIndex(yearLevels, yearLvl => yearLvl.Code === yrLvl.Code);
      const nextYrLvlIndex = currentYearLvlIndex + 1;
      const nextYearLvl = yearLevels[nextYrLvlIndex] || null;
      if (!nextYearLvl) {
        return map;
      }
      return {
        ...map,
        [nextYearLvl.Code]: studentsReturningYearLevel
      }
    }, {});

    return (
      <Table hover size={'sm'}>
        <thead>
        <tr>
          <th rowSpan={2} className={'border-right'}></th>
          <th colSpan={MathHelper.add(currentFutureStatuses.length, 8)} className={'text-center current-current'}>{currentYear}</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 3)} className={'future text-center'}>{nextYear}</th>
        </tr>
        <tr>
          <th colSpan={currentFutureStatuses.length} className={`current-future text-center`}>Future</th>
          <th colSpan={7} className={`current-current text-center`}>Current</th>
          <th className={'current-past text-center'}>Past</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 3)} className={'future text-center'}>Future</th>
        </tr>
        <tr className={'count-header'}>
          <th className={'border-right'}></th>
          {
            currentFutureStatuses.map((status, index) => (<th
              className={`current-future ${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`}
              key={`current-${status.Code || 'no-status'}`}>{status.Description || ''}</th>))
          }

          <th className={`current-current`}>Continued<br/><small>from {lastYear}</small></th>
          <th className={`current-current`}>New<br/><small>(start of year)</small></th>
          <th className={`current-current`}>New<br/><small>(during year)</small></th>
          <th className={`current-current`}>Repeating<br/><small>level in {nextYear}</small></th>
          <th className={`current-current`}>Leave of<br/><small>absence</small></th>
          <th className={`current-current`}>Leaving</th>
          <th className={`total-header current-current`}>Total</th>
          <th className={`current-past`}>LEFT</th>

          {/* future */}
          <th className={`future`}>Continue <br/><small>From {currentYear}</small></th>
          <th className={`future`}>Returning <br/><small>in {nextYear}</small></th>
          {
            futureStatuses.map(status => (
              <th className={`future`} key={`future-${status.Code || 'no-status'}`}>{status.Description || ''}</th>))
          }
          <th className={`total-header future`}>Total</th>
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
                    (campusYearLevels).map((yearLevel) => {
                      return (
                        <tr key={`${campusCode}-${yearLevel.YearLevelSort}`} className={'year-level-row'}>
                          <td className={'border-right'}>{yearLevel.Description}</td>

                          {
                            currentFutureStatuses.map((status, index) => {
                              return (
                                <td
                                  className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`}
                                  key={status.Code || ''}>
                                  {
                                    getClickableNumber(
                                      [
                                        ...getStudents(currentFutureStudents,[yearLevel],[status.Code]),
                                        ...(status.Code === FUTURE_STUDENT_STATUS_FINALISED ? getStudents(startDuringYearStudents_notStarted, [yearLevel]) : [])
                                      ]
                                    )
                                  }
                                </td>
                              )
                            })
                          }

                          <td>{getClickableNumber(getStudents(normalStudentsThisYear, [yearLevel]))}</td>
                          <td>{getClickableNumber(getStudents(startBeginningOfYear, [yearLevel]))}</td>
                          <td>{getClickableNumber(getStudents(startDuringYearStudents_started, [yearLevel]))}</td>
                          <td>{getClickableNumber(getStudents(currentNotLeftStudents, [yearLevel], [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
                          <td>{getClickableNumber(getStudents(currentNotLeftStudents, [yearLevel], [SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE]))}</td>
                          <td>{getClickableNumber(getStudents(currentNotLeftStudents, [yearLevel], [SYN_STUDENT_STATUS_ID_LEAVING]))}</td>
                          <td
                            className={'border-right sm'}>{getClickableNumber(getStudents(currentNotLeftStudents_started, [yearLevel]))}</td>
                          <td className={'border-right'}>{getClickableNumber(getStudents(leftStudents, [yearLevel]))}</td>

                          {/* future */}
                          <td>{yearLevel.Code in studentsFromLowerYearLevelMap ? getClickableNumber(studentsFromLowerYearLevelMap[yearLevel.Code]) : ''}</td>
                          <td>{yearLevel.Code in studentsReturningNextYearLevelMap ? getClickableNumber(studentsReturningNextYearLevelMap[yearLevel.Code]) : ''}</td>
                          {/*<td>{previousYearLevel?.Code}</td>*/}
                          {
                            futureStatuses.map((status, index) => (<td
                              key={status.Code || ''}>{getClickableNumber(getStudents(nextYearStudents, [yearLevel], [status.Code]))}</td>))
                          }
                          <td>{getClickableNumber([
                            ...studentsFromLowerYearLevelMap[yearLevel.Code],
                            ...getStudents([...nextYearStudents], [yearLevel], futureStatuses.map(status => status.Code)),
                            ...(yearLevel.Code in studentsReturningNextYearLevelMap ? studentsReturningNextYearLevelMap[yearLevel.Code] : []),
                          ])}</td>
                        </tr>
                      )
                    })
                  }
                  <tr key={`${campusCode}-total`} className={'campus-total'}>
                    <td
                      className={'border-right'}>{campusCode in campusMap ? campusMap[campusCode].Description : campusCode}</td>
                    {
                      currentFutureStatuses.map((status, index) => {
                        return (
                          <td className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`} key={status.Code || ''}>
                            {getClickableNumber([
                              ...getStudents(currentFutureStudents, campusYearLevels, [status.Code]),
                              ...(status.Code === FUTURE_STUDENT_STATUS_FINALISED ? getStudents(startDuringYearStudents_notStarted, campusYearLevels) : [])
                            ])}
                          </td>
                        );
                      })
                    }

                    <td>{getClickableNumber(getStudents(normalStudentsThisYear, campusYearLevels))}</td>
                    <td>{getClickableNumber(getStudents(startBeginningOfYear, campusYearLevels))}</td>
                    <td>{getClickableNumber(getStudents(startDuringYearStudents_started, campusYearLevels))}</td>
                    <td>{getClickableNumber(getStudents(currentNotLeftStudents, campusYearLevels, [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
                    <td>{getClickableNumber(getStudents(currentNotLeftStudents, campusYearLevels, [SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE]))}</td>
                    <td>{getClickableNumber(getStudents(currentNotLeftStudents, campusYearLevels, [SYN_STUDENT_STATUS_ID_LEAVING]))}</td>
                    <td
                      className={'border-right sm'}>{getClickableNumber(getStudents(currentNotLeftStudents_started, campusYearLevels))}</td>
                    <td className={'border-right'}>{getClickableNumber(getStudents(leftStudents, campusYearLevels))}</td>

                    {/* future */}
                    <td>
                      {
                        getClickableNumber(
                          campusYearLevels.reduce(
                            (arr: iVPastAndCurrentStudent[], yrLvl) => ([...arr, ...(yrLvl.Code in studentsFromLowerYearLevelMap ? studentsFromLowerYearLevelMap[yrLvl.Code] : [])]),
                            []
                          )
                        )
                      }
                    </td>
                    <td>
                      {
                        getClickableNumber(campusYearLevels.reduce(
                          (arr: iVPastAndCurrentStudent[], yrLvl) => ([...arr, ...(yrLvl.Code in studentsReturningNextYearLevelMap ? studentsReturningNextYearLevelMap[yrLvl.Code] : [])]),
                          []
                        ))
                      }
                    </td>
                    {
                      futureStatuses.map((status, index) => (<td key={status.Code || ''}>{getClickableNumber(getStudents(nextYearStudents, campusYearLevels, [status.Code]))}</td>))
                    }
                    <td>
                      {
                        getClickableNumber([
                          ...campusYearLevels.reduce(
                            (arr: iVPastAndCurrentStudent[], yrLvl) => ([...arr, ...(yrLvl.Code in studentsFromLowerYearLevelMap ? studentsFromLowerYearLevelMap[yrLvl.Code] : [])]),
                            []
                          ),
                          ...getStudents(nextYearStudents, campusYearLevels, futureStatuses.map(status => status.Code)),
                          ...campusYearLevels.reduce(
                            (arr: iVPastAndCurrentStudent[], yrLvl) => ([...arr, ...(yrLvl.Code in studentsReturningNextYearLevelMap ? studentsReturningNextYearLevelMap[yrLvl.Code] : [])]),
                            []
                          ),
                        ])
                      }
                    </td>
                  </tr>
                </>
              )
            })
        }
        </tbody>
        {selectedCampusCodes.length > 1 && (
          <tfoot>
          <tr className={'campus-total'}>
            <td className={'border-right'}>Total</td>

            {
              currentFutureStatuses.map((status, index) => {
                return (
                  <td className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`} key={status.Code || ''}>
                    {
                      getClickableNumber([
                        ...getStudents(currentFutureStudents, selectedYearLevels, [status.Code]),
                        ...(status.Code === FUTURE_STUDENT_STATUS_FINALISED ? getStudents(startDuringYearStudents_notStarted, selectedYearLevels) : [])
                      ])
                    }
                  </td>
                )
              })
            }

            <td>{getClickableNumber(getStudents(normalStudentsThisYear, selectedYearLevels))}</td>
            <td>{getClickableNumber(getStudents(startBeginningOfYear, selectedYearLevels))}</td>
            <td>{getClickableNumber(getStudents(startDuringYearStudents_started, selectedYearLevels))}</td>
            <td>{getClickableNumber(getStudents(currentNotLeftStudents, selectedYearLevels, [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
            <td>{getClickableNumber(getStudents(currentNotLeftStudents, selectedYearLevels, [SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE]))}</td>
            <td>{getClickableNumber(getStudents(currentNotLeftStudents, selectedYearLevels, [SYN_STUDENT_STATUS_ID_LEAVING]))}</td>
            <td className={'border-right sm'}>{getClickableNumber(getStudents(currentNotLeftStudents_started.filter(student => selectedCampusCodes.indexOf(student.StudentCampus) >= 0)))}</td>
            <td className={'border-right'}>{getClickableNumber(getStudents(leftStudents.filter(student => selectedCampusCodes.indexOf(student.StudentCampus) >= 0)))}</td>

            {/* future */}
            <td>
              {
                getClickableNumber(selectedYearLevels.reduce((arr: iVPastAndCurrentStudent[], selectedYearLevel) => [...arr, ...(studentsFromLowerYearLevelMap[selectedYearLevel.Code] || [])], []))
              }
            </td>
            <td>
              {
                getClickableNumber(getStudents(nextYearReturningStudents, selectedYearLevels))
              }
            </td>
            {
              futureStatuses.map((status, index) => (<td key={status.Code || ''}>{getClickableNumber(getStudents(nextYearStudents, selectedYearLevels, [status.Code]))}</td>))
            }
            <td>
              {
                getClickableNumber([
                  ...selectedYearLevels.reduce((arr: iVPastAndCurrentStudent[], selectedYearLevel) => [...arr, ...(studentsFromLowerYearLevelMap[selectedYearLevel.Code] || [])], []),
                  ...getStudents(nextYearStudents, selectedYearLevels, futureStatuses.map(status => status.Code)),
                  ...selectedYearLevels.reduce((arr: iVPastAndCurrentStudent[], selectedYearLevel) => [...arr, ...(studentsReturningNextYearLevelMap[selectedYearLevel.Code] || [])], []),
                ])
              }
            </td>
          </tr>
          </tfoot>
        )}
      </Table>
    )
  }

  const getExplanationPanel = () => {
    if (showingExplanationPanel !== true) {
      return null;
    }
    return (
      <ExplanationPanel
        variant={'info'}
        dismissible
        onDismiss={() => { setShowingExplanationPanel(false) }}
        text={
          <FlexContainer>
            <div>
              Future students for <u><b>{currentYear}</b></u>:
              <ul>
                {
                  currentFutureStatuses.map((status) => (
                    <li key={status.Code}><b>{status.Description}</b>: All future student has EnrolYear
                      in {currentYear} and with status <u>{status.Description}</u>{status.Code === FUTURE_STUDENT_STATUS_FINALISED ? <> <br />and any current students in <b>NEW (During Year)</b> with <b>EntryDate in the future</b></> : null}.</li>))
                }
              </ul>
            </div>
            <div>
              Current students for <u><b>{currentYear}</b></u>:
              <ul>
                <li><b>CONTINUED <small>from {lastYear}</small></b>: All students' entry date is before
                  Jan {currentYear}</li>
                <li><b>NEW (Start of Year)</b>: All current students' status {SYN_STUDENT_STATUS_ID_NEW}(NEW) on 1st of
                  Jan {currentYear}</li>
                <li><b>NEW (During Year)</b>: All current students' status {SYN_STUDENT_STATUS_ID_NEW}(NEW) after 1st of
                  Jan {currentYear}</li>
                <li><b>REPEATING</b>: All current students' status
                  is <b>{SYN_STUDENT_STATUS_ID_REPEATING}</b> (Repeating).
                </li>
                <li><b>LEAVE OF ABSENCE</b>: All current students' status
                  is <b>{SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE}</b> and having a leaving date in the future.
                </li>
                <li><b>LEAVING</b>: All current students' status is <b>{SYN_STUDENT_STATUS_ID_LEAVING}(Leaving)</b> and
                  leaving date is in the future.
                </li>
                <li><b>LEFT</b>: All current students(including LOA)' leaving date is in the past.</li>
              </ul>
            </div>
            <div>
              Future students for <u><b>{nextYear}</b></u>:
              <ul>
                <li>
                  <b>CONTINUED <small>from {currentYear}</small></b>: All current students' (from lower year level or repeating the current year level) who
                  has no leaving date or leaving date is after 1st of Jan {nextYear}
                </li>
                <li>
                  <b>RETURNING <small>in {nextYear}</small></b>: All current students or future students has returning date in {nextYear}.
                </li>
                {
                  futureStatuses.map((status) => (
                    <li key={status.Code}><b>{status.Description}</b>: All future student has EnrolYear
                      in {nextYear} and with status <u>{status.Description}</u>.</li>))
                }
              </ul>
            </div>
          </FlexContainer>}
      />
    )
  }

  return <Wrapper>
    {getExplanationPanel()}
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
      <FlexContainer className={'gap-2 align-items-center justify-content-end'}>
        <label className={'display-flex gap-2 align-items-center justify-content-start'}>
          <span className={'text-white'}>Show/Hide Explanation Panel</span>
          <ToggleBtn size={'sm'} on={'Show Expl.'} off={'Hide Expl.'} checked={showingExplanationPanel} onChange={() => setShowingExplanationPanel(!showingExplanationPanel)} />
        </label>
        <LoadingBtn size={'sm'} variant={'outline-light'} onClick={() => { setForceReload(prevState => prevState + 1)}} isLoading={isLoading}><ArrowClockwise /> Refresh</LoadingBtn>
      </FlexContainer>
    </PanelTitle>
    {getContent()}
  </Wrapper>
}

export default EnrolmentNumbersPanel;
