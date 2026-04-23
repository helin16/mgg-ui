import styled from 'styled-components';
import moment from 'moment-timezone';
import {useEffect, useState} from 'react';
import MathHelper from '../../helper/MathHelper';
import Toaster from '../../services/Toaster';
import {Alert, Spinner} from 'react-bootstrap';
import FileYearSelector from '../student/FileYearSelector';
import FormLabel from '../form/FormLabel';
import StudentNumberDetailsPopupBtn from '../reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn';
import {FlexContainer} from '../../styles';
import Table, {iTableColumn} from '../common/Table';
import {iVPastAndCurrentStudent} from '../../types/Synergetic/Student/iVStudent';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import {CAMPUS_CODE_SHORT_TERM} from '../../types/Synergetic/Lookup/iSynLuCampus';
import SynLuYearLevelService from '../../services/Synergetic/Lookup/SynLuYearLevelService';
import iSynLuYearLevel from '../../types/Synergetic/Lookup/iSynLuYearLevel';
import * as _ from 'lodash';

type iStudentMap = {[key: number | string]: iVPastAndCurrentStudent[]}
const Wrapper = styled.div``;
type iShortTermStayNumbers = {
  className?: string;
  header?: React.ReactNode;
}
const ShortTermStayNumbers = ({className, header}: iShortTermStayNumbers) => {

  const [isLoading, setIsLoading] = useState(true);
  const [studentMap, setStudentMap] = useState<iStudentMap>({});
  const currentYear = moment().year();
  const defaultYears = [MathHelper.sub(currentYear, 1), currentYear];
  const [selectedYears, setSelectedYears] = useState<number[]>(defaultYears);
  const [yearLevels, setYearLevels] = useState<iSynLuYearLevel[]>([]);
  const [studentYrLvls, setStudentYrLvls] = useState<string[]>([]);

  useEffect(() => {
    if (selectedYears.length <=0 ) {
      setStudentMap({});
      setYearLevels([]);
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: CAMPUS_CODE_SHORT_TERM
        }),
        sort: 'YearLevelSort:ASC',
      }),
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          FileYear: selectedYears,
          StudentCampus: CAMPUS_CODE_SHORT_TERM
        }),
        perPage: 99999999,
      })
    ])
      .then(([yrLevels, studentResult]) => {
        if (isCanceled) { return }
        const students = (studentResult.data || []);
        const sMap = students.reduce((map: iStudentMap, student) => ({
          ...map,
          [`${student.FileYear}`]: _.uniqBy([...(map[`${student.FileYear}`] || []), student], (st) => st.StudentID),
        }), {});
        setStudentMap(sMap);
        setStudentYrLvls(students.map(student => `${student.StudentYearLevel || ''}`));
        setYearLevels(yrLevels);
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
  }, [selectedYears]);

  const getHeader = () => {
    if (header) {
      return header;
    }
    return null;
  }

  const getContent = () => {
    if (isLoading) {
      return <Spinner />
    }
    return (
      <>
        <FlexContainer className={'search-fields gap-2 justify-content-between'}>
          <div>
            <FormLabel label={`All Short Term students`} />
            <FileYearSelector
              values={selectedYears}
              isMulti
              max={currentYear}
              allowClear={false}
              onSelects={(years) => {setSelectedYears(years === null ? defaultYears : years)}}
            />
          </div>
          <Alert>Short Terms Stay Students: All Student with Campus Code is {CAMPUS_CODE_SHORT_TERM}.</Alert>
        </FlexContainer>
        <Table
          hover
          striped
          rows={selectedYears.map(yr => `${yr}`)}
          columns={[
            {
              key: 'year',
              header: '',
              cell: (col, data) => <td key={col.key}>{data}</td>,
            },
            ...((yearLevels || [])
              .filter(yrLvl => studentYrLvls.indexOf(`${yrLvl.Code}`) >=0)
              .map(yearLevel => ({
                key: `${yearLevel.Code || ''}`.trim(),
                header: (col: iTableColumn<string>) => <th key={col.key} className={'text-center'}>{yearLevel.Description}</th>,
                cell: (col: iTableColumn<string>, data: string) => {
                  const records = (studentMap[data] || [])
                    .filter(student => `${student.StudentYearLevel}`.trim() === `${yearLevel.Code}`.trim());
                  if (records.length <= 0) {
                    return <td key={col.key}></td>
                  }
                  return <td key={col.key} className={'text-center'}><StudentNumberDetailsPopupBtn records={records} variant={'link'}>{records.length}</StudentNumberDetailsPopupBtn></td>;
                }
              }))
            ),
            ...((yearLevels || []).length <= 1 ? [] : [{
              key: 'total',
              header: () => <th className={'text-right'}>Total</th>,
              cell: (col: iTableColumn<string>, data: string) => {
                const records = (studentMap[data] || []);
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
    <Wrapper className={`${className || ''} ${ShortTermStayNumbers.name}`}>
      <div className={'header-wrapper'}>{getHeader()}</div>
      {getContent()}
    </Wrapper>
  )
}

export default ShortTermStayNumbers;
