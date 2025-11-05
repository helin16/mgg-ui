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
  SYN_STUDENT_STATUS_ID_REPEATING,
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
            writing-mode: vertical-rl;   /* make text vertical */
            text-orientation: mixed;     /* keep characters upright */
            transform: rotate(180deg);   /* flip so it goes bottom → top */
            white-space: nowrap;         /* prevent wrapping */
            text-align: left !important;
        }
    }
`;
const EnrolmentDashboardPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = moment().year();
  const nextYear = MathHelper.add(currentYear, 1);
  const lastYear = MathHelper.sub(currentYear, 1);
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
      }), {});
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

  const getCurrentPastTds = (leftStudents: iVPastAndCurrentStudent[], yrLvls: iSynLuYearLevel[] = []) => {
    return (
      <>
        <td className={'current-past'} key={'left'}>
          {
            getClickableNumber(
              getStudents(leftStudents.filter((student) => {
                  const returningDate = `${student.StudentReturningDate || ''}`.trim();
                  if (returningDate === '') {
                    return true;
                  }
                  return moment(returningDate).isSameOrBefore(moment());
                }
              ), yrLvls))
          }
        </td>
        <td className={'current-past'} key={'loa'}>
          {
            getClickableNumber(getStudents(leftStudents.filter((student) => {
              const returningDate = `${student.StudentReturningDate || ''}`.trim();
              if (returningDate === '') {
                return false;
              }
              return moment(returningDate).isAfter(moment());
            }), yrLvls))
          }
        </td>
        <td className={'current-past total border-right sm'} key={'left-total'}>{getClickableNumber(getStudents(leftStudents, yrLvls))}</td>
      </>
    )
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
                className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`}
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
    ]);
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
  const getTR = (data: iGetTR, title: React.ReactNode, key: string, className: string) => {
    const { yrLvls, currentStudents, futureStudents } = data;

    const leftStudents = currentStudents.filter(student => moment(student.StudentLeavingDate).isSameOrBefore(moment()));

    const futureStudentsCurrentYear = futureStudents.filter(student => student.FileYear === currentYear);

    const currentNotLeftStudents = getStudentsNotLeftYet(currentStudents);
    const continuedStudentsFromLastYear = currentNotLeftStudents.filter(student => moment(student.StudentEntryDate).year() < currentYear);
    const newStudentsCurrentYear = currentNotLeftStudents.filter(student => moment(student.StudentEntryDate).year() === currentYear);

    const normalStudentsThisYear_notLeaving = getStudentsNotLeftYet(continuedStudentsFromLastYear).filter(student => `${student.StudentLeavingDate || ''}`.trim() === '');
    const normalStudentsThisYear_leaving = getStudentsNotLeftYet(continuedStudentsFromLastYear).filter(student => `${student.StudentLeavingDate || ''}`.trim() !== '' &&  moment(`${student.StudentLeavingDate || ''}`.trim()).isAfter(moment()));
    const normalStudentsThisYear_leaving_notComeBack = normalStudentsThisYear_leaving.filter(student => `${student.StudentReturningDate || ''}`.trim() === '');
    const normalStudentsThisYear_leaving_willComeBack = normalStudentsThisYear_leaving.filter(student => `${student.StudentReturningDate || ''}`.trim() !== '' &&  moment(`${student.StudentReturningDate || ''}`.trim()).isAfter(moment()));

    const startBeginningOfYear = newStudentsCurrentYear.filter(student => moment(student.StudentEntryDate).month() === 0);
    const startDuringYearStudents = newStudentsCurrentYear.filter(student => moment(student.StudentEntryDate).month() > 0);

    const normalStudentsThisYear_notLeaving_noStatus = normalStudentsThisYear_notLeaving.filter(student => [SYN_STUDENT_STATUS_ID_REPEATING].indexOf(student.StudentStatus) < 0)
    const studentsToday = getUniqStudents([
      ...normalStudentsThisYear_notLeaving,
      ...normalStudentsThisYear_leaving_willComeBack,
      ...normalStudentsThisYear_leaving_notComeBack,
      ...startBeginningOfYear,
      ...startDuringYearStudents,
    ]);
    const studentsEndOfCurrentYear = getUniqStudents([
      ...studentsToday,
      ...futureStudentsCurrentYear,
    ]).filter(student => {
      const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
      if (leavingDate === '') {
        return true;
      }
      return moment(leavingDate).isAfter(moment().endOf('year'));
    });

    return <tr key={key} className={className}>
      <td className={'border-right'} key={'year-level'}>{title}</td>
      {getCurrentPastTds(leftStudents, yrLvls)}
      {getCurrentFutureTds(futureStudentsCurrentYear, newStudentsCurrentYear, yrLvls)}

      <td
        className={'current-current'}>{getClickableNumber(getStudents(normalStudentsThisYear_notLeaving_noStatus, yrLvls))}</td>
      <td>{getClickableNumber(getStudents(normalStudentsThisYear_notLeaving, yrLvls, [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
      <td className={'current-current'}>{getClickableNumber(getStudents(startBeginningOfYear, yrLvls))}</td>
      <td className={'current-current'}>{getClickableNumber(getStudents(startDuringYearStudents, yrLvls))}</td>
      <td>{getClickableNumber(getStudents(normalStudentsThisYear_leaving_willComeBack, yrLvls))}</td>
      <td>{getClickableNumber(getStudents(normalStudentsThisYear_leaving_notComeBack, yrLvls))}</td>
      <td className={'total border-right sm'}>{getClickableNumber(getStudents(studentsToday, yrLvls))}</td>
      <td className={'border-right'}>{getClickableNumber(getStudents(studentsEndOfCurrentYear, yrLvls))}</td>

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
          <th colSpan={MathHelper.add(currentFutureStatuses.length, 11)} className={'current border-right'}>{currentYear}</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 3)} className={'future'}>{nextYear}</th>
        </tr>
        <tr>
          <th className={'border-right'}></th>
          <th colSpan={3} className={`current-past border-right sm`}>Past {currentYear}</th>
          {currentFutureStatuses.length > 0 && (<th colSpan={currentFutureStatuses.length} className={'current-future border-right sm'}>Future {currentYear}</th>)}
          <th colSpan={8} className={`current-current  border-right`}>Current {currentYear}</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 3)} className={'future'}>Future {nextYear}</th>
        </tr>
        <tr className={'count-header'}>
          <th className={'border-right'}></th>
          <th className={`current-past`}>LEFT MGGS <br />DURING YEAR</th>
          <th className={`current-past`}>L.O.A<br/><small>(RETURNING)</small></th>
          <th className={`total current-past border-right sm`}>TOTAL</th>

          {
            currentFutureStatuses.map((status, index) => (<th
              className={`current-future ${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`}
              key={`current-${status.Code || 'no-status'}`}>{status.Description || ''}</th>))
          }

          <th className={`current-current`}>Continued<br/><small>from {lastYear}</small></th>
          <th className={`current-current`}>REPEATING<br /><small>YEAR LEVEL</small></th>
          <th className={`current-current`}>New<br/><small>(start of year)</small></th>
          <th className={`current-current`}>New<br/><small>(during year)</small></th>
          <th className={`current-current`}>APPROVED<br/><small>FUTURE L.O.A.</small></th>
          <th className={`current-current`}>NOT RETURNING<br/>NEXT YEAR</th>
          <th className={`current-current total`}>TOTAL<br/>TODAY</th>
          <th className={`current-current border-right`}>Total<br/><small>At Year End</small></th>


          <th className={`future`}>Continued<br/><small>from {currentYear}</small></th>
          <th className={`future`}>Returning L.O.A<br/><small>from {currentYear}</small></th>

          {
            futureStatuses.map((status, index) => (<th
              className={`future`}
              key={`future-${status.Code || 'no-status'}`}>{status.Description || ''}</th>))
          }
          <th className={`total future border-right`}>Total START</th>

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
      <FlexContainer className={'gap-2 align-items-center justify-content-end'}>
        <LoadingBtn size={'sm'} variant={'outline-light'} onClick={() => { setForceReload(prevState => prevState + 1)}} isLoading={isLoading}><ArrowClockwise /> Refresh</LoadingBtn>
      </FlexContainer>
    </PanelTitle>
    {getContent()}
  </Wrapper>
}

export default EnrolmentDashboardPanel;
