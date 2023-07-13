import {useEffect, useState} from 'react';
import {
  iRecordType,
  iStudentAbsence,
} from '../../../types/StudentAbsence/iStudentAbsence';
import moment from 'moment-timezone';
import {Alert, Button, Spinner} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import iMessage, {MESSAGE_TYPE_ABSENCE_SYNC_TO_SYNERGETIC} from '../../../types/Message/iMessage';
import MessageService from '../../../services/MessageService';
import LoadingBtn from '../../../components/common/LoadingBtn';

type iStudentAbsenceSyncToSynergeticPanel = {
  recordType: iRecordType;
  studentAbsenceRecord: iStudentAbsence
  onSaved?: (newRecord: iStudentAbsence | null) => void;
  onIsSubmitting?: (isSubmitting: boolean) => void;
  isSaving?: boolean;
}

const StudentAbsenceSyncToSynergeticPanel = ({studentAbsenceRecord, recordType,  onSaved, onIsSubmitting, isSaving = false}: iStudentAbsenceSyncToSynergeticPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showingConfirmed, setShowingConfirmed] = useState(false);
  const [latestMsg, setLatestMsg] = useState<iMessage | null>(null);

  useEffect(() => {
    setIsSubmitting(isSaving === true);
    setIsLoading(isSaving === true);
  }, [isSaving])

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MessageService.getMessages({
        where: JSON.stringify({
          type: MESSAGE_TYPE_ABSENCE_SYNC_TO_SYNERGETIC,
          error: null,
          response: null,
          isActive: true,
        }),
        sort: 'id:DESC',
        perPage: 1,
        currentPage: 1,
      }).then(resp => {
        if(isCanceled) { return }
        setLatestMsg((resp.data || []).length > 0 ? resp.data[0] : null)
      }).catch(err => {
        if(isCanceled) { return }
        Toaster.showApiError(err);
      }).finally(() => {
        if(isCanceled) { return }
        setIsLoading(false);
      })
    return () => {
      isCanceled = true;
    }
  }, [recordType, studentAbsenceRecord])


  const doSubmit = async () => {
    const msg = await StudentAbsenceService.syncToSynergetic(studentAbsenceRecord.id, {
      type: recordType,
    });
    setLatestMsg(msg);
    Toaster.showToast(
      `Job queued successfully, please allow 5 minutes for system to process it to Synergetic.`,
      TOAST_TYPE_SUCCESS
    );
    if (onSaved) {
      const records = await StudentAbsenceService.getAll({where: JSON.stringify({id: studentAbsenceRecord.id, type: recordType}), include: `Student,AbsenceReason,CreatedBy,ApprovedBy,Expected,SyncdBy`,});
      onSaved((records.data || []).length > 0 ? records.data[0] : null);
    }
  }

  const submit = () => {
    if (onIsSubmitting) {
      onIsSubmitting(true);
    } else {
      setIsSubmitting(true);
    }
    doSubmit()
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (onIsSubmitting) {
          onIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      });
  }


  if (isSaving === true || isLoading === true || latestMsg !== null) {
    return (
      <>
        <Spinner animation={'border'} />{' '} Processing...
      </>
    );
  }

  if (studentAbsenceRecord.syncd_AbsenceEventSeq !== null && studentAbsenceRecord.syncd_at !== null) {
    return (
      <Alert variant={'info text-center'}>
        <h6>This record has been Sync'd</h6>
        <div><b>By</b> {studentAbsenceRecord.SyncdBy ? studentAbsenceRecord.SyncdBy?.NameInternal : studentAbsenceRecord.syncd_by_id}</div>
        {`${studentAbsenceRecord.syncd_at}`.trim() === '' ? null : (
          <div><b>@</b> {moment(studentAbsenceRecord.syncd_at).format('lll')}</div>
        )}
      </Alert>
    )
  }

  if (showingConfirmed === true) {
    return (
      <Alert variant={'warning'}>
        <h6>This sync process can NOT be reversed after you click the button below</h6>
        <div>
          <LoadingBtn variant={'link'} onClick={() => setShowingConfirmed(false)} isLoading={isSubmitting}>
            <Icons.X />{' '} Cancel
          </LoadingBtn>
          <LoadingBtn variant={'danger'} onClick={() => submit()} isLoading={isSubmitting}>
            <Icons.Send />{' '} Confirm and Sync Now
          </LoadingBtn>
        </div>
      </Alert>
    )
  }

  return (
    <Alert variant={'light'}>
      <Button variant={'warning'} onClick={() => setShowingConfirmed(true)}>
        <Icons.Upload />{' '} Sync To Synergetic
      </Button>
    </Alert>
  )
}

export default StudentAbsenceSyncToSynergeticPanel;
