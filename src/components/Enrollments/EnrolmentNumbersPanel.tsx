import styled from 'styled-components';
import MathHelper from '../../helper/MathHelper';
import moment from 'moment-timezone';
import {Spinner, Table} from 'react-bootstrap';
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
  SYN_STUDENT_STATUS_ID_LEAVING, SYN_STUDENT_STATUS_ID_NEW,
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

  useEffect(() => {
    let isCancel = false;
    setIsLoading(true);
    Promise.all([
      MggsModuleService.getModule(MGGS_MODULE_ID_ENROLLMENTS),
      SynLuFutureStatusService.getAll({}),
      SynLuCampusService.getAllCampuses({
        where: JSON.stringify({Code: selectedCampusCodes}),
      }),
      SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({Campus: selectedCampusCodes}),
        sort: `YearLevelSort:ASC`
      }),
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({StudentCampus: selectedCampusCodes, FileYear: currentYear}),
        sort: `FileSemester:ASC`,
        perPage: 9999999999,
      }),
      SynVFutureStudentService.getAll({
        where: JSON.stringify({FutureCampus: selectedCampusCodes, FutureEnrolYear: [nextYear, currentYear]}),
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
  }, [currentYear, selectedCampusCodes, nextYear]);

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
      records={sumArr || []}
      size={"sm"}
      variant={"link"}
    >
      {length}
    </StudentNumberDetailsPopupBtn>
  }


  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }

    const currentStudents = Object.values(currentStudentsMap);
    const newStudentsThisYear = currentStudents.filter(student => student.StudentStatus === SYN_STUDENT_STATUS_ID_NEW);
    const leavingStudents = currentStudents.filter(student => moment(student.StudentLeavingDate).isAfter(moment()));
    const leftStudents = currentStudents.filter(student => moment(student.StudentLeavingDate).isSameOrBefore(moment()));
    const startDuringYearStudents = newStudentsThisYear.filter(student => moment(student.StudentEntryDate).month() > 0);
    const startBeginningOfYear = newStudentsThisYear.filter(student => moment(student.StudentEntryDate).month() === 0);
    const startBeforeCurrent = currentStudents.filter(student => moment(student.StudentEntryDate).isBefore(moment().year(currentYear).startOf('year')));
    const currentFutureStudents = Object.values(futureStudentsMap).filter(student => student.FileYear === currentYear);

    const nextYearStudents =  Object.values(futureStudentsMap).filter(student => student.FileYear === nextYear);
    return (
      <Table hover size={'sm'}>
        <thead>
        <tr>
          <th rowSpan={2} className={'border-right'}></th>
          <th colSpan={MathHelper.add(currentFutureStatuses.length, 8)} className={'text-center current-current'}>{currentYear}</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 1)} className={'future text-center'}>{nextYear}</th>
        </tr>
        <tr>
          <th colSpan={currentFutureStatuses.length} className={`current-future text-center`}>Future</th>
          <th colSpan={7} className={`current-current text-center`}>Current</th>
          <th className={'current-past text-center'}>Past</th>
          <th colSpan={MathHelper.add(futureStatuses.length, 1)} className={'future text-center'}>Future</th>
        </tr>
        <tr className={'count-header'}>
          <th className={'border-right'}></th>
          {
            currentFutureStatuses.map((status, index) => (<th className={`current-future ${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`} key={status.Code || ''}>{status.Description || ''}</th>))
          }

          <th className={`current-current`}>New<br/><small>(during year)</small></th>
          <th className={`current-current`}>New<br/><small>(start of year)</small></th>
          <th className={`current-current`}>Continued<br/><small>from {lastYear}</small></th>
          <th className={`current-current`}>Repeating<br/><small>level in {nextYear}</small></th>
          <th className={`current-current`}>Leave of<br/><small>absence</small></th>
          <th className={`current-current`}>Leaving</th>
          <th className={`total-header current-current`}>Total</th>
          <th className={`current-past`}>LEFT</th>
          {
            futureStatuses.map(status => (<th className={`future`} key={status.Code || ''}>{status.Description || ''}</th>))
          }
          <th className={`total-header future`}>Total</th>
        </tr>
        </thead>
        <tbody>
        {
          Object.keys(yearLevelCampusMap).map(campusCode => {
            const campusYearLevels = yearLevelCampusMap[campusCode] || [];
            return (
              <>
                {
                  (yearLevelCampusMap[campusCode]).map(yearLevel => {
                    return (
                      <tr key={`${campusCode}-${yearLevel.YearLevelSort}`} className={'year-level-row'}>
                        <td className={'border-right'}>{yearLevel.Description}</td>

                        {
                          currentFutureStatuses.map((status, index) => (<td className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`} key={status.Code || ''}>{getClickableNumber(getStudents(currentFutureStudents, [yearLevel], [status.Code]))}</td>))
                        }

                        <td>{getClickableNumber(getStudents(startDuringYearStudents, [yearLevel]))}</td>
                        <td>{getClickableNumber(getStudents(startBeginningOfYear, [yearLevel]))}</td>
                        <td>{getClickableNumber(getStudents(startBeforeCurrent, [yearLevel]))}</td>
                        <td>{getClickableNumber(getStudents(currentStudents, [yearLevel], [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
                        <td>{getClickableNumber(getStudents(leavingStudents, [yearLevel], [SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE]))}</td>
                        <td>{getClickableNumber(getStudents(leavingStudents, [yearLevel], [SYN_STUDENT_STATUS_ID_LEAVING]))}</td>
                        <td
                          className={'border-right sm'}>{getClickableNumber(getStudents(currentStudents, [yearLevel]))}</td>
                        <td className={'border-right'}>{getClickableNumber(getStudents(leftStudents, [yearLevel]))}</td>

                        {
                          futureStatuses.map((status, index) => (<td key={status.Code || ''}>{getClickableNumber(getStudents(nextYearStudents, [yearLevel], [status.Code]))}</td>))
                        }
                        <td>{getClickableNumber(getStudents(nextYearStudents, [yearLevel], futureStatuses.map(status => status.Code)))}</td>
                      </tr>
                    )
                  })
                }
                <tr key={`${campusCode}-total`} className={'campus-total'}>
                  <td
                    className={'border-right'}>{campusCode in campusMap ? campusMap[campusCode].Description : campusCode}</td>
                  {
                    currentFutureStatuses.map((status, index) => (<td className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`} key={status.Code || ''}>{getClickableNumber(getStudents(currentFutureStudents, campusYearLevels, [status.Code]))}</td>))
                  }

                  <td>{getClickableNumber(getStudents(startDuringYearStudents, campusYearLevels))}</td>
                  <td>{getClickableNumber(getStudents(startBeginningOfYear, campusYearLevels))}</td>
                  <td>{getClickableNumber(getStudents(startBeforeCurrent, campusYearLevels))}</td>
                  <td>{getClickableNumber(getStudents(currentStudents, campusYearLevels, [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
                  <td>{getClickableNumber(getStudents(leavingStudents, campusYearLevels, [SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE]))}</td>
                  <td>{getClickableNumber(getStudents(leavingStudents, campusYearLevels, [SYN_STUDENT_STATUS_ID_LEAVING]))}</td>
                  <td
                    className={'border-right sm'}>{getClickableNumber(getStudents(currentStudents, campusYearLevels))}</td>
                  <td className={'border-right'}>{getClickableNumber(getStudents(leftStudents, campusYearLevels))}</td>

                  {
                    futureStatuses.map((status, index) => (<td key={status.Code || ''}>{getClickableNumber(getStudents(nextYearStudents, campusYearLevels, [status.Code]))}</td>))
                  }
                  <td>{getClickableNumber(getStudents(nextYearStudents, campusYearLevels, futureStatuses.map(status => status.Code)))}</td>
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
              currentFutureStatuses.map((status, index) => (<td className={`${index < MathHelper.sub(currentFutureStatuses.length, 1) ? '' : 'border-right sm'}`} key={status.Code || ''}>{getClickableNumber(getStudents(currentFutureStudents, [], [status.Code]))}</td>))
            }

            <td>{getClickableNumber(getStudents(startDuringYearStudents))}</td>
            <td>{getClickableNumber(getStudents(startBeginningOfYear))}</td>
            <td>{getClickableNumber(getStudents(startBeforeCurrent))}</td>
            <td>{getClickableNumber(getStudents(currentStudents, [], [SYN_STUDENT_STATUS_ID_REPEATING]))}</td>
            <td>{getClickableNumber(getStudents(leavingStudents, [], [SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE]))}</td>
            <td>{getClickableNumber(getStudents(leavingStudents, [], [SYN_STUDENT_STATUS_ID_LEAVING]))}</td>
            <td className={'border-right sm'}>{getClickableNumber(getStudents(currentStudents))}</td>
            <td className={'border-right'}>{getClickableNumber(getStudents(leftStudents))}</td>

            {
              futureStatuses.map((status, index) => (<td key={status.Code || ''}>{getClickableNumber(getStudents(nextYearStudents, [], [status.Code]))}</td>))
            }
            <td>{getClickableNumber(getStudents(nextYearStudents, [], futureStatuses.map(status => status.Code)))}</td>
          </tr>
          </tfoot>
        )}
      </Table>
    )
  }

  const getExplanationPanel = () => {
    return (
      <ExplanationPanel
        variant={'info'}
        dismissible
        text={
          <>
            Current status for <u><b>{currentYear}</b></u> and <u><b>{nextYear}</b></u>:
            <ul>
              <li><b>NEW (During Year)</b>: All current students' status {SYN_STUDENT_STATUS_ID_NEW}(NEW) after 1st of Jan {currentYear}</li>
              <li><b>NEW (Start of Year)</b>: All current students' status {SYN_STUDENT_STATUS_ID_NEW}(NEW) on 1st of Jan {currentYear}</li>
              <li><b>CONTINUED</b>: All students' entry date is before Jan {currentYear}</li>
              <li><b>REPEATING</b>: All current students' status
                is <b>{SYN_STUDENT_STATUS_ID_REPEATING}</b> (Repeating).
              </li>
              <li><b>LEAVE OF ABSENCE</b>: All current students' status is <b>{SYN_STUDENT_STATUS_LEAVE_OF_ABSENCE}</b>.
              </li>
              <li><b>LEAVING</b>: All current students' status is <b>{SYN_STUDENT_STATUS_ID_LEAVING}(Leaving)</b> and
                leaving date is in the future.
              </li>
              <li><b>LEFT</b>: All current students' leaving date is in the past.</li>
            </ul>
          </>}
      />
    )
  }

  return <Wrapper>
    {getExplanationPanel()}
    <PanelTitle className={"title-row section-row display-flex align-items-center gap-2"}>
      <b className={"title"}>Campuses: </b>
      <SynCampusSelector
        className={"campus-selector"}
        allowClear={false}
        isMulti
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
    </PanelTitle>
    {getContent()}
  </Wrapper>
}

export default EnrolmentNumbersPanel;
