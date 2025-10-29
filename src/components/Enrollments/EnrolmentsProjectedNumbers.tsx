import styled from 'styled-components';
import moment from 'moment-timezone';
import {useEffect, useState} from 'react';
import SynVFutureStudentService from '../../services/Synergetic/SynVFutureStudentService';
import MathHelper from '../../helper/MathHelper';
import iSynVFutureStudent, {FUTURE_STUDENT_STATUS_FINALISED} from '../../types/Synergetic/iSynVFutureStudent';
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

type iFutureEnrolmentsMap = {[key: number | string]: iSynVFutureStudent[]}
const Wrapper = styled.div``;
type iEnrolmentsProjectedNumbers = {
  className?: string;
  header?: React.ReactNode;
}
type iFutureStatusMap = {[key: string]: iSynLuFutureStatus}
const EnrolmentsProjectedNumbers = ({className, header}: iEnrolmentsProjectedNumbers) => {

  const [isLoading, setIsLoading] = useState(true);
  const [futureEnrolmentsMap, setFutureEnrolmentsMap] = useState<iFutureEnrolmentsMap>({});
  const currentYear = moment().year();
  const defaultYears = [MathHelper.add(currentYear, 1), MathHelper.add(currentYear, 2)];
  const [selectedYears, setSelectedYears] = useState<number[]>(defaultYears);
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<string[]>([FUTURE_STUDENT_STATUS_FINALISED]);
  const [futureStatusMap, setFutureStatusMap] = useState<iFutureStatusMap>({});

  useEffect(() => {
    if (selectedYears.length <=0 || selectedStatusCodes.length <= 0) {
      setFutureEnrolmentsMap({});
      return;
    }
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
        }),
        perPage: 99999999,
      })
    ])
      .then(([futureStatuses, futureStudentResult]) => {
        if (isCanceled) { return }
        const fStudentsMap = (futureStudentResult.data || []).reduce((map: iFutureEnrolmentsMap, fStudent) => ({
          ...map,
          [`${fStudent.FutureEnrolYear}`]: [...(map[`${fStudent.FutureEnrolYear}`] || []), fStudent],
        }), {});
        setFutureEnrolmentsMap(fStudentsMap);
        setFutureStatusMap(futureStatuses.reduce((map: iFutureStatusMap, futureStatus) => ({ ...map, [futureStatus.Code]: futureStatus }), {}))
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
  }, [selectedYears, selectedStatusCodes]);

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
          rows={Object.keys(futureEnrolmentsMap)}
          columns={[
            {
              key: 'year',
              header: '',
              cell: (col, data) => data,
            },
            ...((selectedStatusCodes || []).map(code => ({
              key: code,
              header: code in futureStatusMap ? futureStatusMap[code].Description : code,
              cell: (col: iTableColumn<string>, data: string) => {
                const records = (futureEnrolmentsMap[data] || [])
                  .filter(fStudent => fStudent.FutureStatus === code)
                  .map(fStudent => SynVFutureStudentService.mapFutureStudentToCurrent(fStudent))
                return <td key={col.key}><StudentNumberDetailsPopupBtn records={records} variant={'link'}>{records.length}</StudentNumberDetailsPopupBtn></td>;
              }
            }))),
            ...(selectedStatusCodes.length <= 1 ? [] : [{
              key: 'total',
              header: () => <th className={'text-right'}>Total</th>,
              cell: (col: iTableColumn<string>, data: string) => {
                const records = (futureEnrolmentsMap[data] || [])
                  .map(fStudent => SynVFutureStudentService.mapFutureStudentToCurrent(fStudent))
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
            }])
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
