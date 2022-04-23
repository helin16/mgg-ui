import {ChangeEvent, useState} from 'react';
import PopupModal from './PopupModal';
import {Button, ButtonProps, FormControl} from 'react-bootstrap';
import styled from 'styled-components';
import LoadingBtn from './LoadingBtn';

const Wrapper = styled.div`
  input {
    margin: 4px 0;
  }
  .confirm-text-wrapper {
    font-size: 10px;
    .confirm-text {
      background-color: #5c636a;
      color: white;
      padding: 2px 4px;
      border-radius: 4px;
    }
  }
`


type iDeleteConfirmPopupBtnProps = ButtonProps & {
  closePopup?: () => void;
  deletingFn: () => Promise<any>;
  deletedCallbackFn?: (resp: any) => void;
  confirmString: string;
  title?: any;
  description?: any;
}

const DeleteConfirmPopupBtn = ({children, closePopup, title, description, confirmString, deletingFn, deletedCallbackFn, ...props}: iDeleteConfirmPopupBtnProps) => {
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmedText = (event: ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(event.target.value === confirmString)
  }

  const submitDeletion = () => {
    setIsDeleting(true);
    return deletingFn()
      .then(resp => {
        if (deletedCallbackFn) {
          deletedCallbackFn(resp);
        }
      })
      .finally(() => {
        setIsDeleting(false);
      })
  }

  const getPopup = () => {
    if (isShowingPopup !== true) {
      return null;
    }
    return (
      <PopupModal
        show={isShowingPopup}
        handleClose={() => setIsShowingPopup(false)}
        title={title || 'Are you sure?'}
        footer = {
          <>
            <Button variant={'link'} onClick={() => setIsShowingPopup(false)}>Cancel</Button>
            <LoadingBtn
              isLoading={isDeleting}
              disabled={isConfirmed !== true}
              variant={'danger'}
              onClick={() => submitDeletion()}>
              Delete
            </LoadingBtn>
          </>
        }
      >
        <Wrapper>
          <div className={'description-wrapper'}>
            {description || 'You are about to delete the selected item.'}
          </div>
          <FormControl type={'text'} placeholder={confirmString} onChange={handleConfirmedText}/>
          <div className={'confirm-text-wrapper'}>
            Please type in <span className={'confirm-text'}>{confirmString}</span> into above text box to confirm deletion.
          </div>
        </Wrapper>
      </PopupModal>
    )
  }

  return (
    <>
      <Button {...props} onClick={() => setIsShowingPopup(true)}>{children}</Button>
      {getPopup()}
    </>
  )
};

export default DeleteConfirmPopupBtn;
