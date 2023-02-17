import { useState} from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import DeleteConfirmPopup from './DeleteConfirmPopup';


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
        if (deletedCallbackFn) {
          deletedCallbackFn(resp);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  return (
    <>
      <Button {...props} onClick={() => onOpenDelete ? onOpenDelete() : setIsShowingPopup(true)}>{children}</Button>
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
