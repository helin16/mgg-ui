import {Button, ButtonProps} from 'react-bootstrap';
import PopupModal from '../../../components/common/PopupModal';
import {useState} from 'react';
import {
  iRecordType,
  iStudentAbsence,
} from '../../../types/StudentAbsence/iStudentAbsence';
import StudentAbsenceEditPanel from './StudentAbsenceEditPanel';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import iVStudent from '../../../types/Synergetic/iVStudent';

type iStudentAbsenceEditPopupBtn = ButtonProps & {
  recordType: iRecordType;
  isShowing?: boolean;
  isExpectedEvent?: boolean;
  studentAbsenceRecord?: iStudentAbsence
  onSaved?: (newRecord: iStudentAbsence | null, jobQueued: boolean) => void;
  student?: iVStudent;
}

// @ts-ignore
const StudentAbsenceEditPopupBtn = ({studentAbsenceRecord, recordType, children, onSaved, student, isExpectedEvent = false, isShowing = false, ...rest}: iStudentAbsenceEditPopupBtn) => {
  const [isShowingPopup, setIsShowingPopup] = useState(isShowing);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setIsShowingPopup(false)
  }

  const getPopup = () => {
    return (
      <PopupModal
        show={isShowingPopup}
        size={'lg'}
        dialogClassName={'modal-80w'}
        handleClose={handleClose}
        header={<h5>{`${studentAbsenceRecord?.id || ''}`.trim() !== '' ? `Editing` : 'Creating'} <u>{StudentAbsenceService.getAbsenceTypeName(recordType)}</u>: {studentAbsenceRecord?.Student ? studentAbsenceRecord?.Student.StudentNameInternal : null}</h5>}
      >
        <StudentAbsenceEditPanel
          recordType={recordType}
          student={student}
          isExpectedEvent={isExpectedEvent}
          onSaved={(newData, jobQueued) => {
            setIsShowingPopup(false);
            if (onSaved) {
              onSaved(newData, jobQueued)
            }
          }}
          isSaving={isSubmitting}
          studentAbsenceRecord={studentAbsenceRecord}
          onIsSubmitting={(isSubmitting) => setIsSubmitting(isSubmitting)}
          onCancel={handleClose}
        />
      </PopupModal>
    )
  }

  return (
    <>
      <Button {...rest} onClick={() => setIsShowingPopup(true)}>{children}</Button>
      {getPopup()}
    </>
  )
}

export default StudentAbsenceEditPopupBtn;
