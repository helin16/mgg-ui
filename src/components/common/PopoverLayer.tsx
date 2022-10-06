import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const PopoverLayer = ({body, header, children, popoverProps, triggerProps}: any) => {

  const getHeader = () => {
    if (!header) {
      return null;
    }
    return (
      <Popover.Header>
        {header}
      </Popover.Header>
    )
  }

  const getBody = () => {
    if (!body) {
      return null;
    }
    return (
      <Popover.Body>
        {body}
      </Popover.Body>
    )
  }

  const getPopover = () => {
    return (
      <Popover {...popoverProps}>
        {getHeader()}
        {getBody()}
      </Popover>
    )
  }

  return (
    <OverlayTrigger overlay={getPopover()} {...triggerProps}>
      {children}
    </OverlayTrigger>
  )
};

export default PopoverLayer;
