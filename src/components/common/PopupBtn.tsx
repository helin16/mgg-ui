import {useState} from 'react';
import PopupModal, {iPopupModal} from './PopupModal';
import {FlexContainer} from '../../styles';
import {Button, ButtonProps} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';

type iPopupBtn = ButtonProps & {
  popupProps: iPopupModal;
  onClosed?: () => void;
}
const PopupBtn = ({popupProps, onClosed, ...props}: iPopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);

  const handleClose = () => {
    setShowingPopup(false);
    onClosed && onClosed();
  };

  const getPopup = () => {
    if (showingPopup !== true) {
      return null;
    }

    return (
      <PopupModal
        size={"lg"}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <Button onClick={() => handleClose()}>
              <Icons.XLg /> Close
            </Button>
          </FlexContainer>
        }
        {...popupProps}
        show={showingPopup}
        handleClose={() => handleClose()}
      />
    );
  };

  return (
    <>
      <Button {...props} onClick={() => setShowingPopup(true)} />
      {getPopup()}
    </>
  );
}

export default PopupBtn;
