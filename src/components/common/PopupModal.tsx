import React from 'react';
import {Modal} from 'react-bootstrap';

const PopupModal = ({handleClose, size, footer, body, header, title, ...props}: any) => {
console.log(props.show);
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
    if (!body) {
      return null;
    }
    return (
      <Modal.Body>
        {body}
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
    <Modal onHide={handleClose} {...props}>
      {getHeader()}
      {getBody()}
      {getFooter()}
    </Modal>
  )
};

export default PopupModal;
