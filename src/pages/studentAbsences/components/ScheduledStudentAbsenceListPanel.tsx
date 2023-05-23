import React from 'react';
import styled from 'styled-components';
import {
  iRecordType,
} from '../../../types/StudentAbsence/iStudentAbsence';
import {useEffect, useState} from 'react';
import iPaginatedResult from '../../../types/iPaginatedResult';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import {Table} from 'react-bootstrap';
import StudentScheduledAbsenceService from '../../../services/StudentAbsences/StudentScheduledAbsenceService';
import iStudentAbsenceSchedule from '../../../types/StudentAbsence/iStudentAbsenceSchedule';

const Wrapper = styled.div`
  .student-img {
    width: 60px;
    img {
      width: 100%;
      height: auto;
    }
  }
  
  .record-table {
    td {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    tr.row-mid {
      td {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    }
    
    tr:not(.row-bottom) {
      td:not(.student-img),
      td:not(.created),
      td:not(.btns),
      td:not(.approved) {
        border-bottom: 0px;
      }
    }

    .form {
      width: 50px;
    }
    
    .has-note {
      width: 100px;
      font-size: 18px;
    }
    
    .student {
      .btn {
        padding: 0px;
        font-size: 12px;
      }
    }
    
    .reason {
      width: 260px;
    }
    
    .created,
    .approved {
      width: 160px;
      font-size: 12px;
    }
  }
`;

type iStudentAbsenceListPanel = {
  type: iRecordType;
}
const ScheduledStudentAbsenceListPanel = ({type}: iStudentAbsenceListPanel) => {
  const [records, setRecords] = useState<iPaginatedResult<iStudentAbsenceSchedule>>()
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    StudentScheduledAbsenceService.getAll({
        where: JSON.stringify({
          type: type,
          active: true,
        }),
        include: `Student,AbsenceReason,CreatedBy,ApprovedBy,Expected,SyncdBy`,
        sort: 'id:DESC'
      })
      .then(resp => {
        if(isCanceled) return;
        setRecords(resp);
      })
      .catch(err => {
        if(isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if(isCanceled) return;
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }
  }, [type, count]);


  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <Table className={'record-table'} responsive>
        <thead>
          <tr>
            <th colSpan={2}>Student</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Created</th>
            <th>Approved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {(records?.data || [])
          .map(record => {
            return (
              <React.Fragment key={record.id}>
                <tr >
                  <td className={'student-img'} rowSpan={3}>
                    {`${record.Event?.Student?.profileUrl || ''}`.trim() !== '' ?  <img src={`${record.Event?.Student?.profileUrl || ''}`.trim()} /> : null}
                  </td>
                  <td className={'student'}>
                    {record.Event?.Student?.StudentNameInternal}
                  </td>
                </tr>
                <tr className={'row-mid'}>
                  <td colSpan={5}>
                  </td>
                </tr>
                <tr className={'row-bottom'}>
                  <td colSpan={8}>
                    <small className={'text-muted'}>Comments: {record.Event?.Comments}</small>
                  </td>
                </tr>
              </React.Fragment>
            )
        })}
        </tbody>
      </Table>
    </Wrapper>
  )
}

export default ScheduledStudentAbsenceListPanel;
