import {Button, ButtonProps} from 'react-bootstrap';
import {useState} from 'react';
import SchoolManagementEditPanel from './SchoolManagementEditPanel';
import iSchoolManagementTeam from '../../types/Synergetic/iSchoolManagementTeam';
import PopupModal from '../common/PopupModal';

type iSchoolManagementEditPopupBtn = ButtonProps & {
  isShowing?: boolean;
  schoolManagementTeam?: iSchoolManagementTeam &
    {
      SchoolSeniorTeamID?: number,
      FileYear?: number,
      FileSemester?: number
    };
  onSaved?: (team: iSchoolManagementTeam) => void;
}
const SchoolManagementEditPopupBtn = ({
  children,
  schoolManagementTeam,
  onSaved,
  isShowing = false,
  ...props
}: iSchoolManagementEditPopupBtn) => {
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
        header={<b>{`${schoolManagementTeam?.SchoolSeniorTeamID || ''}`.trim() !== '' ? 'Editing' : 'Creating'}</b>}
      >
        <SchoolManagementEditPanel
          onSaved={(newData) => {
            if (onSaved) {
              onSaved(newData)
            } else {
              setIsShowingPopup(false);
            }
          }}
          isSaving={isSubmitting}
          schoolManagementTeam={schoolManagementTeam}
          onIsSubmitting={(isSubmitting) => setIsSubmitting(isSubmitting)}
          onCancel={handleClose}
        />
      </PopupModal>
    )
  }

  return (
    <>
      <Button {...props} onClick={() => setIsShowingPopup(true)}>{children}</Button>
      {getPopup()}
    </>
  )
}


export default SchoolManagementEditPopupBtn;
