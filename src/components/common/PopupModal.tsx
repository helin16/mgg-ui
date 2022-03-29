import React from 'react';
import {Modal} from 'react-bootstrap';

const PopupModal = ({handleClose, footer, body, header, title, children, ...props}: any) => {

  const getHeader = () => {
    if (!header && !title) {
      return null;
    }
    return (
      <Modal.Header closeButton={handleClose !== undefined}>
        {title ? <Modal.Title>{title}</Modal.Title> : body}
      </Modal.Header>
    )
  }

  const getBody = () => {
    if (!children) {
      return null;
    }
    return (
      <Modal.Body>
        {children}
      </Modal.Body>
    )
  }

  const getFooter = () => {
    if (!footer) {
      return null;
    }
    return (
      <Modal.Footer>
        {footer}
      </Modal.Footer>
    )
  }

  return (
    <Modal onHide={handleClose} {...props} className={'PopupModal'}>
      {getHeader()}
      {getBody()}
      {getFooter()}
    </Modal>
  )
};

export default PopupModal;
