import React from 'react';
import {Modal} from 'react-bootstrap';
import AppWrapper from '../../AppWrapper';
import {ModalProps} from 'react-bootstrap/Modal';

export type iPopupModal = ModalProps & {
  handleClose?: () => void;
  footer?: any;
  body?: any;
  header?: any;
  title?: any;
  fullWidth?: boolean
}
const PopupModal = ({handleClose, footer, body, header, title, children, fullWidth, ...props}: iPopupModal) => {
  const getHeader = () => {
    if (!header && !title) {
      return null;
    }
    return (
      <Modal.Header closeButton={handleClose !== undefined}>
        {title ? <Modal.Title>{title}</Modal.Title> : header}
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
    <Modal onHide={handleClose} {...props} className={`PopupModal ${fullWidth !== undefined ? 'full-width' : ''}`}>
      <AppWrapper className={'modal-wrapper'}>
        {getHeader()}
        {getBody()}
        {getFooter()}
      </AppWrapper>
    </Modal>
  )
};

export default PopupModal;
