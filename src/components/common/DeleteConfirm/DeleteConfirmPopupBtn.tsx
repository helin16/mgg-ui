import {useEffect, useState} from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import Toaster from '../../../services/Toaster';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';


type iDeleteConfirmPopupBtnProps = ButtonProps & {
  closePopup?: () => void;
  onOpenDelete?: () => void;
  deletingFn?: () => Promise<any>;
  deletedCallbackFn?: (resp: any) => void;
  confirmString?: string;
  confirmBtnString?: string;
  confirmBtnVariant?: string;
  title?: any;
  description?: any;
  isShowing?: boolean;
  isDeleting?: boolean;
}

const DeleteConfirmPopupBtn = ({
  children,
  closePopup,
  title,
  description,
  confirmString,
  deletingFn,
  deletedCallbackFn,
  confirmBtnString = 'Delete',
  confirmBtnVariant = 'danger',
  onOpenDelete,
  isShowing = false,
  isDeleting = false,
  ...props
}: iDeleteConfirmPopupBtnProps) => {
  const {user: currentUser} = useSelector((state: RootState) => state.auth);
  const [isShowingPopup, setIsShowingPopup] = useState(isShowing);
  const [isSubmitting, setIsSubmitting] = useState(isDeleting);
  const [confirmStr, setConfirmStr] = useState('na');

  useEffect(() => {
    const confirmStrTrimmed = `${confirmString || ''}`.trim();
    setConfirmStr(confirmStrTrimmed === '' ? `${(currentUser?.synergyId || Math.ceil(Math.random() * 100000))}` : confirmStrTrimmed);
  }, [confirmString, currentUser]);

  const submitDeletion = () => {
    if (!deletingFn) {
      return;
    }

    setIsSubmitting(true);
    return deletingFn()
      .then(resp => {
        setIsShowingPopup(false);
        if (deletedCallbackFn) {
          deletedCallbackFn(resp);
        }
      })
      .catch(err => Toaster.showApiError(err))
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  if (!deletingFn) {
    return null;
  }

  return (
    <>
      <Button {...props} title={title} onClick={() => onOpenDelete ? onOpenDelete() : setIsShowingPopup(true)}>{children}</Button>
      <DeleteConfirmPopup
        description={description}
        onConfirm={submitDeletion}
        isDeleting={isSubmitting}
        isOpen={isShowingPopup}
        confirmString={confirmStr}
        confirmBtnString={confirmBtnString}
        confirmBtnVariant={confirmBtnVariant}
        onClose={() => closePopup ? closePopup() : setIsShowingPopup(false)}
      />
    </>
  )
};

export default DeleteConfirmPopupBtn;
