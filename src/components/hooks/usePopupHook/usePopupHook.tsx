import { useState } from "react";
import PopupModal, { iPopupModal } from "../../common/PopupModal";

type iUsePopupHook = {
  popupProps: iPopupModal;
};
const usePopupHook = ({ popupProps }: iUsePopupHook) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const getPopup = () => {
    if (isOpen !== true) {
      return null;
    }

    return (
      <PopupModal
        {...popupProps}
        show={isOpen}
        handleClose={() => {
          handleClose();
          popupProps.handleClose && popupProps.handleClose();
        }}
      />
    );
  };

  return {
    isOpen,
    getPopup,
    closePopup: () => setIsOpen(false),
    openPopup: () => setIsOpen(true)
  };
};

export default usePopupHook;
