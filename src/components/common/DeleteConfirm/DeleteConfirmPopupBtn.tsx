import { useState} from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import Toaster from '../../../services/Toaster';


type iDeleteConfirmPopupBtnProps = ButtonProps & {
  closePopup?: () => void;
  onOpenDelete?: () => void;
  deletingFn: () => Promise<any>;
  deletedCallbackFn?: (resp: any) => void;
  confirmString: string;
  confirmBtnString?: string;
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
  onOpenDelete,
  isShowing = false,
  isDeleting = false,
  ...props
}: iDeleteConfirmPopupBtnProps) => {
  const [isShowingPopup, setIsShowingPopup] = useState(isShowing);
  const [isSubmitting, setIsSubmitting] = useState(isDeleting);

  const submitDeletion = () => {
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

  return (
    <>
      <Button {...props} title={title} onClick={() => onOpenDelete ? onOpenDelete() : setIsShowingPopup(true)}>{children}</Button>
      <DeleteConfirmPopup
        description={description}
        onConfirm={submitDeletion}
        isDeleting={isSubmitting}
        isOpen={isShowingPopup}
        confirmString={confirmString}
        onClose={() => closePopup ? closePopup() : setIsShowingPopup(false)}
      />
    </>
  )
};

export default DeleteConfirmPopupBtn;
