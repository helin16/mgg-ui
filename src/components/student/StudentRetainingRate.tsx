import styled from 'styled-components';
import {Alert, Spinner} from 'react-bootstrap';
import moment from 'moment-timezone';
import MathHelper from '../../helper/MathHelper';
import {useEffect, useState} from 'react';
import Toaster from '../../services/Toaster';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import iVStudent, {iVPastAndCurrentStudent} from '../../types/Synergetic/Student/iVStudent';
import Table, {iTableColumn} from '../common/Table';
import * as _ from 'lodash';

const Wrapper = styled.div``

type iStudentRetainingRate = {
  testId?: string;
  className?: string;
}
const StudentRetainingRate = ({ testId, className }: iStudentRetainingRate) => {
  const ComponentName = 'StudentRetainingRate';
  const testIdString = `${ComponentName}-${testId || ''}`;
  const [isLoading, setIsLoading] = useState(false);
  const [currentYearStudents, setCurrentYearStudents] = useState<iVStudent[]>([]);
  const [startYearStudents, setStartYearStudents] = useState<iVPastAndCurrentStudent[]>([]);
  const [rate, setRate] = useState<number | null>(null);
  const currentYear = moment().year();
  const startYear = MathHelper.sub(moment().year(), 3);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    Promise.all([
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          StudentActiveFlag: true,
          FileYear: currentYear,
          StudentYearLevel: 12,
        }),
        perPage: 999999999,
      }),
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          StudentYearLevel: 9,
          StudentActiveFlag: true,
          FileYear: startYear,
        }),
        perPage: 999999999,
      })
    ]).then(resp => {
      if (isCancelled) { return }
      const cYearStudents = _.uniqBy(resp[0] || [], (s => s.StudentID));
      const sYearStudents = _.uniqBy(resp[1].data || [], (s => s.StudentID));
      const startYearStudentIds = sYearStudents.map(s => s.StudentID);
      const currentYearStudentIds = cYearStudents.map(s => s.StudentID);
      const rate = MathHelper.div(startYearStudentIds.filter(startYearStudentId => currentYearStudentIds.indexOf(startYearStudentId)).length, startYearStudentIds.length);

      setStartYearStudents(sYearStudents);
      setCurrentYearStudents(cYearStudents);
      setRate(rate);
    }).catch(err => {
      if (isCancelled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCancelled) { return }
      setIsLoading(false);
    })
    return () => {
      isCancelled = true;
    }
  }, [startYear, currentYear]);

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />
    }
    return (
      <div>
        <h2>Rate: {rate ? `${MathHelper.mul(rate, 100).toFixed(2)}%` : ''}</h2>
        <Table rows={startYearStudents} responsive columns={[{
          key: "student",
          header: 'Student',
          cell: (column: iTableColumn<iVPastAndCurrentStudent>, data: iVPastAndCurrentStudent) => {
            return data.StudentNameInternal || ''
          }
        }, {
          key: "startYear",
          header: `status in ${startYear}`,
          cell: (column: iTableColumn<iVPastAndCurrentStudent>, data: iVPastAndCurrentStudent) => {
            return data.StudentStatusDescription || ''
          }
        }, {
          key: "inCurrentYear",
          header: `Still in ${currentYear}`,
          cell: (column: iTableColumn<iVPastAndCurrentStudent>, data: iVPastAndCurrentStudent) => {
            const currentYearStudentIds = currentYearStudents.map(s => s.StudentID);
            return currentYearStudentIds.indexOf(data.StudentID) >= 0 ? 'Yes' : ''
          }
        }, {
          key: "currentYearStatus",
          header: `status in ${currentYear}`,
          cell: (column: iTableColumn<iVPastAndCurrentStudent>, data: iVPastAndCurrentStudent) => {
            return startYearStudents.filter(s => s.StudentID === data.StudentID).map(s => s.StudentStatusDescription).join(', ')
          }
        }]} />
      </div>
    )
  }

  return (
    <Wrapper data-testid={testIdString} className={`${ComponentName} ${className || ''}`}>
      <Alert dismissible>
        <b>Retaining Rate</b>
        <div>Rate = those students enrolled in Year 9 in {startYear}, continued to complete Year 12 in {currentYear}</div>
      </Alert>
      {getContent()}
    </Wrapper>
  )
}

export default StudentRetainingRate;
