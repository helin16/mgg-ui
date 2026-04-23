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
import Table from '../common/Table';
import {iVPastAndCurrentStudent} from '../../types/Synergetic/Student/iVStudent';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import {MGG_CAMPUS_CODES} from '../../types/Synergetic/Lookup/iSynLuCampus';
import * as _ from 'lodash';

type iStudentMap = {[key: number | string]: iVPastAndCurrentStudent[]}
const Wrapper = styled.div``;
type iRetentionRatesPanel = {
  className?: string;
  header?: React.ReactNode;
}
const RetentionRatesPanel = ({className, header}: iRetentionRatesPanel) => {

  const [isLoading, setIsLoading] = useState(true);
  const [studentMap, setStudentMap] = useState<iStudentMap>({});
  const currentYear = moment().year();
  const defaultYears = [MathHelper.sub(currentYear, 1), currentYear];
  const [selectedYears, setSelectedYears] = useState<number[]>(defaultYears);

  useEffect(() => {
    if (selectedYears.length <=0 ) {
      setStudentMap({});
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    Promise.all([
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          FileYear: selectedYears,
          StudentCampus: MGG_CAMPUS_CODES
        }),
        perPage: 99999999,
      })
    ])
      .then(([studentResult]) => {
        if (isCanceled) { return }
        const students = (studentResult.data || []);
        const sMap = students.reduce((map: iStudentMap, student) => ({
          ...map,
          [`${student.FileYear}`]: _.uniqBy([...(map[`${student.FileYear}`] || []), student], (st) => st.StudentID),
        }), {});
        setStudentMap(sMap);
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

  const getStudentsStartBefore1Jan = (year: number | string) => {
    const students = year in studentMap ? studentMap[year] : [];
    const startOfYear = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
    return students
      .filter(student => {
        const startDate = `${student.StudentEntryDate || ''}`.trim();
        if (startDate === '') {
          return true;
        }
        if (moment(startDate).year() < Number(year)) {
          return true;
        }
        const [startDateDate, ] = startDate.split('T');
        return startDateDate <= startOfYear;
      })
      .filter(student => {
        const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
        if (leavingDate === '') {
          return true;
        }
        if (moment(leavingDate).year() > Number(year)) {
          return true;
        }
        const [endDateDate, ] = leavingDate.split('T');
        return endDateDate > startOfYear;
      })
  }

  const getStudentsLeftBefore31Dec = (year: number | string) => {
    const students = getStudentsStartBefore1Jan(year);
    const endOfYear = moment(`${year}-12-31`).endOf('year').format('YYYY-MM-DD');
    return students
      .filter(student => {
        const leavingDate = `${student.StudentLeavingDate || ''}`.trim();
        if (leavingDate === '') {
          return false;
        }
        if (moment(leavingDate).year() > Number(year)) {
          return false;
        }
        if (student.StudentYearLevel === 12 && moment(leavingDate).month() >= 11) {
          return false;
        }
        const [endDateDate, ] = leavingDate.split('T');
        return endDateDate <= endOfYear;
      })
  }

  const getContent = () => {
    if (isLoading) {
      return <Spinner />
    }
    return (
      <>
        <FlexContainer className={'search-fields gap-2 justify-content-between'}>
          <div>
            <FormLabel label={`Years`} />
            <FileYearSelector
              values={selectedYears}
              isMulti
              max={currentYear}
              allowClear={false}
              onSelects={(years) => {setSelectedYears(years === null ? defaultYears : years)}}
            />
          </div>
          <Alert>All Year 12 students who is leaving in Dec are NOT treated as leavers.</Alert>
        </FlexContainer>
        <Table
          hover
          striped
          rows={Object.keys(studentMap)}
          columns={[
            {
              key: 'year',
              header: '',
              cell: (col, data) => <td key={col.key}>{data}</td>,
            },
            {
              key: 'before',
              header: `Started before or on 1s Jan`,
              cell: (col, data) => {
                const records = getStudentsStartBefore1Jan(Number(data));
                if (records.length < 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}><StudentNumberDetailsPopupBtn records={records} variant={'link'}>{records.length}</StudentNumberDetailsPopupBtn></td>;
              },
            },
            {
              key: 'left',
              header: `Left or leaving before or on 31 Dec`,
              cell: (col, data) => {
                const records = getStudentsLeftBefore31Dec(Number(data));
                if (records.length < 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}><StudentNumberDetailsPopupBtn records={records} variant={'link'}>{records.length}</StudentNumberDetailsPopupBtn></td>;
              },
            },
            {
              key: 'rate',
              header: `Rate`,
              cell: (col, data) => {
                const started = getStudentsStartBefore1Jan(Number(data));
                const leftIds = getStudentsLeftBefore31Dec(Number(data)).map(st => st.StudentID);
                const remained = started.filter(st => leftIds.indexOf(st.StudentID) < 0 );
                if (started.length < 0) {
                  return <td key={col.key}></td>;
                }
                return <td key={col.key}>{MathHelper.mul(MathHelper.div(remained.length, started.length), 100).toFixed(2)} %</td>;
              },
            },
          ]}
        />
      </>
    )
  }

  return (
    <Wrapper className={`${className || ''} ${RetentionRatesPanel.name}`}>
      <div className={'header-wrapper'}>{getHeader()}</div>
      {getContent()}
    </Wrapper>
  )
}

export default RetentionRatesPanel;
