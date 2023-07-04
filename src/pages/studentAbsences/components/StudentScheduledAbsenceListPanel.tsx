import React from 'react';
import {
  iRecordType,
  iStudentAbsence,
} from '../../../types/StudentAbsence/iStudentAbsence';
import {useEffect, useState} from 'react';
import iPaginatedResult from '../../../types/iPaginatedResult';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';

type iStudentScheduledAbsenceListPanel = {
  type: iRecordType;
}
const StudentScheduledAbsenceListPanel = ({type}: iStudentScheduledAbsenceListPanel) => {
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


  // const getExpectedAndActualTime = (record: iStudentAbsence) => {
  //   if (record.Expected) {
  //     return (
  //       <>
  //         <small><b>Expected:</b> {moment(record.Expected.EventDate).format('lll')}</small>
  //         <small><b>Actual:</b> {moment(record.EventDate).format('lll')}</small>
  //       </>
  //     )
  //   }
  //   if (record.isExpectedEvent === true) {
  //     return <small><b>Expected:</b> {moment(record.EventDate).format('lll')}</small>
  //   }
  //   return <small><b>Actual:</b> {moment(record.EventDate).format('lll')}</small>;
  // }


  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    null
  )
}

export default StudentScheduledAbsenceListPanel;
