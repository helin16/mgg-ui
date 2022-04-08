import React, {useEffect, useState} from 'react';
import PopupModal from './PopupModal';

const WindowOpen = ({url}: {url: string}) => {
  const [isShowingPopup, setIsShowingPopup] = useState(false);

  useEffect(() => {
    if (`${url || ''}`.trim() === '') {
      return;
    }
    const newWin = window.open(url);
    if (!newWin) {
      setIsShowingPopup(true);
    }
  }, [url]);

  if (isShowingPopup !== true) {
    return null;
  }

  const closePopup = () => {
    setIsShowingPopup(false);
  }

  return (
    <PopupModal
      show={isShowingPopup}
      handleClose={closePopup}
    >
      <h4>Your browser has blocked popup for this link</h4>
      <p>Please click the following link to open it manually:</p>
      <p><a href={url} target={'__blank'}>{url}</a></p>
    </PopupModal>
  )
};

export default WindowOpen;
