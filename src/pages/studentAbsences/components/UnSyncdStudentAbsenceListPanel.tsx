import React from 'react';
import styled from 'styled-components';
import {
  iRecordType,
  iStudentAbsence,
} from '../../../types/StudentAbsence/iStudentAbsence';
import {useEffect, useState} from 'react';
import iPaginatedResult from '../../../types/iPaginatedResult';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import {Table} from 'react-bootstrap';
import moment from 'moment-timezone';
import * as Icons from 'react-bootstrap-icons';
import DeleteConfirmPopupBtn from '../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import MathHelper from '../../../helper/MathHelper';
import StudentAbsenceEditPopupBtn from './StudentAbsenceEditPopupBtn';

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
const UnSyncdStudentAbsenceListPanel = ({type}: iStudentAbsenceListPanel) => {
  const [records, setRecords] = useState<iPaginatedResult<iStudentAbsence>>()
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    StudentAbsenceService.getAll({
        where: JSON.stringify({
          type: type,
          active: true,
          syncd_at: null,
          syncd_by_id: null,
          syncd_AbsenceEventSeq: null,
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


  const getExpectedAndActualTime = (record: iStudentAbsence) => {
    if (record.Expected) {
      return (
        <>
          <small><b>Expected:</b> {moment(record.Expected.EventDate).format('lll')}</small>
          <small><b>Actual:</b> {moment(record.EventDate).format('lll')}</small>
        </>
      )
    }
    if (record.isExpectedEvent === true) {
      return <small><b>Expected:</b> {moment(record.EventDate).format('lll')}</small>
    }
    return <small><b>Actual:</b> {moment(record.EventDate).format('lll')}</small>;
  }


  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <Table className={'record-table'} responsive>
        <thead>
          <tr>
            <th colSpan={2}>Student</th>
            <th>Form</th>
            <th>Parent Slip?</th>
            <th>Date</th>
            <th>Reason</th>
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
                    {`${record.Student?.profileUrl || ''}`.trim() !== '' ?  <img src={`${record.Student?.profileUrl || ''}`.trim()} alt={'student profile'}/> : null}
                  </td>
                  <td className={'student'}>
                    <StudentAbsenceEditPopupBtn
                      recordType={type}
                      studentAbsenceRecord={record}
                      variant={'link'}
                      size={'sm'}
                      onSaved={() => setCount(MathHelper.add(count, 1))}
                    >
                      {record.Student?.StudentNameInternal}
                    </StudentAbsenceEditPopupBtn>
                  </td>
                  <td className={'form'}>
                    <div>{record.Student?.StudentForm}</div>
                  </td>
                  <td className={'has-note'}>
                    <div>{record.hasNote ? <span className={'text-success'} title={'parent knows'}><Icons.CheckSquareFill /></span> : null}</div>
                  </td>
                  <td className={'date'}>
                    <div>{moment(record.EventDate).format('DD/MMM/YYYY')}</div>
                  </td>
                  <td className={'reason'} rowSpan={2}>
                    <div><b>{record.AbsenceCode} - {record.AbsenceReason?.Description}</b></div>
                  </td>
                  <td className={'created'} rowSpan={3}>
                    <div><b>By:</b> {record.CreatedBy?.Surname}, {record.CreatedBy?.Given1}</div>
                    <div><b>@:</b>{moment(record.created_at).format('lll')}</div>
                  </td>
                  <td className={'approved'} rowSpan={3}>
                    {record.ApprovedBy ? <div><b>By:</b> {record.ApprovedBy?.Surname}, {record.ApprovedBy?.Given1}</div> : null}
                    {`${record.approved_at || ''}`.trim() === '' ? null : <div><b>@:</b>{moment(record.approved_at).format('lll')}</div>}
                  </td>
                  <td className={'btns text-right'} rowSpan={3}>
                    <DeleteConfirmPopupBtn
                      deletingFn={() => StudentAbsenceService.remove(record.id, {type})}
                      confirmString={`${record.id}`}
                      variant={'danger'}
                      size={'sm'}
                      deletedCallbackFn={() => setCount(MathHelper.add(count, 1))}
                    >
                      <Icons.Trash />
                    </DeleteConfirmPopupBtn>
                  </td>
                </tr>
                <tr className={'row-mid'}>
                  <td colSpan={5}>
                    {getExpectedAndActualTime(record)}
                  </td>
                </tr>
                <tr className={'row-bottom'}>
                  <td colSpan={8}>
                    <small className={'text-muted'}>Comments: {record.Comments}</small>
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

export default UnSyncdStudentAbsenceListPanel;
