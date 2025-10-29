import styled from 'styled-components';
import moment from 'moment-timezone';
import {useEffect, useState} from 'react';
import SynVFutureStudentService from '../../services/Synergetic/SynVFutureStudentService';
import MathHelper from '../../helper/MathHelper';
import {FUTURE_STUDENT_STATUS_FINALISED} from '../../types/Synergetic/iSynVFutureStudent';
import Toaster from '../../services/Toaster';
import { Spinner} from 'react-bootstrap';
import FileYearSelector from '../student/FileYearSelector';
import FormLabel from '../form/FormLabel';
import StudentNumberDetailsPopupBtn from '../reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn';
import {FlexContainer} from '../../styles';
import SynLuFutureStatusSelector from '../lookup/SynLuFutureStatusSelector';
import Table, {iTableColumn} from '../common/Table';
import SynLuFutureStatusService from '../../services/Synergetic/Lookup/SynLuFutureStatusService';
import iSynLuFutureStatus from '../../types/Synergetic/Lookup/iSynLuFutureStatus';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import {MGG_CAMPUS_CODES} from '../../types/Synergetic/Lookup/iSynLuCampus';
import iVStudent from '../../types/Synergetic/Student/iVStudent';
import * as _ from 'lodash';
import {OP_AND, OP_GTE, OP_LTE} from '../../helper/ServiceHelper';

type iFutureEnrolmentsMap = {[key: number | string]: iVStudent[]}
type iFutureStatusMap = {[key: string]: iSynLuFutureStatus}
const Wrapper = styled.div``;
type iEnrolmentsProjectedNumbers = {
  className?: string;
  header?: React.ReactNode;
}
const EnrolmentsProjectedNumbers = ({className, header}: iEnrolmentsProjectedNumbers) => {

  const [isLoading, setIsLoading] = useState(true);
  const [futureEnrolmentsMap, setFutureEnrolmentsMap] = useState<iFutureEnrolmentsMap>({});
  const currentYear = moment().year();
  const defaultYears = [MathHelper.add(currentYear, 1), MathHelper.add(currentYear, 2)];
  const [selectedYears, setSelectedYears] = useState<number[]>(defaultYears);
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<string[]>([FUTURE_STUDENT_STATUS_FINALISED]);
  const [futureStatusMap, setFutureStatusMap] = useState<iFutureStatusMap>({});
  const [currentStudents, setCurrentStudents] = useState<iVStudent[]>([]);

  useEffect(() => {
    if (selectedYears.length <=0 || selectedStatusCodes.length <= 0) {
      setFutureEnrolmentsMap({});
      return;
    }
    const minSelectedYear = _.min(selectedYears);
    const maxSelectedYear = _.max(selectedYears);
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynLuFutureStatusService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
        })
      }),
      SynVFutureStudentService.getAll({
        where: JSON.stringify({
          FutureEnrolYear: selectedYears,
          FutureStatus: selectedStatusCodes,
          [OP_AND]: [
            { FutureEnrolYear: {[OP_GTE]: minSelectedYear}},
            { FutureEnrolYear: {[OP_LTE]: maxSelectedYear}},
          ]
        }),
        perPage: 99999999,
      }),
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          FileYear: currentYear,
          StudentCampus: MGG_CAMPUS_CODES,
          CurrentSemesterOnlyFlag: true,
        }),
        sort: 'FileSemester:DESC',
      })
    ])
      .then(([futureStatuses, futureStudentResult, currentStudentResult]) => {
        if (isCanceled) { return }
        const fStudentsMap = (futureStudentResult.data || []).reduce((map: iFutureEnrolmentsMap, fStudent) => ({
          ...map,
          [`${fStudent.FutureEnrolYear}`]: [...(map[`${fStudent.FutureEnrolYear}`] || []), SynVFutureStudentService.mapFutureStudentToCurrent(fStudent)],
        }), {});
        setFutureEnrolmentsMap(fStudentsMap);
        setFutureStatusMap(futureStatuses.reduce((map: iFutureStatusMap, futureStatus) => ({ ...map, [futureStatus.Code]: futureStatus }), {}));
        setCurrentStudents(_.uniqBy(currentStudentResult, st => st.StudentID))
      })
      .catch(err => {
        if (isCanceled) { return }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) { return }
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [selectedYears, selectedStatusCodes, currentYear]);

  const getHeader = () => {
    if (header) {
      return header;
    }
    return (
      <FlexContainer className={'gap-3 justify-content-between align-items-end'}>
        <FormLabel label={`All Future students with status`} />
      </FlexContainer>
    )
  }

  const getFutureTotal = (year: string  | number, statusCodes: string[] = [], isExact = true) => {
    const fStudents = isExact === true ? (futureEnrolmentsMap[year] || []) : Object.keys(futureEnrolmentsMap).reduce((arr: iVStudent[], yr) => {
      if (Number(yr) > Number(year)) {
        return arr;
      }
      const fSt = yr in futureEnrolmentsMap ? futureEnrolmentsMap[yr] : [];
      return [...arr, ...fSt];
    }, []);

    return fStudents
      .filter(fStudent => statusCodes.length <= 0 ?  true : statusCodes.indexOf(fStudent.StudentStatus) >= 0)
  }

  const getFutureLeftTotal = (year: string  | number, statusCodes: string[] = [], isExact = true) => {
    const yearNumber = Number(year);
    const yearDiff = MathHelper.sub(yearNumber, currentYear);
    return getFutureTotal(year, statusCodes, isExact).filter(student => {
      let yearLevel = Number(student.StudentEntryYearLevel);
      if (yearLevel === 30) {
        yearLevel = -2;
      } else if (yearLevel === 40) {
        yearLevel = -1;
      }
      return MathHelper.add(yearLevel, yearDiff) > 12;
    })
  }

  const getCurrentStudents = (year: string | number) => {
    return currentStudents.filter(student => {
      const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
      if (leavingDate !== '' && moment(leavingDate).year() <= Number(currentYear)) {
        return false;
      }
      return true;
    });
  }

  const getContinuedStudents = (year: string | number) => {
    const yearNumber = Number(year);
    const yearDiff = MathHelper.sub(yearNumber, currentYear);
    return _.uniqBy(getCurrentStudents(year)
      // filter leaving date
      .filter(student => {
        const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
        if (leavingDate !== '' && Number(moment(leavingDate).year()) < Number(year)) {
          return false;
        }
        return true;
      })
      // filter year level
      .filter((student) => {
        let yearLevel = Number(student.StudentYearLevel);
        if (yearLevel === 30) {
          yearLevel = -2;
        } else if (yearLevel === 40) {
          yearLevel = -1;
        }
        return MathHelper.add(yearLevel, yearDiff) <= 12;
      }), st => st.StudentID);
  }

  const getCurrentStudentLeavingInThatYear = (year: string | number) => {
    return getCurrentStudents(year)
      // filter leaving date
      .filter(student => {
        const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
        if (leavingDate !== '' && `${moment(leavingDate).year() || ''}`.trim() === `${year || ''}`.trim()) {
          return true;
        }
        return false;
      })
  }

  const getCurrentStudentReturningInThatYear = (year: string | number) => {
    return currentStudents
      // filter leaving date
      .filter(student => {
        const returningDate = `${student.StudentReturningDate || ''}`.trim();
        if (returningDate !== '' && `${moment(returningDate).year() || ''}`.trim() === `${year || ''}`.trim()) {
          return true;
        }
        return false;
      })
  }

  const getFinishingStudents = (year: string | number) => {
    return getCurrentStudentLeavingInThatYear(year);
  }

  const getTotal = (year: string | number) => {
    const lastYear = MathHelper.sub(Number(year), 1);
    const continuedStudents = getContinuedStudents(year);
    const previousYearFutureLeftIds = getFutureLeftTotal(lastYear, [], false).map(student => student.StudentID);
    const previousYearFuture = getFutureTotal(lastYear, [], false).filter(student => previousYearFutureLeftIds.indexOf(student.StudentID) < 0);
    const futureStudents = getFutureTotal(year);
    const returningStudents = getCurrentStudentReturningInThatYear(year)
      .filter(student => {
        const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
        const returningDate = `${student.StudentReturningDate || ''}`.trim();
        if (leavingDate !== '' && returningDate !== '' && moment(leavingDate) > moment(returningDate)) {
          return false;
        }
        return true;
      });
    const finishingStudentIds = getFinishingStudents(year).map(student=> student.StudentID);

    const totalStudents = [
      ...(
        [...continuedStudents, ...previousYearFuture, ...futureStudents].filter(st => finishingStudentIds.indexOf(st.StudentID) < 0)
      ),
      ...returningStudents
    ];
    return _.uniqBy(totalStudents, st => st.StudentID);
  }

  const getContent = () => {
    if (isLoading) {
      return <Spinner />
    }
    return (
      <>
        <FlexContainer className={'search-fields gap-2'}>
          <FileYearSelector
            values={selectedYears}
            isMulti
            min={MathHelper.add(currentYear, 1)}
            max={MathHelper.add(currentYear, 20)}
            allowClear={false}
            renderOptions={years => years.reverse()}
            onSelects={(years) => {setSelectedYears(years === null ? defaultYears : years)}}
          />
          <SynLuFutureStatusSelector
            values={selectedStatusCodes}
            isMulti
            allowClear={false}
            onSelect={(selected) => {
              setSelectedStatusCodes(
                selected === null ?
                  [FUTURE_STUDENT_STATUS_FINALISED]
                  : (
                    Array.isArray(selected) ?
                      selected.map(option => option.value)
                      // @ts-ignore
                      : [option.value]
                  ))
            }}
          />
        </FlexContainer>
        <Table
          hover
          striped
          rows={selectedYears.map(year => `${year}`)}
          columns={[
            {
              key: 'year',
              header: '',
              cell: (col, data) => data,
            },
            {
              key: 'currentStudents',
              header: 'Continued',
              cell: (col, data) => {
                const records = getContinuedStudents(data);
                if (records.length <= 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}>
                  <StudentNumberDetailsPopupBtn
                    records={records}
                    variant={'link'}>
                    {records.length}
                  </StudentNumberDetailsPopupBtn>
                </td>
              },
            },
            {
              key: 'withdraw',
              header: '- Withdraw',
              cell: (col, data) => {
                const records = getCurrentStudentLeavingInThatYear(data);
                if (records.length <= 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}>
                  <StudentNumberDetailsPopupBtn
                    records={records}
                    variant={'link'}>
                    {records.length}
                  </StudentNumberDetailsPopupBtn>
                </td>
              },
            },
            {
              key: 'returning',
              header: '+ Returning',
              cell: (col, data) => {
                const records = getCurrentStudentReturningInThatYear(data);
                if (records.length <= 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}>
                  <StudentNumberDetailsPopupBtn
                    records={records}
                    variant={'link'}>
                    {records.length}
                  </StudentNumberDetailsPopupBtn>
                </td>
              },
            },
            {
              key: 'lastYearFuture',
              header: (col: iTableColumn<string>) => <th key={col.key}>+ Future Prev Year(s)</th>,
              cell: (col, data) => {
                const lastYear = MathHelper.sub(Number(data), 1);
                const records = getFutureTotal(lastYear, [], false);

                if (records.length <= 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}>
                  <StudentNumberDetailsPopupBtn
                    records={records}
                    variant={'link'}
                  >
                    {records.length}
                  </StudentNumberDetailsPopupBtn>
                </td>
              },
            },
            {
              key: 'lastYearFutureGrade',
              header: (col: iTableColumn<string>) => <th key={col.key}>- Future Prev Year(s) Graduate</th>,
              cell: (col, data) => {
                const lastYear = MathHelper.sub(Number(data), 1);
                const records = getFutureLeftTotal(lastYear, [], false);

                if (records.length <= 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}>
                  <StudentNumberDetailsPopupBtn
                    records={records}
                    variant={'link'}
                  >
                    {records.length}
                  </StudentNumberDetailsPopupBtn>
                </td>
              },
            },
            ...((selectedStatusCodes || []).map(code => ({
              key: code,
              header: (col: iTableColumn<string>) => <th key={col.key}>+ {code in futureStatusMap ? futureStatusMap[code].Description : code}</th>,
              cell: (col: iTableColumn<string>, data: string) => {
                const records = getFutureTotal(data, [code]);
                if (records.length <= 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}><StudentNumberDetailsPopupBtn records={records} variant={'link'}>{records.length}</StudentNumberDetailsPopupBtn></td>;
              }
            }))),
            {
              key: 'total',
              header: (col: iTableColumn<string>) => <th className={'text-right'} key={col.key}>Total</th>,
              cell: (col: iTableColumn<string>, data: string) => {
                const records = getTotal(data);
                return (
                  <td key={col.key} className={'text-right'}>
                    <StudentNumberDetailsPopupBtn
                      records={records}
                      variant={'link'}>
                      {records.length}
                    </StudentNumberDetailsPopupBtn>
                  </td>
                );
              }
            }
          ]}
        />
      </>
    )
  }

  return (
    <Wrapper className={`${className || ''} ${EnrolmentsProjectedNumbers.name}`}>
      <div className={'header-wrapper'}>{getHeader()}</div>
      {getContent()}
    </Wrapper>
  )
}

export default EnrolmentsProjectedNumbers;
