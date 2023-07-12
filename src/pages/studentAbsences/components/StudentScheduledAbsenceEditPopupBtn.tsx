import {Button, ButtonProps} from 'react-bootstrap';
import PopupModal from '../../../components/common/PopupModal';
import {useState} from 'react';
import {
  iRecordType,
} from '../../../types/StudentAbsence/iStudentAbsence';
import StudentAbsenceService from '../../../services/StudentAbsences/StudentAbsenceService';
import iVStudent from '../../../types/Synergetic/iVStudent';
import iStudentAbsenceSchedule from '../../../types/StudentAbsence/iStudentAbsenceSchedule';
import StudentScheduledAbsenceEditPanel from './StudentScheduledAbsenceEditPanel';

type iStudentScheduledAbsenceEditPopupBtn = ButtonProps & {
  recordType: iRecordType;
  isShowing?: boolean;
  studentScheduledAbsence?: iStudentAbsenceSchedule
  onSaved?: (newRecord: iStudentAbsenceSchedule) => void;
  student?: iVStudent;
}

// @ts-ignore
const StudentScheduledAbsenceEditPopupBtn = ({studentScheduledAbsence, recordType, children, onSaved, student, isShowing = false, ...rest}: iStudentScheduledAbsenceEditPopupBtn) => {
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
        header={<h5>{`${studentScheduledAbsence?.id || ''}`.trim() !== '' ? `Editing` : 'Creating'} <u>Scheduled {StudentAbsenceService.getAbsenceTypeName(recordType)}</u>: {studentScheduledAbsence?.Event?.Student ? studentScheduledAbsence?.Event?.Student.StudentNameInternal : null}</h5>}
      >
        <StudentScheduledAbsenceEditPanel
          recordType={recordType}
          student={student}
          onSaved={(newData) => {
            setIsShowingPopup(false);
            if (onSaved) {
              onSaved(newData)
            }
          }}
          isSaving={isSubmitting}
          scheduledAbsence={studentScheduledAbsence}
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

export default StudentScheduledAbsenceEditPopupBtn;
