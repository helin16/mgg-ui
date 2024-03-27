import * as Icons from 'react-bootstrap-icons';
import {Alert} from 'react-bootstrap';
import React from 'react';

type iExplanationPanel = {
  text: any;
  icon?: any;
  variant?: string;
  dismissible?: boolean;
}

const ExplanationPanel = ({text, icon, variant, dismissible}: iExplanationPanel) => {
  return (
    <Alert variant={variant || 'secondary'} dismissible={dismissible}>
      {icon || <Icons.ExclamationOctagonFill />} {text}
    </Alert>
  )
}


export default ExplanationPanel;
